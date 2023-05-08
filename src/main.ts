import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter, IExceptionFilter } from './errors/exception-filter';
import { ILogger, LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { IUserController, UserController } from './user/user.controller';
import { IUserService, UserService } from './user/user.service';

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const apBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
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
