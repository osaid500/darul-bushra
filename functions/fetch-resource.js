const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    const requestedResource = event.queryStringParameters.resource.replace(
      "slash",
      "/"
    );
    const apiKey = process.env.HADITH_API_KEY;

    const response = await fetch(
      `https://hadithapi.com/api/${requestedResource}?apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "internal server error" }),
    };
  }
};
