import { DynamicModule, Global, HttpModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS, LalamoveOptions } from './lalamove.definition';
import { LalamoveService } from './lalamove.service';

@Global()
@Module({})
export class LalamoveModule {
  static forRoot(options: LalamoveOptions): DynamicModule {
    return {
      module: LalamoveModule,
      imports: [HttpModule],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        LalamoveService,
      ],
      exports: [LalamoveService],
    };
  }
}
