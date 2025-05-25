import { Module } from '@nestjs/common';
import { PasteController } from './paste.controller';
import { PasteService } from './paste.service';

@Module({
  controllers: [PasteController],
  providers: [PasteService],
})
export class PasteModule {}
