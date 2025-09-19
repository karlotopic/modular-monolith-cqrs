import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { ReservationModule } from './reservation/reservation.module';
import { UserManagementModule } from './user-management/user-management.module';
import authConfig from './config/auth.config';
import { PrismaService } from './shared/database/prisma.service';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from './shared/shared.module';

@Global()
@Module({
  imports: [
    AuthModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [authConfig] }),
    ReservationModule,
    UserManagementModule,
    SharedModule,
    CqrsModule.forRoot(),
  ],
  exports: [PrismaService],
  providers: [PrismaService],
})
export class AppModule {}
