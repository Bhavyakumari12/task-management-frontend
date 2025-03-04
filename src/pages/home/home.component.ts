import {
  CdkDragDrop,
  moveItemInArray,
  CdkDropList,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, HostListener, OnInit } from '@angular/core';
import { Task, TaskData, TaskStatus } from '../../models/task';
import { MatIcon } from '@angular/material/icon';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  imports: [CdkDropList, TaskItemComponent, MatIcon],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  data: TaskData = {
    backlog: [],
    inProgress: [],
    completed: [],
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.data.backlog = tasks.filter(
        (task) => task.status === TaskStatus.ToDo
      );
      this.data.inProgress = tasks.filter(
        (task) => task.status === TaskStatus.InProgress
      );
      this.data.completed = tasks.filter(
        (task) => task.status === TaskStatus.Done
      );
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.updateTaskStatus(
        event.container.id,
        event.container.data[event.currentIndex]
      );
    }
  }

  updateTaskStatus(containerId: string, task: Task) {
    switch (containerId) {
      case 'backlogList':
        task.status = TaskStatus.ToDo;
        break;
      case 'todoList':
        task.status = TaskStatus.InProgress;
        break;
      case 'doneList':
        task.status = TaskStatus.Done;
        break;
    }
    this.saveTask(task);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      this.addBacklog();
      event.preventDefault();
    }
  }

  addBacklog() {
    const newTask: Task = {
      title: '',
      description: '',
      status: TaskStatus.ToDo,
      editing: true,
    };
    this.taskService.createTask(newTask).subscribe((task) => {
      this.data.backlog.push(task);
    });
  }

  saveTask(task: Task) {
    this.taskService.updateTask(task.id!, task).subscribe((updatedTask) => {
      const index = this.data.backlog.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        this.data.backlog[index] = updatedTask;
      }
    });
  }

  deleteTask(item: Task) {
    this.taskService.deleteTask(item.id!).subscribe(() => {
      this.data.backlog = this.data.backlog.filter((i) => i.id !== item.id);
      this.data.inProgress = this.data.inProgress.filter(
        (i) => i.id !== item.id
      );
      this.data.completed = this.data.completed.filter((i) => i.id !== item.id);
    });
  }
}
