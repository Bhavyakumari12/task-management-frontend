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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CdkDropList, TaskItemComponent, MatIcon, CommonModule],
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
    this.taskService.getTasks().subscribe(({ tasks }) => {
      console.log(tasks);
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
    this.data.backlog.push(newTask);
  }

  saveTask(task: Task) {
    if (task._id) {
      this.taskService.updateTask(task._id, task).subscribe((updatedTask) => {
        const index = this.data.backlog.findIndex((t) => t._id === task._id);
        if (index !== -1) {
          this.data.backlog[index] = updatedTask;
        }
      });
    } else {
      this.taskService.createTask(task).subscribe((createdTask) => {
        const index = this.data.backlog.findIndex((t) => t === task);
        if (index !== -1) {
          this.data.backlog[index] = createdTask;
        }
      });
    }
  }

  deleteTask(item: Task) {
    this.taskService.deleteTask(item._id!).subscribe(() => {
      this.data.backlog = this.data.backlog.filter((i) => i._id !== item._id);
      this.data.inProgress = this.data.inProgress.filter(
        (i) => i._id !== item._id
      );
      this.data.completed = this.data.completed.filter((i) => i._id !== item._id);
    });
  }
}
