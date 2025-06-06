import { Injectable } from '@nestjs/common';
import { IAbstractStorage } from 'src/abstract/abstract-storage.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { User as PrismaUser } from '@prisma/client';
import { UpdatePasswordDto } from '../dto/update-user-password.dto';

function mapPrismaUserToEntity(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    login: prismaUser.login,
    password: prismaUser.password,
    createdAt: prismaUser.createdAt.getTime(),
    updatedAt: prismaUser.updatedAt.getTime(),
    version: prismaUser.version,
  };
}

@Injectable()
export class PrismaUserStorage
  implements IAbstractStorage<User, CreateUserDto, UpdatePasswordDto>
{
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => mapPrismaUserToEntity(user));
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) return null;
    return mapPrismaUserToEntity(user);
  }

  async filterByIds(ids: string[]) {
    return [];
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });
    return mapPrismaUserToEntity(user);
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
    return mapPrismaUserToEntity(user);
  }

  async delete(id: string) {
    const result = await this.prisma.user.delete({ where: { id: id } });
    if (result) {
      return true;
    }
    return false;
  }
}
