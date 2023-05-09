import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Не верно указан email' })
	email: string;

	@IsString()
	password: string;
}
