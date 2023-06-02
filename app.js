import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './controller';
import morgan from './middleware/morgan';
import logger from "./utils/logger";

const app = express();

// body-parser
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(morgan);
app.use(express.static('public'));
app.use(express.json());

app.use(cors());
app.options('*', cors());

require('./config/database').connect();
router(app);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
 
export default app;
