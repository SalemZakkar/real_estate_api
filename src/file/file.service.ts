import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppFile, FileStatus } from './entity/app-file.entity';
import * as fs from 'node:fs/promises';
import { Brackets, DataSource, Repository } from 'typeorm';
import { extname, join, resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'node:crypto';
import { dirname } from 'node:path';
import { transaction } from 'core';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(AppFile) private readonly repo: Repository<AppFile>,
    private readonly ds: DataSource,
  ) {}
  ROOT = process.env.FILE_STORE!;

  async getById(id: UUID) {
    let file = await this.repo.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException();
    }
    try {
      await fs.access(file.path);
      return file;
    } catch (e) {
      await this.repo.delete({ id: id });
      throw new NotFoundException();
    }
  }

  async store(file: Express.Multer.File, folder: string) : Promise<AppFile>{
    let path = this.generatePath(folder, file);
    return await transaction(this.ds, async (em) => {
      let repo = em.getRepository(AppFile);
      let entity = await repo.save({
        path: path,
        type: file.mimetype,
      });
      await fs.mkdir(dirname(path), { recursive: true });
      await fs.writeFile(path, file.buffer);
      return entity;
    });
  }

  async delete(id: UUID, repo?: Repository<AppFile>) {
    let fRep = repo || this.repo;
    let res = await fRep.findOneBy({ id });
    if (res) {
      await fRep.softRemove(res);
    }
  }

  async use(id: UUID, repo?: Repository<AppFile>) {
    let fRep = repo || this.repo;
    let res = await fRep.findOneBy({ id });
    if (!res) {
      throw new NotFoundException();
    }
    return await fRep.save({ ...res, status: FileStatus.used });
  }

  async cleanUp(fileIds?: string[]) {
    const queryBuilder = this.repo.createQueryBuilder('file');
    if (fileIds?.length) {
      queryBuilder
        .where('file.id IN (:...ids)', { ids: fileIds })
        .withDeleted()
        .andWhere(
          new Brackets((qb) => {
            qb.where('file.status != :used', { used: 'used' }).orWhere(
              'file.deletedAt IS NOT NULL',
            );
          }),
        );
    } else {
      queryBuilder
        .withDeleted()
        .where('file.status != :status', { status: FileStatus.used })
        .orWhere('file.deletedAt IS NOT NULL');
    }
    const files = await queryBuilder.getMany();

    for (const file of files) {
      try {
        if (await this.fileExists(file.path)) {
          await fs.unlink(file.path);
        }
        await this.repo.remove(file);
      } catch (e) {
        console.log('Error deleting file from disk/db');
        console.log(e);
      }
    }
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private generatePath(folder: string, file: Express.Multer.File) {
    const uploadsRoot = join(this.ROOT, folder);
    const ext = extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    // console.log(join(uploadsRoot, filename));
    return join(uploadsRoot, filename);
  }
}

// async saveFile(opts: { files: Express.Multer.File[]; folder: string }) {
//   let q: { path: string; file: Express.Multer.File }[];
//   let qr = this.ds.createQueryRunner();
//   await qr.connect();
//   await qr.startTransaction();
//   let res: AppFile[] = [];
//   q = opts.files.map((e) => {
//     return {
//       path: this.generatePath(opts.folder, e),
//       file: e,
//     };
//   });
//   try {
//     res = await Promise.all(
//       q.map(async (e) => {
//         let f = qr.manager.create(AppFile, {
//           path: e.path,
//           type: e.file.mimetype,
//         });
//         f = await qr.manager.save(AppFile, f);
//         return f;
//       }),
//     );
//     await Promise.all(
//       q.map(async (e) => {
//         await fs.mkdir(dirname(e.path), { recursive: true });
//         await fs.writeFile(e.path, e.file.buffer);
//       }),
//     );
//     await qr.commitTransaction();
//     return res;
//   } catch (e) {
//     await qr.rollbackTransaction();
//     await Promise.all(
//       q.map(async (e) => {
//         try {
//           await fs.unlink(e.path);
//         } catch (_) {}
//       }),
//     ).catch((e) => console.error(e));
//     throw e;
//   } finally {
//     await qr.release();
//   }
// }

