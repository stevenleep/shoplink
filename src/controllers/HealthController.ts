import { Controller, Get } from 'routing-controllers';

@Controller()
export class HealthController {
  @Get('/')
  async health() {
    return 'OK';
  }
}
