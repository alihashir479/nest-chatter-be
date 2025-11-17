import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDbConfig } from './ormconfig';
import { UserModule } from './user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: (context: any) => {
              try {
                const request:Request = context.extra.request
                const user = authService.verifyWs(request)
                context.user = user;
                return true
              } catch(err) {
                new Logger().error(err)
                throw new UnauthorizedException('Unauthorzied')
              }
            }
          },
        }
      }),
      imports: [AuthModule],
      inject: [AuthService]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDbConfig(configService),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production'
        return {
          pinoHttp: {
            transport: isProduction ? undefined: {
              target: 'pino-pretty',
              options: {
                singleLine: true
              },
              level: isProduction ? 'info' : 'debug'
            }
          }
        }
      },
      inject: [ConfigService]
    }),
    AuthModule,
    ChatsModule,
    MessagesModule,
    PubSubModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
