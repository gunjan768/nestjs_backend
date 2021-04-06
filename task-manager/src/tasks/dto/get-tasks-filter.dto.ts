import { TaskStatus } from '../task-status.enum';
import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetTasksFilterDto {
	
	// @IsOptional(): Checks if given value is empty (null or undefined) and if so, ignores all the validators on the property. 
	@IsOptional()
	@IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
	status: TaskStatus;

	@IsOptional()
	@IsNotEmpty()
	search: string;
}