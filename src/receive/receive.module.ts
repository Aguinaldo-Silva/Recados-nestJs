import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receive } from './entities/receive.entity';
import { ReceiveService } from './receive.service';
import { ReceiveController } from './receive.controller';
import { PessoasModule } from 'src/pessoas/pessoas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Receive]), PessoasModule],
  controllers: [ReceiveController],
  providers: [ReceiveService],
})
export class ReceiveModule {}