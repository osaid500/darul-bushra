const fetch = require("node-fetch");
const apiKey = process.env.HADITH_API_KEY;

exports.handler = async (event, context) => {
  try {
    const dividedBySlashes = event.path.split("/");
    const index = event.path.indexOf(dividedBySlashes[4]);
    const requestedResource = event.path.slice(index);
    const query = event.queryStringParameters;
    let fixedApiUrl;

    if (requestedResource.includes("hadiths")) {
      fixedApiUrl = `hadiths?apiKey=${apiKey}&book=${query.book}&chapter=${query.chapter}&paginate=${query.paginate}`;
    } else {
      fixedApiUrl = `${requestedResource}?apiKey=${apiKey}`;
    }

    const response = await fetch(`https://hadithapi.com/api/${fixedApiUrl}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `internal server error`,
      }),
    };
  }
};
