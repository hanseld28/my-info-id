import { getLogger } from '../log/logger';

export type LoggerInstance = ReturnType<typeof getLogger>;

export interface WithLogger {
  logger: LoggerInstance;
}