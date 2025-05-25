import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsNotEmpty,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePasteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  password?: string;

  @IsOptional()
  @IsDateString()
  expiry?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  viewLimit?: number;
}
