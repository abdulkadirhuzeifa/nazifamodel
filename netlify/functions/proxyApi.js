const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    console.log('ProxyApi function called');
    console.log('Request method:', event.httpMethod);
    console.log('Request body:', event.body);
    
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing request body' })
        };
    }

    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
    }

    console.log('Parsed request body:', requestBody);

    const { prompt, aspect_ratio } = requestBody;

    if (!prompt || !aspect_ratio) {
        console.error('Missing prompt or aspect_ratio in request body');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing prompt or aspect_ratio in request body' })
        };
    }

    try {
        console.log('Calling Replicate API');
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "862a6b656c6e0b0ce83e6820ec33e99be0b40c424937af00d91ff796853d272b",
                input: {
                    model: "dev",
                    prompt: prompt,
                    lora_scale: 1,
                    num_outputs: 1,
                    aspect_ratio: aspect_ratio,
                    output_format: "jpg",
                    guidance_scale: 3.5,
                    output_quality: 100,
                    prompt_strength: 0.8,
                    extra_lora_scale: 1,
                    num_inference_steps: 50
                }
            })
        });

        const data = await response.json();
        console.log('Replicate API response:', data);
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Error calling Replicate API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error calling Replicate API: ' + error.message })
        };
    }
};