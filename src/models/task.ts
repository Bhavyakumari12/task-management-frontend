export interface Task {
  title: string;
  description: string;
  status: TaskStatus;
  editing: boolean;
  id?: string;
}

export interface TaskData {
  backlog: Task[];
  inProgress: Task[];
  completed: Task[];
}

export enum TaskStatus {
  ToDo = 'to-do',
  InProgress = 'in-progress',
  Done = 'done',
}
