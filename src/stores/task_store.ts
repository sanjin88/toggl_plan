import type { Writable } from 'svelte/store';
import type { ITasksStoreState, IFetchTasksQueryParams, ITaskResponse } from '../types/common';
import { TaskModel } from '../models/task_model';
import { writable } from 'svelte/store';

const initialState: ITasksStoreState = {
  tasks: [],
};

class TaskStore {
  private taskStore: Writable<ITasksStoreState>;

  constructor() {
    this.taskStore = writable(initialState);
  }

  getTasks() {
    return this.taskStore;
  }



  async fetchTasks(params: IFetchTasksQueryParams) {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const apiUrl = `https://api.plan.toggl.space/api/v6-rc1/733148/tasks?${queryParams}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjMtMDctMjUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGxhbiJdLCJleHAiOjE3MDc0MjcxNTIsImlhdCI6MTcwNzQyMzU1MiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy50b2dnbC5zcGFjZSIsImp0aSI6ImY1N2RmODQzYzRkY2VjOGMyZTkyY2FhMmYzMTg0NmRiIiwibmJmIjoxNzA3NDIzMjUyLCJzdWIiOiI2NDR5dVNLeHV6dWs0cWdHRVRkck53In0.hxi8ElWaDAYVhLyFxLeNhgUh9E0m9U7ZAn3hcQmPtOYZ-Ed3lUUvqllstgG_sdUruxmoJX6llEZmZYpmhqOZCw',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const tasksResponse = responseData.map((task: ITaskResponse) => new TaskModel(task));
      const tasksFromLocalStorage = this.getTasksFromLocalStorage();
      const tasks = this.patchTasks(tasksFromLocalStorage, tasksResponse);
      this.taskStore.set({ tasks });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  saveTasks(tasks: TaskModel[]) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      this.taskStore.set({ tasks });
    } catch (error) {
      console.error('Error saving tasks to local storage:', error);
    }
  }

  private patchTasks(tasksFromStore: TaskModel[], tasksToUpdate: TaskModel[]): TaskModel[] {
    return tasksToUpdate.map((task) => {
      const updatedTask = tasksFromStore.find((t) => t.id === task.id);
      if (updatedTask) {
        task.startDate = updatedTask.startDate;
        task.endDate = updatedTask.endDate;
      }
      return task;
    });
  }

  private getTasksFromLocalStorage(): TaskModel[] {
    let tasks: TaskModel[];
    try {
      const storedTasks = localStorage.getItem('tasks');
      tasks = storedTasks ? JSON.parse(storedTasks) : [];
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks from local storage:', error);
      tasks = [];
    }
    return tasks;
  }
}

export const taskStore = new TaskStore();
