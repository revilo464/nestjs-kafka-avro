import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import {
  KafkaAvroRequestSerializer,
  KafkaAvroResponseDeserializer,
  KafkaModule,
} from '@rob3000/nestjs-kafka';
import { USERS_ADDED_TOPIC } from './users/users.service';
import { MESSAGE_SENT_TOPIC } from './messages/messages.service';

@Module({
  imports: [
    KafkaModule.register([
      {
        name: 'TODO_SERVICE',
        options: {
          client: {
            clientId: 'todo',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'todo-consumer',
          },
          deserializer: new KafkaAvroResponseDeserializer({
            host: 'http://localhost:8081',
          }),
          serializer: new KafkaAvroRequestSerializer({
            options: undefined,
            // schemaFetchIntervalSeconds: 0,
            // schemaSeparator: '',
            config: {
              host: 'http://localhost:8081/',
            },
            schemas: [
              {
                topic: USERS_ADDED_TOPIC,
                value: __dirname + 'users/avro/create-user.avsc',
              },
              {
                topic: MESSAGE_SENT_TOPIC,
                value: __dirname + 'users/avro/create-user.avsc',
              },
            ],
          }),
        },
      },
    ]),
    UsersModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
