import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreatePasteDto } from './dto/create-paste.dto';
import { PasteService } from './paste.service';

@Controller('paste')
export class PasteController {
  constructor(private readonly pasteService: PasteService) {}

  @Post()
  async create(@Body() createPasteDto: CreatePasteDto) {
    const paste = await this.pasteService.createPaste(createPasteDto);
    return { id: paste.id };
  }

  // @Post(':id')
  // async get(@Body() getPasteDto: GetPasteDto) {
  //   const paste = await this.pasteService.getPaste(getPasteDto);
  //   // return {
  //   //   content: paste.content,
  //   //   expiresAt: paste.expiresAt,
  //   //   viewLimit: paste.viewLimit,
  //   // };
  //   return paste;
  // }

  @Get(':id/meta')
  async getPasteMetadata(@Param('id', new ParseUUIDPipe()) id: string) {
    const paste = await this.pasteService.getPasteMetadata(id);
    if (!paste) {
      throw new NotFoundException('Paste not found or inaccessible');
    }

    return paste;
  }

  @Get(':id')
  async getPaste(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('x-paste-password') password?: string,
  ) {
    if (password !== undefined && typeof password !== 'string') {
      throw new BadRequestException('Invalid password header');
    }

    if (password && password.length < 1) {
      throw new BadRequestException('Password cannot be empty');
    }

    const paste = await this.pasteService.getPaste(id, password);
    if (!paste) {
      throw new NotFoundException('Paste not found or inaccessible');
    }

    return paste;
  }
}
