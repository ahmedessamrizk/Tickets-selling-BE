import { Controller, Get } from "@nestjs/common";
import { Public } from "./common/decorators/public.decorator";


@Controller('/')
export class AppController {
  
    @Public()
    @Get()
    sayHello(): string {
        return 'Hello World!';
    }
}
