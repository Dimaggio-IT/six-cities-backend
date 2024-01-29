import { DotenvParseOutput, config } from 'dotenv';
import { IConfig } from './config.interface.js';
import { ILogger } from '../index.js';

export class RestConfig implements IConfig {
  private readonly config: NodeJS.ProcessEnv;

  constructor(
    private readonly logger: ILogger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
