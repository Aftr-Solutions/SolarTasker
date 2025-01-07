//process.env.TZ = "Asia/Karachi";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const appRouter = require("./routes");
const pool = require("./Utils/db.js");
const { mytask } = require("./middleware/taskmaker");
const { assignteam } = require("./middleware/teamassign.js");
const { rescheduling } = require("./middleware/rescheduleremainingtasks.js");
const { processTasks } =require("./middleware/reschedulecompletetasks.js");
const { sendMessage }=require("./middleware/whatsappclient.js");
const { sendMessagetoteams } = require("./middleware/whatsappteam.js");
const logger = require("./logger");
const cronpool=require("./Utils/crondb.js");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 50, // Limit each IP to 50 requests per window
  message: "You have exceeded the number of requests allowed.",
});
app.use(limiter); // Applies to all routes

app.get("/", (req, res) => {
  res.send("Success");
});

app.use("/", appRouter);

cron.schedule("2 0 * * *", async () => {
  logger.info("Running cron job for task creation at 12:02 AM....");
  try {
    await mytask(cronpool);
  } catch (error) {
    logger.error("Error in mytask cron job:", error.message);
  }
});

cron.schedule("10 0 * * *", async () => {
  logger.info("Running cron job for assigning tasks at 12:10 AM....");
  try {
    await assignteam(cronpool);
  } catch (error) {
    logger.error("Error in assignteam cron job:", error.message);
  }
});

cron.schedule("45 23 * * *", async () => {
  logger.info("Running cron job for rescheduling pending tasks at 11:45 PM....");
  try {
    await rescheduling(cronpool);
  } catch (error) {
    logger.error("Error in rescheduling cron job:", error.message);
  }
});

cron.schedule("50 23 * * *", async () => {
  logger.info("Running cron job for rescheduling complete tasks at 11:50 PM....");
  try {
    await processTasks(cronpool);
  } catch (error) {
    logger.error("Error in processTasks cron job:", error.message);
  }
});

cron.schedule("0 9 * * *", async () => {
  logger.info("Running cron job for sending whatsapp messages to clients at 9:00 AM....");
  try {
    await sendMessage(cronpool);
  } catch (error) {
    logger.error("Error in processTasks cron job:", error.message);
  }
});

cron.schedule("0 8 * * *", async () => {
  logger.info("Running cron job for rsending whatsapp messages to team leads at 8:00 AM....");
  try {
    await sendMessagetoteams(cronpool);
  } catch (error) {
    logger.error("Error in processTasks cron job:", error.message);
  }
});
//await sendMessage(cronpool)
//sendMessagetoteams(cronpool);
//commeted
//mytask();
//assignteam();
//rescheduling(pool);
//processTasks();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info("Server is running on: localhost:", PORT);
});
