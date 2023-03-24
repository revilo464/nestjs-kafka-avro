import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserAvro } from './entities/users.entity';
import { KafkaService, SubscribeTo } from '@rob3000/nestjs-kafka';
import { RecordMetadata } from 'kafkajs';

export const USERS_ADDED_TOPIC = 'todo.users.added';

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
    this.produceUserAddedEvent(newUser);
    this.users.push(newUser);
    return newUser;
  }

  async produceUserAddedEvent(newUser: User): Promise<RecordMetadata[]> {
    const result = await this.client.send({
      topic: USERS_ADDED_TOPIC,
      messages: [
        {
          key: newUser,
          value: newUser,
        },
      ],
    });
    return result;
  }

  @SubscribeTo(USERS_ADDED_TOPIC)
  async getWorld(data: any, key: any): Promise<void> {
    console.log(data);
  }
}
