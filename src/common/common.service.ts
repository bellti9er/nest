import { Injectable } from '@nestjs/common';
import * as bcrypt    from 'bcrypt';

@Injectable()
export class CommonService {
  constructor( ) { }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, await bcrypt.genSalt());
  }

  async hashCompare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted)
  }
}
