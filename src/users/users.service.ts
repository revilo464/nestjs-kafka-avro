import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';

export const USERS_ADDED_TOPIC = 'messenger.users.added';

@Injectable()
export class UsersService {
  constructor(@Inject('TODO_SERVICE') private client: KafkaService) {}

  private lastInsert = 0;
  private users: User[] = [];

  findAll(name?: string): User[] {
    if (name) return this.users.filter((u) => u.name === name);
    return this.users;
  }

  findById(userId: number): User {
    return this.users.find((user) => user.id === userId);
  }

  createUser(createUserDto: CreateUserDto): User {
    const newUser = { id: this.lastInsert++, ...createUserDto };
    this.users.push(newUser);
    this.produceUserAddedEvent(newUser);
    return newUser;
  }

  async produceUserAddedEvent(newUser: User): Promise<RecordMetadata[]> {
    return await this.client.send({
      topic: USERS_ADDED_TOPIC,
      messages: [
        {
          key: { createdAt: new Date().getTime() },
          value: newUser,
        },
      ],
    });
  }

  @SubscribeTo(USERS_ADDED_TOPIC)
  async handleUserAddedEvent(data: any): Promise<void> {
    console.log('User added event received: ' + data);
  }
}
