const express = require("express");
const db = require("./config/connection");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("./routes"));

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/social-network-api', {
//   // useFindAndModify: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// mongoose.set('debug', true);
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

// app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));
