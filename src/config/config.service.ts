import { DotenvConfigOutput, DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config-service.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service';
import { inject, injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Неудалось прочитать .env или он отсутствует', 'ConfigService');
		} else {
			this.config = result.parsed!;
		}
	}

	getConfig(key: string): string {
		return this.config[key];
	}
}
