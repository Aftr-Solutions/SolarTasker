//process.env.TZ = "Asia/Karachi";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const appRouter = require("./routes");
const { mytask } = require("./middleware/taskmaker");
const { assignteam } = require("./middleware/teamassign");
const { rescheduling } = require("./middleware/rescheduleremainingtasks.js");
const { processTasks } =require("./middleware/reschedulecompletetasks.js");

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

app.get("/", (req, res) => {
  res.send("Success");
});

app.use("/", appRouter);

// Schedule the cron job to run daily at midnight
cron.schedule("2 0 * * *", () => {
  console.log("Running cron job for task creation at 12:02 AM...");
  mytask();
});

// Schedule the cron job to run daily at 12:10 AM
cron.schedule("10 0 * * *", () => {
  console.log("Running cron job for assigning tasks at 12:10 AM...");
  assignteam();
});

cron.schedule("45 23 * * *", () => {
  console.log("Running cron job for rescheduling pending tasks at 11:45 PM...");
  rescheduling();
});

// Schedule the cron job to run daily at 11:50 PM
cron.schedule("50 23 * * *", () => {
  console.log("Running cron job for rescheduling complete tasks at 11:50 PM...");
  processTasks();
});
//mytask();
assignteam();
//rescheduling();
//processTasks();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on: localhost:", PORT);
});