// async deleteFiles(ids: UUID[]) {
//   let files = await this.repo.findBy({ id: In(ids) });
//   const softDeleted: AppFile[] = [];

//   for (const file of files) {
//     try {
//       await fs.unlink(file.path);
//       await this.repo.remove(file);
//     } catch (err) {
//       await this.repo.softDelete(file.id);
//       softDeleted.push(file);
//     }
//   }

//   return {
//     deleted: files.length - softDeleted.length,
//     softDeleted: softDeleted.length,
//   };
// }

// async getManyByIds(id: UUID[]) {
//   let files = await this.repo.findBy({ id: In(id) });
//   if (files.length != id.length) {
//     let k = files.map((e) => e.id);
//     let not = id.filter((e) => !k.includes(e));
//     throw new NotFoundException('Files ' + not + ' Not Found');
//   }
//   return files;
// }

// async executeFileTransaction(opt: {
//   queryRunner?: QueryRunner;
//   deleteIds?: UUID[];
//   files?: Express.Multer.File[];
//   folder?: string;
//   handler: (manager: EntityManager, files: AppFile[]) => Promise<any>;
// }) {
//   if (!opt.folder && opt.files?.length) {
//     throw new Error('Folder is Required');
//   }
//   const qr = opt.queryRunner || this.ds.createQueryRunner();
//   let createdFiles: { path: string; file: Express.Multer.File }[] = [];
//   let savedFiles: AppFile[] = [];

//   if (!opt.queryRunner) {
//     await qr.connect();
//     await qr.startTransaction();
//   }
//   try {
//     if (opt.files?.length) {
//       createdFiles = opt.files.map((f) => ({
//         file: f,
//         path: this.generatePath(opt.folder || 'default', f),
//       }));

//       savedFiles = await Promise.all(
//         createdFiles.map(async (f) => {
//           const entity = qr.manager.create(AppFile, {
//             path: f.path,
//             type: f.file.mimetype,
//           });
//           return await qr.manager.save(AppFile, entity);
//         }),
//       );

//       await Promise.all(
//         createdFiles.map(async (f) => {
//           await fs.mkdir(join(this.ROOT, opt.folder || 'default'), {
//             recursive: true,
//           });
//           await fs.writeFile(f.path, f.file.buffer);
//         }),
//       );
//     }

//     let res = await opt.handler(qr.manager, savedFiles);

//     let filesToCleanup: AppFile[] = [];

//     if (opt.deleteIds?.length) {
//       const oldFiles = await qr.manager.getRepository(AppFile).findBy({
//         id: In(opt.deleteIds),
//       });

//       filesToCleanup = oldFiles;

//       await qr.manager.softDelete(AppFile, opt.deleteIds);
//     }

//     if (!opt.queryRunner) {
//       await qr.commitTransaction();
//     }
//     this.cleanupFiles(filesToCleanup);
//     return res;
//   } catch (err) {
//     if (!opt.queryRunner) {
//       await qr.rollbackTransaction();
//     }

//     await Promise.all(
//       createdFiles.map(async (f) => {
//         try {
//           await fs.unlink(f.path);
//         } catch (_) {
//           const repo = qr.manager.getRepository(AppFile);
//           const record = await repo.findOne({
//             where: { path: f.path },
//           });
//           if (record) await repo.softDelete(record.id);
//         }
//       }),
//     );
//     throw err;
//   } finally {
//     if (!opt.queryRunner) {
//       await qr.release();
//     }
//   }
// }

// private async cleanupFiles(files: AppFile[]) {
//   const repo = this.ds.getRepository(AppFile);
//   for (const file of files) {
//     try {
//       await fs.unlink(file.path);
//       await repo.delete(file.id);
//     } catch {}
//   }
// }
