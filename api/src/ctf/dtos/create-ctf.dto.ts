import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCtfDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageName: string;
}
