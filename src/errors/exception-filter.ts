import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { HTTPError } from './http-error.class';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

export interface IExceptionFilter {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.Logger) private logger: LoggerService) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
