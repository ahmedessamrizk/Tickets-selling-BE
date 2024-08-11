import { Type } from '@nestjs/common';
export declare function Serialize<T>(dto: Type<T>): MethodDecorator & ClassDecorator;
