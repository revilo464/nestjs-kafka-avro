import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  text: string;
}
