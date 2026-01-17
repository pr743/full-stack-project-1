const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT   || 5000;


connectDB(); 


app.use(
  cors({
       origin:"https://student-app-dusky.vercel.app",
       methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
       allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);


app.options("*",cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Result Backend API Running!");
});

app.use("/api/admin", require("./routes/authRoute"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/students-extra", require("./routes/studentRoutes1"));
app.use("/api/institutes", require("./routes/institutesRoutes"));
app.use("/api/results", require("./routes/ResultRoutes"));
app.use("/api/publish-results", require("./routes/publishResultRoutes"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
