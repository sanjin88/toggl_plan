export class DraggableGridItem {
    id: number;
    columnId: string;
    row: number;
    colSpan: number;
    componentData: any;
    columnIndex: number;
    style: string;
    isDragging: boolean

    constructor(id: number, columnId: string, row: number, colSpan: number,
        componentData: any, columnIndex: number, isDragging?: boolean) {
        this.id = id;
        this.columnId = columnId;
        this.row = row;
        this.colSpan = colSpan;
        this.componentData = componentData;
        this.columnIndex = columnIndex;
        this.isDragging = isDragging || false;
        this.style = this.getColumnStyle(columnIndex);
    }

    // TODO: Use ext library for deep cloning or implement function
    // NOT long term solution
    cloneItem(isDragging: boolean = false): DraggableGridItem {
        return new DraggableGridItem(
            this.id, this.columnId, this.row, this.colSpan, this.componentData, this.columnIndex, isDragging);
    }


    moveItem(columId: string, columnIndex: number) {
        this.columnId = columId;
        this.columnIndex = columnIndex;
        this.style = this.getColumnStyle(columnIndex);
    }

    getColumnStyle(columnIndex: number): string {
        if (columnIndex === -1) return '';
        return `grid-column: ${columnIndex + 1} / span ${this.colSpan};`
            + (!this.isDragging ? ` grid-row: ${this.row};` : '; opacity: 0.5;');
    };
}