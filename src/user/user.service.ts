import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserRepository } from './user.repository';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

	async createUser({ email, password, name }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);

		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}

		return this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(email);
		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email);
	}
}
