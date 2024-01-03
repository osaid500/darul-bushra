const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import the cors middleware

const fetch = require("node-fetch");

dotenv.config(); // Load environment variables from a .env file

const app = express();
const port = 3000;

app.use(cors());

const apiKey = process.env.HADITH_API_KEY;

app.get("/", function (req, res) {
  res.json({ welcome: "welcome" });
});

// This route is responsible for providing the API key to the client
app.get("/fetch-resource/:resource", (req, res) => {
  const requestedResource = req.params.resource.replace("slash", "/");

  async function fetchKutub() {
    console.log(requestedResource);
    try {
      const response = await fetch(
        `https://hadithapi.com/api/${requestedResource}?apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  }
  fetchKutub();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
