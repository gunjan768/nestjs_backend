import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([TaskRepository]),

		// Importing AuthModule: means anything that the AuthModule exports is now available in this module (taks module).
		AuthModule,
	],
	controllers: [TasksController],
	providers: [TasksService],
})

export class TasksModule {}