import { LoggerService } from '@nestjs/common';

export const CONFIG_OPTIONS = 'LALAMOVE_CONFIG_OPTIONS';

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface LalamoveOptions {
  apiKey: string;
  secret: string;
  partnerPortal?: boolean;
  sandbox?: boolean;
  logger?: LoggerService;
}
