/** A schedulable background job. `schedule` is a standard cron expression (IST). */
export interface CronJob {
  name: string;
  schedule: string;
  run: () => Promise<void>;
}
