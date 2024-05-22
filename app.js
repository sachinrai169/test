const express = require("express");

const dotenv = require("dotenv");

const checkoutRoutes = require("./routes/checkoutRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/stripe", checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
