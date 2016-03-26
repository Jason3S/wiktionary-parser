declare module 'JSONSelect' {
    type Callback = (value: any) => any;

    interface JsonSelectInstance {
        match(obj: any): any[];
        foreach(obj: any, fn: Callback): void;
    }

    interface JsonSelect {
        match(select: string, json: any): any[];
        match(select: string, args: string[], json: any): any[];
        foreach(select: string, json: any, callback: Callback): any[];
        foreach(select: string, args: string[], json: any, callback: Callback): any[];
        compile(select: string, json: any): JsonSelectInstance;
        compile(select: string, args: string[], json: any): JsonSelectInstance;
    }

    const jsonSelect: JsonSelect;
    export = jsonSelect;
}