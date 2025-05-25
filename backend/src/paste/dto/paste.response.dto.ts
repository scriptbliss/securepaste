import { Expose } from 'class-transformer';

export class PasteResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  expiresAt: Date | null;

  @Expose()
  viewLimit: number | null;
}
