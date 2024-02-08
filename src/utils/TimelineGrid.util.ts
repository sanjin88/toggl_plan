import type { IDraggableGridColumnDef } from "../components/draggable/DraggableGrid";
import { DraggableGridItem } from "../components/draggable/DraggableGridItem.model";
import type { TaskModel } from "../models/task_model";
import type { IGroupedTimelineItemsMap } from "../types/common";
import { GridMatrix } from "./GridMatrix.util";

export class TimelineGridUtil {

    static buildGridData = (tasks: TaskModel[], columns: IDraggableGridColumnDef[]): DraggableGridItem[] => {
        // Build items map to get row based on weight
        const itemsMap = TimelineGridUtil.getGroupedItemsMap(tasks);
        // Build occupied grid matrix to get next possible row if tasks are overlapping
        const gridMatrix = new GridMatrix();
        const columnsMap = this.getColumnsMap(columns);
        return tasks.map(
            (task: TaskModel) => {
                const weigthBasedRowIndex = TimelineGridUtil.getItemRow(itemsMap, task.startDate, task.id);
                const availableRowIndexInGrid = gridMatrix
                    .findNextAvailableRow(columnsMap[task.startDate], columnsMap[task.endDate], weigthBasedRowIndex)
                gridMatrix.occupyCells(availableRowIndexInGrid, columnsMap[task.startDate], columnsMap[task.endDate]);
                return new DraggableGridItem(
                    task.id,
                    task.startDate,
                    availableRowIndexInGrid,
                    task.getDaysStartDateEndDateDiff(),
                    task,
                    TimelineGridUtil.getColumnIndex(columns, task)
                )
            }
        );
    };

    static buildColumnDefinitions(numberOfColumns: number): IDraggableGridColumnDef[] {
        const currentDate = new Date();
        const result = [];
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

    private static getColumnIndex(columns: IDraggableGridColumnDef[], task: TaskModel): number {
        return columns.findIndex(
            (col) => col.id === task.startDate
        );
    }

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