import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

// There are multiple ways of configuring the db connection:
// . Using static JSON file
// . Providing data as an object
// . Providing data asynchronously from a service

// We will go with 2nd way of configuration. Instead of defining an object here in the AppMpdule, do it in separate file 
// (see typeorm.config.ts).
@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		TasksModule,
		AuthModule,
	],
})
export class AppModule {}