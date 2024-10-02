// netlify/functions/proxyApi.js

const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const { prompt, aspect_ratio } = JSON.parse(event.body);
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
    'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`, // Use environment variable
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
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
