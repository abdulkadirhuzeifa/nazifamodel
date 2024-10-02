// netlify/functions/checkStatus.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { id } = event.queryStringParameters;

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing prediction ID" }),
        };
    }

    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            },
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error checking prediction status" }),
        };
    }
};