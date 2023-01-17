
/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';
import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import helmet from 'helmet'
import cookieParser from 'cookie-parser';

dotenv.config();

/**
 * Handle uncaughtExceptions with sentry
 */

if (!process.env.ENV) {
    console.error("No Environment variable specified. Application will shut down!")
    process.exit(1);
}

/**
 * App Variables
 */
if (!process.env.PORT) {
    console.error("No Port specified. Application will shut down!")
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const debugLog: debug.IDebugger = debug('app');

/**
 *  App Configuration
 */

 // Allow parsing of cookies 
app.use(cookieParser());

// More security
app.use(helmet({crossOriginResourcePolicy: { policy: "cross-origin" }}));

// allow cross-origin requests
if(process.env.ENV == "Production") {
    app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
}
else {
    app.use(cors({ origin: true, credentials: true }));
}

//parse all incoming requests as JSON 
app.use(express.json());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

/**
 * Routes Configuration
 */

app.options('*', cors())

// static files
// app.use('/storage', express.static(process.cwd() + '/storage'));



/**
 * Server Activation
 */

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});