// netlify/functions/checkStatus.js

exports.handler = async function (event, context) {
    const { id } = event.queryStringParameters;

    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Checking status for ID: ${id}` }),
    };
};