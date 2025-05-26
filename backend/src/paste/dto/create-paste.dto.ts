import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePasteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  // @Transform(({ value }) => (value === '' ? undefined : value)) // treat empty string as undefined if needed
  password?: string;

  @IsOptional()
  @IsDateString()
  expiry?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  viewLimit?: number;
}
