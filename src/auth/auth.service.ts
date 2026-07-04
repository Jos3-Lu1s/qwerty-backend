import { Injectable, BadRequestException, InternalServerErrorException, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const hashedPassword = bcrypt.hashSync(password, 10);

      const user = this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      const { password: _, ...result } = user;
      return {
        ...result,
        token: this.getJwtToken({ id: user.id }),
      };

    } catch (error: any) {
      this.handleDbErrors(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...toUpdate } = updateUserDto;

    const user = await this.userRepository.preload({
      id,
      ...toUpdate,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    try {
      await this.userRepository.save(user);
      const { password: _, ...result } = user;
      return result;
    } catch (error: any) {
      this.handleDbErrors(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        isActive: true,
        roles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk to an admin');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    const { password: _, ...result } = user;
    return {
      ...result,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDbErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Email already in use');
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
