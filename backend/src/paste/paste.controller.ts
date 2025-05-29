import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { LoggerService } from '../common/logger/logger.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { GetPasteMetadataResponseDto } from './dto/get-paste-metadata.response.dto';
import { PasteResponseDto } from './dto/paste.response.dto';
import { PasteService } from './paste.service';

@Controller('paste')
export class PasteController {
  constructor(
    private readonly pasteService: PasteService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() createPasteDto: CreatePasteDto) {
    this.logger.log('Creating new paste', PasteController.name, {
      createPasteDto,
    });
    const paste = await this.pasteService.createPaste(createPasteDto);
    this.logger.log('Paste created', PasteController.name, {
      pasteId: paste.id,
    });
    return { id: paste.id };
  }

  @Get(':id/metadata')
  async getPasteMetadata(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPasteMetadataResponseDto> {
    this.logger.log('Fetching paste metadata', PasteController.name, { id });
    const paste = await this.pasteService.getPasteMetadata(id);
    return paste;
  }

  @Get(':id')
  async getPaste(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('x-paste-password') password?: string,
  ): Promise<PasteResponseDto> {
    this.logger.log('Fetching paste', PasteController.name, { id });
    if (password !== undefined && typeof password !== 'string') {
      this.logger.warn('Invalid password header', PasteController.name, {
        id,
      });
      throw new BadRequestException('Invalid password header');
    }

    if (password && password.length < 1) {
      this.logger.warn('Password cannot be empty', PasteController.name, {
        id,
      });
      throw new BadRequestException('Password cannot be empty');
    }

    const paste = await this.pasteService.getPaste(id, password);
    this.logger.log('Paste fetched', PasteController.name, { id });
    return paste;
  }
}
