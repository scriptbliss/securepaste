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
import { CreatePasteDto } from './dto/create-paste.dto';
import { GetPasteMetadataResponseDto } from './dto/get-paste-metadata.response.dto';
import { PasteResponseDto } from './dto/paste.response.dto';
import { PasteService } from './paste.service';

@Controller('paste')
export class PasteController {
  constructor(private readonly pasteService: PasteService) {}

  @Post()
  async create(@Body() createPasteDto: CreatePasteDto) {
    const paste = await this.pasteService.createPaste(createPasteDto);
    return { id: paste.id };
  }

  @Get(':id/meta')
  async getPasteMetadata(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<GetPasteMetadataResponseDto> {
    const paste = await this.pasteService.getPasteMetadata(id);
    return paste;
  }

  @Get(':id')
  async getPaste(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('x-paste-password') password?: string,
  ): Promise<PasteResponseDto> {
    if (password !== undefined && typeof password !== 'string') {
      throw new BadRequestException('Invalid password header');
    }

    if (password && password.length < 1) {
      throw new BadRequestException('Password cannot be empty');
    }

    const paste = await this.pasteService.getPaste(id, password);

    return paste;
  }
}
