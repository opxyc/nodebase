
export interface IJob {
    execute(): Promise<void>;
    name(): string;
}

export abstract class Job {
    name(): string {
        return this.constructor.name;
    }
}