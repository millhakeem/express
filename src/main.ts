import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { IConfigService } from './config/config-service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { ExceptionFilter, IExceptionFilter } from './errors/exception-filter';
import { ILogger, LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IUserController, UserController } from './user/user.controller';
import { IUserRepository, UserRepository } from './user/user.repository';
import { IUserService, UserService } from './user/user.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const apBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(apBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
