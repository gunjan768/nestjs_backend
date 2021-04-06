import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

	private logger = new Logger('TaskRepository');

	async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {

		const { status, search } = filterDto;

		// QueryBuilder is a mechanism that is useful for interacting with the db when our desired operations are a bit more complex than
		// usually. We are using QueryBuilder to conditionally build up conditions in the query that we are sending to the db, then
		// conditionally we could either get old tasks, get tasks with filter just status, just search term or may be both of them.

		// createQueryBuilder() is a method of a 'Repository' class. It takes one argument: a string which is a keyword used within the
		// queries to refer the task entity.
		const query =  this.createQueryBuilder('task');

		// 'query' instance's methods like where(), andWhere() etc are used to build queries. 'task.userId' : 'task' is the same string
		// we passed as an argument to the createQueryBuilder() method. ':userId' : 'userId' is a variable. { userId: user.id } giving
		// value to a variable (userId).
		query.where('task.userId = :userId', { userId: user.id });

		// We are using andWhere() in both because we want them to work together. We don't want to overwrite each other. We you use
		// where you overwrite any other where clauses (methods) for this QueryBuilder.
		if (status) {
			query.andWhere('task.status = :status', { status });	// ':status' : 'status' is a variable
		}

		if (search) {
			query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
		}
		
		let tasks: any;

		try {
			tasks = await query.getMany();
		} catch (error) {
			this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
			throw new InternalServerErrorException();
		}

		return tasks;
	}

	async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {

		const { title, description } = createTaskDto;

		const task = new Task();
		task.title = title;
		task.description = description;
		task.status = TaskStatus.OPEN;
		task.user = user;

		try {
			await task.save();
		} catch (error) {
			this.logger.error(`Failed to create a task for user "${user.username}". Data: ${createTaskDto}`, error.stack);
			throw new InternalServerErrorException();
		}

		// 'user' prop will get deleted from 'task'. Remember, we already have saved 'task' (task.save()) to the db so deleting 'user' from
		// 'task' will not delete from the db.
		delete task.user;
		
		return task;
	}
}