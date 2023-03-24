import { ApiProperty } from '@nestjs/swagger';

export class Message {
  constructor(id: number, userId: number, text: string, createdAt: number) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.createdAt = createdAt;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  createdAt: number;
}
