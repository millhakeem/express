import { injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dato: UserLoginDto) => Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
	async createUser({ name, email, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(name, email);
		await newUser.setPassword(password);
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
