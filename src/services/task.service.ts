import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Task, TaskResponse } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:3000/api/tasks'; 

  constructor(private http: HttpClient) {}

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  getTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.apiUrl);
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  updateTask(taskId: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
  }

  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}