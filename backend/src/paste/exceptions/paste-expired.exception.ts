import { HttpException, HttpStatus } from '@nestjs/common';

export class PasteExpiredException extends HttpException {
  constructor() {
    super('This paste has expired', HttpStatus.GONE);
  }
}
