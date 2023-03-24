import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    const user = this.usersService.findById(createMessageDto.userId);
    if (!user) throw new NotFoundException({ message: 'User not found!' });
    return this.messagesService.createMessage(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }
}
