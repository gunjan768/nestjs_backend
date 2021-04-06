import { PipeTransform, BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

// PipeTransform<T, R> is a generic interface that must be implemented by any pipe. The generic interface uses T to indicate the type of 
// the input value, and R to indicate the return type of the transform() method. You can avoid passing types and directly write the class
// name like this '....implements PipeTransform {}'
export class TaskStatusValidationPipe implements PipeTransform<any, any> {

	readonly allowedStatuses = [
		TaskStatus.OPEN,
		TaskStatus.IN_PROGRESS,
		TaskStatus.DONE,
	];

	// _metadata is an optional parameter. The 'value' parameter is the currently processed method argument (before it is received by the route
	//  handling method), and metadata is the currently processed method argument's metadata.
	transform(value: any, _metadata: ArgumentMetadata): any {
		value = value.toUpperCase();

		if (!this.isStatusValid(value)) {
			throw new BadRequestException(`"${value}" is an invalid status`);
		}

		return value;
	}

	private isStatusValid(status: any) {
		const idx = this.allowedStatuses.indexOf(status);
		return idx !== -1;
	}
}