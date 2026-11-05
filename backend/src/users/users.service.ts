import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity.js';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Пользователь с email ${email} не найден`);
    }
    return user;
  }

  async findAll(params: SearchUserParams): Promise<User[]> {
    const { limit, offset, email, name, contactPhone } = params;
    const where: any = {};

    if (email) where.email = Like(`%${email}%`);
    if (name) where.name = Like(`%${name}%`);
    if (contactPhone) where.contactPhone = Like(`%${contactPhone}%`);

    return this.usersRepository.find({
      where,
      take: limit,
      skip: offset,
    });
  }
}
