import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppHttpError,
  applyPsqlFilter,
  ErrorCommonCodes,
  hashPassword,
  transaction,
} from 'core';
import { UserUpdateDto, UserUpdateMineDto } from './dto/user-update-mine.dto';
import { UserGetDto } from './dto/user-get.dto';
import { FileService } from '../file/file.service';
import { UserCreateDto } from './dto/user-create.dto';
import { AppFile } from '../file/entity/app-file.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @Inject() private readonly fileService: FileService,
  ) {}

  async create(user: UserCreateDto, file?: Express.Multer.File) {
    if (
      await this.repo.exists({
        where: { email: user.email, phone: user.phone },
      })
    ) {
      throw new AppHttpError({
        code: ErrorCommonCodes.userAlreadyExists,
        statusCode: HttpStatus.CONFLICT,
        message: 'User Already Exists',
      });
    }
    if (user.password) {
      user.password = await hashPassword(user.password, 10);
    }
    let userCreated = this.repo.create(user);
    if (!file) {
      return await this.repo.save(userCreated);
    }
    let newImage: AppFile | null;
    return await transaction(
      this.repo.manager.connection,
      async (em) => {
        newImage = await this.fileService.store(file, 'user');
        userCreated.image = newImage;
        let res = await em.save(User, userCreated);
        await this.fileService.use(res.image!.id, em.getRepository(AppFile));
        return res;
      },
      {
        onError: () => {
          if (newImage) {
            this.fileService.cleanUp([newImage.id]);
          }
        },
      },
    );
  }

  async find(
    params?: UserGetDto,
  ): Promise<{ data: User[]; totalRecords: number }> {
    let qb = this.repo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.image', 'file');
    qb.addOrderBy('u.createdAt', 'DESC');
    applyPsqlFilter({
      queryBuilder: qb,
      query: params,
      options: {
        nameOptions: {
          newName: 'name',
        },
        name: {
          regExp: {
            regexp: 'contains',
          },
        },
      },
    });
    let [data, count] = await qb.getManyAndCount();
    return { data: data, totalRecords: count };
  }

  async findOne(params: FindOptionsWhere<User>) {
    return this.repo.findOne({ where: params });
  }

  async findById(id: string) {
    let user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User ' + id + ' Not Found');
    }
    return user;
  }

  async findOneAndUpdate(
    id: string,
    params?: UserUpdateDto | UserUpdateMineDto,
    file?: Express.Multer.File,
  ) {
    let user = await this.findById(id);

    if (params) {
      user = this.repo.merge(user, params);
    }
    if (!file) {
      return await this.repo.save(user);
    }
    let oldImage = user.image;
    let newImage: AppFile | null = null;
    return transaction(
      this.repo.manager.connection,
      async (em) => {
        let repo = em.getRepository(User);
        let fRepo = em.getRepository(AppFile);
        if (oldImage) {
          await this.fileService.delete(oldImage.id, fRepo);
        }
        newImage = await this.fileService.store(file, 'user');
        user.image = newImage;
        await this.fileService.use(newImage!.id, fRepo);
        return await repo.save(user);
      },
      {
        onDone: () => {
          if (oldImage) {
            this.fileService.cleanUp([oldImage!.id]);
          }
        },
        onError: () => {
          if (newImage) {
            this.fileService.cleanUp([newImage!.id]);
          }
        },
      },
    );
  }

  async deletePhoto(id: string) {
    let user = await this.findById(id);
    if (user.image) {
      await this.fileService.delete(user.image!.id);
      this.fileService.cleanUp([user.image!.id]);
      user.image = null;
    }
    return user;
  }

  async setPassword(id: string, password: string) {
    let user = await this.findById(id);
    user.password = await hashPassword(password, 10);
    await this.repo.save(user);
  }

  async createOrExists(phone: string, repo: Repository<User> = this.repo) {
    let user = await repo.findOne({ where: { phone } });
    if (!user) {
      user = new User();
      user.phone = phone;
      await repo.save(user);
    }
    return user;
  }
}
