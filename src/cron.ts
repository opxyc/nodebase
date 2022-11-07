import { CronJob } from 'cron';
import { IJob } from './cronjobs/job';
import { ExampleJob } from './cronjobs/example.job';
import logger from './logger';

class Cron {
	constructor() {
		this.setup();
	}

	public setup() {
		logger.info('setting up cron jobs');
		
		this.scheduleJob('* 0 * * *', new ExampleJob());
	}

	private scheduleJob(cronTime: string | Date, job: IJob) {
		new CronJob(cronTime, async () => {
			logger.debug(job.name());
			try {
				job.execute();
			} catch (err) {
				logger.error(err);
			}
		}).start();
	}
}

export default Cron;
