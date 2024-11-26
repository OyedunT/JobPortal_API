const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const JobRoutes = require("./Routes/JobRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const ErrorHandler = require("./Middlewares/ErrorHandlers");
const mongoose = require('mongoose');
const verifyToken = require("./Middlewares/VerifyToken")

dotenv.config(); // Load environment variables from .env

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// const corsOptions = {
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PATCH", "DELETE"],
// };
// app.use(cors(corsOptions));

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Routes
app.use("/api/job", JobRoutes);
app.use("/api/user", UserRoutes);

const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@jobportalhub.o4wbs.mongodb.net/jobPortalHub?retryWrites=true&w=majority`;

mongoose.connect(DB, {
  useNewUrlParser: true,

})
  .then(() => console.log('DB connection successful'))

// Error Handler Middleware
app.use(ErrorHandler);
app.use(verifyToken);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// });
