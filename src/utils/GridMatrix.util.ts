export class GridMatrix {
    private gridData: Record<string, boolean>;

    constructor() {
        this.gridData = {}; // Object to represent grid data
    }

    // Mark a range of cells as occupied
    occupyCells(row: number, startColumn: number, endColumn: number): void {
        for (let col = startColumn; col <= endColumn; col++) {
            this.gridData[`${row}-${col}`] = true;
        }
    }

    // Find the next available row in the matrix
    findNextAvailableRow(startColumn: number, endColumn: number, startRow: number): number {
        while (true) {
            let rowOccupied = false;
            for (let col = startColumn; col <= endColumn; col++) {
                if (this.gridData[`${startRow}-${col}`]) {
                    rowOccupied = true;
                    break;
                }
            }
            if (!rowOccupied) {
                // Found the next available row
                return startRow;
            }
            startRow++;
        }
    }
}