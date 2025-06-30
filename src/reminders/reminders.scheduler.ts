import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { RemindersService } from './reminders.service';

@Injectable()
export class RemindersScheduler {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private remindersService: RemindersService,
  ) {}

  addCustomReminderJob(name: string, cronExpression: string) {
    const job = new CronJob(cronExpression, () => {
      this.remindersService.sendDueReminders();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    return { message: `Reminder job ${name} scheduled with cron ${cronExpression}` };
  }

  deleteReminderJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    return { message: `Reminder job ${name} deleted` };
  }

  getReminderJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    return Array.from(jobs.keys());
  }
}