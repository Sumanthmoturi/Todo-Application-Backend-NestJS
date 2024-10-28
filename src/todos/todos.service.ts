import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from '../auth/dto/create-todo.dto';


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  // Create a new Todo
  async create(todoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(todoDto);
    return this.todoRepository.save(todo);
  }

  // Get all Todos with optional status filter and pagination
  async findAll(status?: string, take?: number, skip?: number): Promise<Todo[]> {
    const where = status ? { status } : {};
    return this.todoRepository.find({ where, take, skip });
  }

  // Get a single Todo by ID
  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  // Update status of a Todo by ID
  async updateStatus(id: number, status: string): Promise<Todo> {
    const todo = await this.findOne(id); // Reusing the findOne method

    todo.status = status;
    return this.todoRepository.save(todo);
  }



  // Delete a Todo by ID
  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
