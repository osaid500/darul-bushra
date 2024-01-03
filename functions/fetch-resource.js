const fetch = require("node-fetch");
const apiKey = process.env.HADITH_API_KEY;

exports.handler = async (event, context) => {
  try {
    // console.log(event, "here we go", process.env);
    // const requestedResource = event.queryStringParameters.resource.replace(
    //   "slash",
    //   "/"
    // );

    const response = await fetch(
      `https://hadithapi.com/api/sahih-bukhari/chapters?apiKey=${apiKey}`
    );

    console.log("past fetching");

    if (!response.ok) {
      throw new Error(`Network response was not ok, NETLIFY LO`);
    }

    console.log("past checking if response is ok");

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `internal server error, netlify, ${JSON.stringify(
          event
        )}, "AND HERE WE GO", ${JSON.stringify(event).queryStringParameters}`,
      }),
    };
  }
};
