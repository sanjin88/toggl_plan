<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { TaskModel } from '../../models/task_model';

	export let item: TaskModel;
	export let itemElement: HTMLElement;

	const dispatch = createEventDispatcher();

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'to-do':
				return 'bg-blue-100';
			case 'in-progress':
				return 'bg-yellow-100';
			case 'done':
				return 'bg-green-100';
			default:
				return 'bg-gray-100';
		}
	};

	const notifyParent = () => {
		if (itemElement) {
			dispatch('itemElementAvailable', { itemElement, item });
		}
	};

	onMount(() => {
		notifyParent();
	});

	// Use onMount to call the notifyParent function when the component is mounted
	onMount(notifyParent);
</script>

<style>

</style>

<div
	class="task flex h-16 items-center rounded-lg p-4 shadow-md m-1 {getStatusColor(
		item.status
	)}"
	bind:this={itemElement}>
	<div class="name mr-4 flex-1 text-xs font-semibold">{item.name}</div>
</div>
