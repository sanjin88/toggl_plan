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
      const tasks = responseData.map((task: ITaskResponse) => new TaskModel(task));
      this.taskStore.set({ tasks });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}

// Create an instance of the TaskStore
export const taskStore = new TaskStore();
