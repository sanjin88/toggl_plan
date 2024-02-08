<script lang="ts">
	import { onMount } from 'svelte';
	import { taskStore } from '../stores/task_store';
	import DraggableGrid from '../components/draggable/DraggableGrid.svelte';
	import type { TaskModel } from '../models/task_model';
	import type { IDraggableGridColumnDef } from '../components/draggable/DraggableGrid';
	import Task from '../components/Task/Task.svelte';
	import type {
		IFetchTasksQueryParams,
		ITasksStoreState,
	} from '../types/common';
	import { DraggableGridItem } from '../components/draggable/DraggableGridItem.model';
	import { TimelineGridUtil } from '../utils/TimelineGrid.util';

	let tasks: TaskModel[] = [];
	let columns: IDraggableGridColumnDef[] = [];
	let draggableItems: DraggableGridItem[] = [];
	let selectedDaysFilter: number = 7;

	const filterOptions = Array.from({ length: 11 }, (_, i) => i + 5); // Filter options of numbers from 5 to 15

	onMount(() => {
		const unsubscribeLoadTasks = loadTasks();
		return () => {
			unsubscribeLoadTasks();
		};
	});

	const fetchTasks = (params: IFetchTasksQueryParams) => {
		taskStore.fetchTasks(params);
	};

	const loadTasks = () => {
		const [since, until] =
			TimelineGridUtil.calculateDateRange(selectedDaysFilter);
		const params: IFetchTasksQueryParams = {
			since,
			until,
			short: true,
			team: 715879,
		};
		fetchTasks(params);

		return taskStore.getTasks().subscribe((state: ITasksStoreState) => {
			tasks = state.tasks;
			renderGrid();
		});
	};

	const renderGrid = () => {
		columns = TimelineGridUtil.buildColumnDefinitions(selectedDaysFilter);
		draggableItems = TimelineGridUtil.buildGridData(tasks, columns);
	};

	const handleDrop = (event: DragEvent, task: DraggableGridItem) => {
		tasks = tasks.map((t) => {
			if (t.id === task.id) {
				const { columnId, colSpan } = task;
				const startDate = columnId;
				const endDate = TimelineGridUtil.getISODate(
					new Date(startDate),
					colSpan - 1
				);
				t.startDate = startDate;
				t.endDate = endDate;
			}
			return t;
		});
		taskStore.saveTasks(tasks);
		renderGrid();
	};

	const handleFilterChange = (event: Event) => {
		selectedDaysFilter = parseInt(
			(event.target as HTMLSelectElement).value,
			10
		);
		loadTasks();
	};
</script>

<style>
	.timeline {
		height: 100vh;
	}
</style>

<div class="timeline">
	<h1 class="mb-6 text-3xl font-bold">Toggl Timeline</h1>
	{#if !!draggableItems.length}
		<label for="filter" class="mr-2">Days (+/-):</label>
		<select
			id="filter"
			bind:value={selectedDaysFilter}
			on:change={handleFilterChange}>
			{#each filterOptions as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</select>
		<DraggableGrid
			bind:items={draggableItems}
			bind:columns
			onDrop={handleDrop}
			ItemComponent={Task}>
		</DraggableGrid>
	{/if}
</div>
