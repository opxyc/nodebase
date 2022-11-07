import { IJob, Job } from "./job";

export class ExampleJob extends Job implements IJob {
    async execute(): Promise<void> {
        // logic ...
    }
}
