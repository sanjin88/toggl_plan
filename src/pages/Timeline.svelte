<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchTasks, taskStore } from '../stores/task_store';
	import Draggable from '../components/Draggable.svelte';
	import type { IFetchTasksQueryParams, ITasksStoreState } from '../types';
	import type { TaskModel } from '../models/task_model';

	let tasks: TaskModel[] = [];

	onMount(() => {
		// Fetch tasks on component mount
		const params: IFetchTasksQueryParams = {
			since: '2023-12-04',
			until: '2024-04-21',
			short: true,
			team: 715879,
		};
		fetchTasks(params);

		// Subscribe to changes in the tasks array
		const unsubscribe = taskStore.subscribe((state: ITasksStoreState) => {
			tasks = state.tasks;
			console.log(tasks);
		});

		// Cleanup subscription on component destruction
		return () => {
			unsubscribe();
		};
	});

	const handleDragStart = (event: DragEvent, taskId: number) => {
		// Custom logic on drag start
		console.log('Drag started for task:', taskId);
	};

	const handleDrop = (event: DragEvent, taskId: number) => {
		// Custom logic on drop
		console.log('Task dropped with ID:', taskId, event);
	};
</script>

<div>
	{#each tasks as task (task.id)}
		<Draggable
			bind:itemId={task.id}
			onDragStart={handleDragStart}
			onDragOver={handleDragStart}
			onDrop={handleDrop}>
			<p>{task.name}</p>
			<p>{task.endDate}</p>
		</Draggable>
	{/each}
</div>
