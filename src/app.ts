import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import 'dotenv/config';
import errorMiddleware from 'middlewares/error.middleware';

class App {
  public app: express.Application;
  public port: string | number;
 
  constructor(controllers, port) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    
    this.mongoConnect();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.intializeErrorHnadler();
  }

  private intializeErrorHnadler() {
    this.app.use(errorMiddleware);
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }
 
  private initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private mongoConnect() {
    mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
    console.log(`Databae is connected...`);
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;