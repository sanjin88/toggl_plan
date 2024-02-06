<script lang="ts">
	export let onDragStart: ((event: DragEvent, id: number) => void) | undefined;
	export let onDrop: ((event: DragEvent, id: number) => void) | undefined;
	export let onDragOver: ((event: DragEvent, id: number) => void) | undefined;
	export let itemId: number;

	const handleDragStart = (event: DragEvent) => {
		if (!onDragStart) return;
		event.preventDefault();
		onDragStart(event, itemId);
	};

	const handleDrop = (event: DragEvent) => {
		if (!onDrop) return;
		event.preventDefault();
		onDrop(event, itemId);
	};

	const handleDragOver = (event: DragEvent) => {
		if (!onDragOver) return;
		event.preventDefault();
		onDragOver(event, itemId);
	};
</script>

<style>
	button:active {
		cursor: grabbing;
	}
</style>

<button
	type="button"
	on:dragstart={onDragStart ? (event) => handleDragStart(event) : undefined}
	on:drop={onDrop ? (event) => handleDrop(event) : undefined}
	on:dragover={onDragOver ? (event) => handleDragOver(event) : undefined}
	draggable="true"
	class="mb-4 cursor-move border p-4">
	<slot />
</button>
