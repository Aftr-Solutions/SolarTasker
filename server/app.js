//process.env.TZ = "Asia/Karachi";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cron = require("node-cron");
const appRouter = require("./routes");


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "you have exceed the number of request",
});

app.get("/", (req, res) => {
    res.send("Success");
  });
  
app.use("/", appRouter);

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on: localhost:", PORT);
}); 
