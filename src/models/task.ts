export interface TaskResponse {
  page: number;
  pages: number;
  tasks: Task[];
  total: number;
}
export interface Task {
  _id?: string;
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
