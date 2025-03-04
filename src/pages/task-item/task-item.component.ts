import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    MatTooltip,
    MatIcon,
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  @Input({ required: true, alias: 'taskItem' }) task!: Task;
  @Output() updatedTask = new EventEmitter<Task | null>();
  @Output() deletedTask = new EventEmitter<Task>();
  @Input() dragDisabled: boolean = false;

  constructor(private taskService: TaskService) {}

  async editOff(event: Event, item: Task) {
    await Promise.resolve().then(() => (item.editing = false));
    item.title = (event.target as HTMLInputElement).value;
    this.updatedTask.emit(item);
  }

  editOn(item: Task) {
    item.editing = true;
    this.updatedTask.emit(item);
  }

  deleteTask(task: Task) {
    this.deletedTask.emit(task);
  }
}
