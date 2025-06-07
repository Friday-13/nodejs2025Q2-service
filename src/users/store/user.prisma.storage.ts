import { Injectable } from '@nestjs/common';
import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { User as PrismaUser } from '@prisma/client';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaUserStorage
  implements IAbstractStorage<User, CreateUserDto, UpdatePasswordDto>
{
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany();
    return this.mapUsersToEntities(users);
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) return null;
    return this.mapUserToEntity(user);
  }

  async filterByIds(ids: string[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids } },
    });
    return this.mapUsersToEntities(users);
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return this.mapUserToEntity(user);
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: dto.newPassword,
        version: {
          increment: 1,
        },
      },
    });
    return this.mapUserToEntity(user);
  }

  async delete(id: string) {
    try {
      await this.prisma.user.delete({ where: { id: id } });
      return true;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          return false;
        }
      }
      throw err;
    }
  }

  private mapUserToEntity(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      login: prismaUser.login,
      password: prismaUser.password,
      createdAt: prismaUser.createdAt.getTime(),
      updatedAt: prismaUser.updatedAt.getTime(),
      version: prismaUser.version,
    };
  }

  private mapUsersToEntities(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((user) => this.mapUserToEntity(user));
  }
}
