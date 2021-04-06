import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';

// @Unique column(s) cannot have duplicate values. Here column 'username' will contain unique usernames only.
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
	
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	salt: string;

	// We can retrieve the list of tasks user owns. Relation is OneToMany as one user can have multiple tasks but a single task can belong
	// to a single user only. When 'eager' is set to true for example for User entity (here) whenever we retrieve the user as an object, we
	// can access user.tasks immediately and get an array of tasks owned by the same user.
	@OneToMany(type => Task, task => task.user, { eager: true })
	tasks: Task[];

	async validatePassword(password: string): Promise<boolean> {
		const hash = await bcrypt.hash(password, this.salt);
		return hash === this.password;
	}
}