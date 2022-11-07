import App from '~/app';
import IndexRoute from '~/routes/index.route';
import AuthRoute from '~/routes/auth.route';
import Cron from './cron';

const app = new App([new IndexRoute(), new AuthRoute()]);

app.listen();
new Cron();
