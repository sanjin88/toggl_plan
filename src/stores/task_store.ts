import { writable } from 'svelte/store';
import type { IFetchTasksQueryParams, ITaskResponse, ITasksStoreState } from '../types';
import { TaskModel } from '../models/task_model';

const initialState: ITasksStoreState = {
    tasks: [],
};

export const taskStore = writable(initialState);

export const fetchTasks = async (params: IFetchTasksQueryParams) => {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const apiUrl = `https://api.plan.toggl.space/api/v6-rc1/733148/tasks?${queryParams}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJFZERTQSIsImtpZCI6IjIwMjMtMDctMjUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsicGxhbiJdLCJleHAiOjE3MDcyMjY4MjAsImlhdCI6MTcwNzIyMzIyMCwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy50b2dnbC5zcGFjZSIsImp0aSI6ImY1N2RmODQzYzRkY2VjOGMyZTkyY2FhMmYzMTg0NmRiIiwibmJmIjoxNzA3MjIyOTIwLCJzdWIiOiI2NDR5dVNLeHV6dWs0cWdHRVRkck53In0.a2yvp1pOcLNSf-hrXUMWscmTgpe3gALK8byPJm2Gz3XllWYPkbhdOsb-_vJmlshSLoPEk8luJZw3IeTUEcTpDA',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        const tasks = responseData.map((task: ITaskResponse) => new TaskModel(task));
        taskStore.set({ tasks });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};