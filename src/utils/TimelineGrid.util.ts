import type { IDraggableGridColumnDef } from "../components/draggable/DraggableGrid";
import { DraggableGridItem } from "../components/draggable/DraggableGridItem.model";
import type { TaskModel } from "../models/task_model";
import type { IGroupedTimelineItemsMap } from "../types/common";
import { GridMatrix } from "./GridMatrix.util";

export class TimelineGridUtil {

    /**
     * Builds grid data for draggable items based on tasks and columns.
     * @param tasks - The array of TaskModel objects.
     * @param columns - The array of IDraggableGridColumnDef objects representing columns.
     * @returns An array of DraggableGridItem objects.
     */
    static buildGridData = (tasks: TaskModel[], columns: IDraggableGridColumnDef[]): DraggableGridItem[] => {
        // Build a map of items grouped by weight based on start date
        const itemsMap = TimelineGridUtil.getGroupedItemsMap(tasks);
        // Build an empty grid matrix to track available rows and prevent overlap
        const gridMatrix = new GridMatrix();
        // Get a map of columns for efficient lookup
        const columnsMap = this.getColumnsMap(columns);
        return tasks.map((task: TaskModel) => {
            // Get the row index based on weight from the items map
            const weightBasedRowIndex = TimelineGridUtil.getItemRow(itemsMap, task.startDate, task.id);
            // Find the next available row in the grid, considering overlapping tasks
            const availableRowIndexInGrid = gridMatrix.findNextAvailableRow(
                columnsMap[task.startDate],
                columnsMap[task.endDate],
                weightBasedRowIndex
            )
            // Occupy the cells in the grid for the current task
            gridMatrix.occupyCells(availableRowIndexInGrid, columnsMap[task.startDate], columnsMap[task.endDate]);
            // Create a DraggableGridItem based on the task and grid position
            return new DraggableGridItem(
                task.id,
                task.startDate,
                availableRowIndexInGrid,
                task.getDaysStartDateEndDateDiff(),
                task,
                TimelineGridUtil.getColumnIndex(columns, task)
            );
        });
    };


    /**
     * Builds an array of column definitions for the draggable grid based on the number of columns.
     * Each column represents a day with a unique ID and a formatted title.
     * @param numberOfColumns - The number of columns to generate on each side of the current date.
     * @returns An array of IDraggableGridColumnDef objects.
     */
    static buildColumnDefinitions(numberOfColumns: number): IDraggableGridColumnDef[] {
        const currentDate = new Date();
        const result = [];
        // Loop through columns on both sides of the current date
        for (let i = -numberOfColumns; i <= numberOfColumns; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            const dayInMonth = date.getDate();
            const dayInWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = date.toISOString().split('T')[0];
            result.push({
                id: formattedDate,
                title: `${dayInWeek} - ${dayInMonth}`,
            });
        }
        return result;
    }


    static getISODate(date: Date, span: number): string {
        date.setDate(date.getDate() + span);
        return date.toISOString().split('T')[0];
    };

    static calculateDateRange(offset: number): [string, string] {
        const startDate = TimelineGridUtil.getISODate(new Date(), -offset);
        const endDate = TimelineGridUtil.getISODate(new Date(), offset);
        return [startDate, endDate];
    };

    private static getColumnIndex(columns: IDraggableGridColumnDef[], task: TaskModel): number {
        return columns.findIndex(
            (col) => col.id === task.startDate
        );
    }

    /**
     * Groups tasks based on their start dates and returns a map of
     * start dates to arrays of tasks, sorted by their weights.
     * @param tasks - Array of TaskModel objects to be grouped
     * @returns IGroupedTimelineItemsMap - Map of start dates to sorted arrays of tasks
     */
    private static getGroupedItemsMap(tasks: TaskModel[]): IGroupedTimelineItemsMap {
        const groupedItems: IGroupedTimelineItemsMap = tasks.reduce(
            (acc: IGroupedTimelineItemsMap, task) => {
                if (!acc[task.startDate]) {
                    acc[task.startDate] = [];
                }
                acc[task.startDate].push(task);
                return acc;
            },
            {}
        );
        for (const startDate in groupedItems) {
            groupedItems[startDate].sort((a, b) => a.weight - b.weight);
        }

        return groupedItems;
    };


    private static getItemRow(
        groupedItems: IGroupedTimelineItemsMap,
        startDate: string,
        taskId: number
    ) {
        return groupedItems[startDate].findIndex((task) => taskId === task.id) + 1;
    };

    private static getColumnsMap(columns: IDraggableGridColumnDef[]): Record<string, number> {
        return columns.reduce(
            (acc: Record<string, number>, col: IDraggableGridColumnDef, index: number) => {
                acc[col.id] = index + 1;
                return acc;
            },
            {}
        );
    }
}