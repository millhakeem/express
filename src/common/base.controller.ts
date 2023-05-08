import { NextFunction, Request, Response, Router } from 'express';
import { LoggerService } from '../logger/logger.service';
import { injectable } from 'inversify';
import { IMiddleware } from './middleware.interface';

export interface BaseRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	middlewares?: IMiddleware[];
}
@injectable()
export abstract class BaseConroller {
	private readonly _router: Router;

	constructor(private logger: LoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response<T, Record<string, unknown>> {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): Response<T, Record<string, unknown>> {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response<unknown, Record<string, unknown>> {
		return res.sendStatus(2001);
	}

	protected bindRouter(routes: BaseRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map(m => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
