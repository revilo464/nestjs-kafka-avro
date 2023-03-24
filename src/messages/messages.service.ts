import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';

export const MESSAGE_SENT_TOPIC = 'messenger.messages.sent';

@Injectable()
export class MessagesService {
  constructor(@Inject('TODO_SERVICE') private client: KafkaService) {}

  private lastInsert = 0;
  private messages: Message[] = [];

  createMessage(createMessageDto: CreateMessageDto): Message {
    const newMessage = new Message(
      this.lastInsert++,
      createMessageDto.userId,
      createMessageDto.text,
      new Date().getTime(),
    );
    this.messages.push(newMessage);
    this.produceMessageSentEvent(newMessage);
    return newMessage;
  }

  findAll(userId?: number) {
    if (userId) return this.messages.filter((m) => m.userId === userId);
    return this.messages;
  }

  findOne(id: number) {
    return this.messages.find((m) => m.id == id);
  }

  async produceMessageSentEvent(
    newMessage: Message,
  ): Promise<RecordMetadata[]> {
    return await this.client.send({
      topic: MESSAGE_SENT_TOPIC,
      messages: [
        {
          key: { createdAt: new Date().getTime() },
          value: newMessage,
        },
      ],
    });
  }

  @SubscribeTo(MESSAGE_SENT_TOPIC)
  async handleMessageSengEvent(data: any): Promise<void> {
    console.log('Message sent event received: ' + data);
  }
}
