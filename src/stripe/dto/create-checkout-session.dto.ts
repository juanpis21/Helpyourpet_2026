import { IsArray, IsNumber, IsString, ValidateNested, IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class StripeItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

class ShippingDto {
  @IsString()
  fullName: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;
}

export class CreateCheckoutSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StripeItemDto)
  items: StripeItemDto[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingDto)
  shipping?: ShippingDto;

  @IsString()
  @IsOptional()
  paymentMethod: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  total: number;
}
