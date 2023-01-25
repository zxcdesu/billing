import { IsISO31661Alpha2, IsOptional } from 'class-validator';
import { IsISO4217 } from 'src/shared/decorators/is-iso4217.decorator';

export class CreateWalletDto {
  @IsISO31661Alpha2()
  country: string;

  @IsOptional()
  @IsISO4217()
  currency?: string;
}
