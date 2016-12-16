import { ICompare } from './compare.interface';
import { NumberCompare } from './number';

 class NormalCompare implements ICompare<string> {

    registers: { [id: string]: ICompare<any> };

    constructor() {
        this.registers = {};
    }

    compare(origin: string, target: string) {
        return origin == target;
    }

    register() {
        this.registers["number"] = new NumberCompare();
    }

    doCompare(origin: any, target: any, type: string, opt: string = "eq") {
        if (this.registers.hasOwnProperty(type)) {
            return this.registers[type].compare(origin, target, opt);
        }

        return this.compare(origin, target);
    }
}


export const compare = new NormalCompare();