import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseConroller } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddleware } from '../common/validate.middleware';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
@injectable()
export class UserController extends BaseConroller implements IUserController {
	constructor(
		@inject(TYPES.Logger) private loggerService: LoggerService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRouter([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		this.ok(res, 'login');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует', 'register'));
		}
		this.ok(res, { email: result.email });
	}
}
