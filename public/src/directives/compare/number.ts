import { ICompare } from './compare.interface';

export class NumberCompare implements ICompare<number> {
    constructor() {
    }

    compare(origin: number, target: number, type: string) {
        switch (type) {
            case "eqeqeq":
                return origin === target;
            case "lt":
                return origin < target;
            case "gt":
                return origin > target;
            default:
                return origin == target;
        }
    }
}