document.getElementById("apiForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from reloading the page

    const prompt = document.getElementById("prompt").value;
    const aspectRatio = document.getElementById("aspect_ratio").value;

    // Prepare the data to send to the API
    const requestData = {
        version: "862a6b656c6e0b0ce83e6820ec33e99be0b40c424937af00d91ff796853d272b",
        input: {
            model: "dev",
            prompt: prompt,  // User input prompt
            lora_scale: 1,
            num_outputs: 1,
            aspect_ratio: aspectRatio,  // User input aspect ratio
            output_format: "jpg",
            guidance_scale: 3.5,
            output_quality: 100,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 50
        }
    };

    // Call the serverless function (proxy) instead of directly calling the API
    fetch('/.netlify/functions/proxyApi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, aspect_ratio: aspectRatio })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        document.getElementById("apiResponse").innerText = JSON.stringify(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error calling API.";
    });
});
