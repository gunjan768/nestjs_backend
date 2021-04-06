import { 
	Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger 
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

// ************************************************************* Pipes ********************************************************************

// The ValidationPipe makes use of the powerful class-validator package and its declarative validation decorators. The ValidationPipe provides 
// a convenient approach to enforce validation rules for all incoming client payloads, where the specific rules are declared with simple 
// annotations in local class/DTO declarations in each module.Pipes can be parameter-scoped, method-scoped, controller-scoped, or 
// global-scoped.

// Pipes run inside the exceptions zone. This means that when a Pipe throws an exception it is handled by the exceptions layer (global 
// exceptions filter and any exceptions filters that are applied to the current context). Given the above, it should be clear that when an 
// exception is thrown in a Pipe, no controller method is subsequently executed. This gives you a best-practice technique for validating data 
// coming into the application from external sources at the system boundary.

// ************************************************************* Pipes ********************************************************************

// ************************************************************* Guards ********************************************************************

// Guards have a single responsibility. They determine whether a given request will be handled by the route handler or not, depending on certain 
// conditions (like permissions, roles, ACLs, etc.) present at run-time. This is often referred to as authorization. Authorization (and its 
// cousin, authentication, with which it usually collaborates) has typically been handled by middleware in traditional Express applications. 
// Middleware is a fine choice for authentication, since things like token validation and attaching properties to the request object are not 
// strongly connected with a particular route context (and its metadata).

// Like pipes and exception filters, guards can be controller-scoped, method-scoped, or global-scoped. Guards are executed after each 
// middleware, but before any interceptor or pipe.

// ************************************************************* Guards ********************************************************************

@Controller('tasks')
@UseGuards(AuthGuard())		// Controller scoped guard
export class TasksController {

	private logger = new Logger('TasksController');

	constructor(private tasksService: TasksService) {}

	// To make pipe works, pass 'ValidationPipe' as an argument to @Query() decorator. It is parameter level validation pipe which only
	// validates 'filterDto' instance using class Validator (see GetTasksFilterDto class)
	@Get()
	getTasks(
		@Query(ValidationPipe) filterDto: GetTasksFilterDto,
		@GetUser() user: User,
	): Promise<Task[]> {
		this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
		return this.tasksService.getTasks(filterDto, user);
	}

	@Get('/:id')
	getTaskById(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.getTaskById(id, user);
	}

	// Inbuilt pipe 'ValidationPipe': It's going to take the entire request body which is using a DTO and validate the data against that DTO
	// using the class validator decorators that we specified before. We want to bind the pipe at the method call level and we do that using 
	// the @UsePipes() decorator.
	@Post()
	@UsePipes(ValidationPipe)
	createTask(
		@Body() createTaskDto: CreateTaskDto,
		@GetUser() user: User,
	): Promise<Task> {
		this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
		return this.tasksService.createTask(createTaskDto, user);
	}

	@Delete('/:id')
	deleteTask(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() user: User,
	): Promise<void> {
		return this.tasksService.deleteTask(id, user);
	}

	@Patch('/:id/status')
	updateTaskStatus(
		@Param('id', ParseIntPipe) id: number,
		@Body('status', TaskStatusValidationPipe) status: TaskStatus,
		@GetUser() user: User,
	): Promise<Task> {
		return this.tasksService.updateTaskStatus(id, status, user);
	}
}