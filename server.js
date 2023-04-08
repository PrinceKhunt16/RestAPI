import express from "express";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
const app = express();
import routes from "./routes";

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log(`Mongodb connected with server ${data.connection.host}`);
  })
  .catch(err => console.log('DB Connection Error', err))

app.use(express.json());
app.use("/api", routes);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log("server running on", APP_PORT);
});
