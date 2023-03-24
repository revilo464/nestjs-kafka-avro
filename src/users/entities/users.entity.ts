import { ApiProperty } from '@nestjs/swagger';

export class User {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
