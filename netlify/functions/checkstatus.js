const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('CheckStatus function called');
  const { id } = event.queryStringParameters;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing prediction ID" })
    };
  }

  try {
    console.log('Fetching prediction status for ID:', id);
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Prediction status:', data.status);
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error checking prediction status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error checking prediction status: " + error.message })
    };
  }
};