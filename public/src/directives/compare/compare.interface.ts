export interface ICompare<T> {
    compare(origin: T, target: T, type?: string): boolean;
}