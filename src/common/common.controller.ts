import { Controller } from '@nestjs/common';
import { ApiTags    } from '@nestjs/swagger';

import { CommonService } from './common.service';

@ApiTags('COMMON')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) { }
}
