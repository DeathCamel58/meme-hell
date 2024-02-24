import express, { Express } from 'express';
import path from 'path';
import routes from './routes';

export const startWebServer = (config: { webPort: number }): void => {
  const app: Express = express();

  // Set up EJS view engine
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // Middleware to parse form submissions
  app.use(express.urlencoded({ extended: true }));

  // Set up routes
  app.use('/', routes);

  // Start the web server
  app.listen(config.webPort, () => {
    console.log(`Web server is running at http://localhost:${config.webPort}`);
  });
};
