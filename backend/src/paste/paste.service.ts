import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { PrismaErrorCodes } from 'src/common/constants/prisma-errors';
import { Paste, Prisma } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { GetPasteMetadataResponseDto } from './dto/get-paste-metadata.response.dto';
import { PasteResponseDto } from './dto/paste.response.dto';
import { PasteExpiredException } from './exceptions/paste-expired.exception';

@Injectable()
export class PasteService {
  constructor(private readonly prisma: PrismaService) {}

  async createPaste(createPasteDto: CreatePasteDto) {
    const { content, password, expiry, viewLimit } = createPasteDto;
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const paste = await this.prisma.paste.create({
      data: {
        content,
        passwordHash,
        expiresAt: expiry ? new Date(expiry) : null,
        viewLimit: viewLimit ?? null,
      },
    });

    return paste;
  }

  async getPasteMetadata(id: string): Promise<GetPasteMetadataResponseDto> {
    try {
      const paste = await this.prisma.paste.findUniqueOrThrow({
        where: { id },
        select: {
          passwordHash: true,
          expiresAt: true,
          viewLimit: true,
        },
      });

      const isPasswordProtected = paste.passwordHash != null;
      const isExpired = this.isPasteExpired(paste);

      const getPasteMetadataResponseDto = plainToInstance(
        GetPasteMetadataResponseDto,
        {
          isPasswordProtected,
          isExpired,
        },
      );
      return getPasteMetadataResponseDto;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.RECORD_NOT_FOUND
      ) {
        throw new NotFoundException(`Paste with id ${id} not found`);
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }

  async getPaste(id: string, password?: string): Promise<PasteResponseDto> {
    try {
      const paste = await this.prisma.paste.findUniqueOrThrow({
        where: { id },
      });

      if (paste.passwordHash != null) {
        if (!password) {
          throw new UnauthorizedException('Password is required');
        }
        const passwordValid = await bcrypt.compare(
          password,
          paste.passwordHash,
        );
        if (!passwordValid) {
          throw new UnauthorizedException('Invalid password');
        }
      }

      const isExpired = this.isPasteExpired(paste);
      if (isExpired) {
        throw new PasteExpiredException();
      }

      if (paste.viewLimit != null) {
        await this.decrementViewLimit(paste);
      }

      const pasteResponseDto = plainToInstance(PasteResponseDto, paste, {
        excludeExtraneousValues: true,
      });
      return pasteResponseDto;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaErrorCodes.RECORD_NOT_FOUND
      ) {
        throw new NotFoundException(`Paste with id ${id} not found`);
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }

  private isPasteExpired(paste: {
    expiresAt?: Date | null;
    viewLimit?: number | null;
  }): boolean {
    const now = new Date();
    const expiredByTime = paste.expiresAt
      ? paste.expiresAt.getTime() <= now.getTime()
      : false;
    const expiredByViews =
      typeof paste.viewLimit === 'number' && paste.viewLimit <= 0;
    return expiredByTime || expiredByViews;
  }

  private async decrementViewLimit(paste: Paste) {
    try {
      const updatedPaste = await this.prisma.paste.updateMany({
        where: {
          id: paste.id,
          viewLimit: { gt: 0 },
        },
        data: {
          viewLimit: { decrement: 1 },
        },
      });

      if (updatedPaste.count === 0) {
        throw new PasteExpiredException();
      }
    } catch (error) {
      // Todo: skipping using _error
      console.error(error);
      console.error(
        `Failed to decrement viewLimit for paste with id: ${paste.id}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
