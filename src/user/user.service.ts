import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { applyPsqlFilter, hashPassword } from 'core';
import { UserAlreadyExistsException } from './user.errors';
import { UserUpdateDto, UserUpdateMineDto } from './dto/user-update-mine.dto';
import { UserGetDto } from './dto/user-get.dto';
import { FileService } from '../file/file.service';
import { UserCreateDto } from './dto/user-create.dto';

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
      throw new UserAlreadyExistsException();
    }
    if (user.password) {
      user.password = await hashPassword(user.password, 10);
    }
    let userCreated = await this.create(user);
    return await this.fileService.executeFileTransaction({
      files: file ? [file] : undefined,
      folder: 'user',
      async handler(manager, files) {
        userCreated.image = files.at(0);
        return manager.save(User, userCreated);
      },
    });
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
    return await this.fileService.executeFileTransaction({
      files: file ? [file] : undefined,
      deleteIds: file && user.image ? [user.image!.id] : undefined,
      folder: 'user',
      handler: async (manager, files) => {
        if (files.at(0)) {
          user.image = files.at(0);
        }
        return await manager.save(User, user);
      },
    });
  }

  async deletePhoto(id: string) {
    let user = await this.findById(id);
    if (user.image) {
      await this.fileService.deleteFiles([user.image.id]);
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
