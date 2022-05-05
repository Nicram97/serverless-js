import { Task } from '../interfaces/task';
import { TaskRepository } from '../repositories/taskRepository';
import * as uuid from 'uuid';

export class TaskService {
  taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository = new TaskRepository()) {
    this.taskRepository = taskRepository;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async createTask(name: string): Promise<Task> {
    const id = uuid.v4();

    return this.taskRepository.createTask({
      id,
      name,
      done: false,
      createdAt: new Date().toISOString(),
    });
  }

  async updateTask(partialTask: Partial<Task>) {
    return this.taskRepository.updateTask(partialTask);
  }

  async deleteTaskById(id: string) {
    return this.taskRepository.deleteTaskById(id);
  }
}
