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

  /**
   * Fetches tasks from the Toggl Plan API based on the given query parameters.
   * @param params - The query parameters for fetching tasks.
   */
  async fetchTasks(params: IFetchTasksQueryParams) {
    // Convert query parameters to a URL-encoded string
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();

    const apiUrl = `https://api.plan.toggl.space/api/v6-rc1/733148/tasks?${queryParams}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add Toggl Plan API authorization token, this is temporary, token should be on auth
          'Authorization': 'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjMtMDctMjUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGxhbiJdLCJleHAiOjE3MDc0MzIwMzksImlhdCI6MTcwNzQyODQzOSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy50b2dnbC5zcGFjZSIsImp0aSI6ImY1N2RmODQzYzRkY2VjOGMyZTkyY2FhMmYzMTg0NmRiIiwibmJmIjoxNzA3NDI4MTM5LCJzdWIiOiI2NDR5dVNLeHV6dWs0cWdHRVRkck53In0.OwXKfMFsOSvtL9Z4F6Nv449mhGyqBr8tRNTRQoLgB3VrApQly9ZDhNE5v3rNVrzIxoTsJWEaS826vp4E2Au6DA',
        },
      });

      // Check if the response is successful (status code 2xx)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      const tasksResponse = responseData.map((task: ITaskResponse) => new TaskModel(task));

      // Retrieve tasks from local storage
      const tasksFromLocalStorage = this.getTasksFromLocalStorage();

      // Merge tasks from local storage with newly fetched tasks
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
