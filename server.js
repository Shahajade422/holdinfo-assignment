const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

mongoose.connect("mongodb://127.0.0.1:27017/cryptoData");

const cryptoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

async function fetchDataAndStore() {
  try {
    const response = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();

    await Crypto.deleteMany({});

    const top10Data = Object.values(data).slice(0, 10);

    await Crypto.insertMany(
      top10Data.map((item) => ({
        name: item.name,
        last: item.last,
        buy: item.buy,
        sell: item.sell,
        volume: item.volume,
        base_unit: item.base_unit,
      }))
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchDataAndStore();
setInterval(fetchDataAndStore, 60000);

app.use(express.static("public"));

app.get("/cryptoData", async (req, res) => {
  try {
    const data = await Crypto.find().limit(10);
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
