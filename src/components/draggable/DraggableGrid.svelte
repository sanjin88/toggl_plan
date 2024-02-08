<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import type { IDraggableGridColumnDef } from './DraggableGrid';
	import type { DraggableGridItem } from './DraggableGridItem.model';

	export let columns: IDraggableGridColumnDef[];
	export let items: DraggableGridItem[];
	export let ItemComponent: SvelteComponentConstructor<any, any>;

	let gridElement: HTMLElement;
	let draggedItem: DraggableGridItem | null = null;
	let dragOverColumn: number | null;
	let gridWidth: number;

	export let onDrop:
		| ((event: DragEvent, item: DraggableGridItem) => void)
		| undefined;

	const handleDragStart = (event: DragEvent, item: DraggableGridItem) => {
		event.dataTransfer?.setData('text/plain', '');
		items = items.map((i) => (i.id === item.id ? i.cloneItem(true) : i));
		draggedItem = item;
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		const rect = gridElement.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const column = Math.floor(mouseX / (rect.width / columns.length));
		// NOTE: optimization added to prevent items reassigning and looping on every scroll event
		if (dragOverColumn !== column) {
			items = items.map((i) => {
				if (draggedItem && i.id === draggedItem.id) {
					i.moveItem(columns[column].id, column);
					return i.cloneItem(true);
				}
				return i;
			});
			dragOverColumn = column;
		}
		if (handleDragStart && draggedItem) handleDragStart(event, draggedItem);
	};

	const handleDrop = (event: DragEvent) => {
		if (!draggedItem) return;
		const item = items.find((i) => i.id === draggedItem?.id);
		if (onDrop && item) onDrop(event, item);
		draggedItem = null;
		dragOverColumn = null;
	};

	const calculateGridWidth = (): number => {
		return columns.length * 100 + (columns.length - 1) * 8;
	};

	onMount(() => {
		return () => {
			draggedItem = null;
			dragOverColumn = null;
		};
	});

	afterUpdate(() => {
		gridWidth = calculateGridWidth();
	});
</script>

<style>
	.draggable-grid {
		height: 80vh;
	}
	.header-row {
		display: flex;
		flex-direction: row;
		gap: 8px;
		margin-bottom: 8px;
		width: 100%;
	}

	.header-cell {
		flex-grow: 0;
		flex-shrink: 0;
		flex-basis: 100px;
		padding: 5px;
		background-color: #d1d1d1;
	}

	.grid {
		background: repeating-linear-gradient(
			to right,
			#0000 0 100px,
			#ffffff 0 108px
		);
		display: grid;
		grid-template-columns: repeat(auto-fill, 100px);
		grid-template-rows: repeat(auto-fill, 64px);
		background-color: #ededed;
		gap: 8px;
		flex-direction: row;
		width: 100%;
		height: 100%;
	}
</style>

<div style="overflow: auto">
	<div class="draggable-grid" style="width: {gridWidth}px">
		<div class="header-row">
			{#each columns as column (column.id)}
				<div role="columnheader" class="header-cell text-xs">
					{column.title}
				</div>
			{/each}
		</div>
		<div
			role="table"
			class="grid"
			bind:this={gridElement}
			on:drop={handleDrop}
			on:dragover={handleDragOver}>
			{#each items as item, index (item.id)}
				<div
					role="cell"
					tabindex={index}
					draggable="true"
					on:dragstart={(event) => handleDragStart(event, item)}
					class="cell"
					style={item.style}>
					{#if ItemComponent}
						<svelte:component
							this={ItemComponent}
							bind:item={item.componentData} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
