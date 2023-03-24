import { ApiProperty } from '@nestjs/swagger';

export class Message {
  constructor(id: number, userId: number, text: string, created: number) {
    this.id = id;
    this.userId = userId;
    this.text = text;
    this.created = created;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  created: number;
}
