console.log('app.js loaded');

function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted from app.js');

    const prompt = document.getElementById("prompt").value;
    const aspectRatio = document.getElementById("aspect_ratio").value;

    console.log('Prompt:', prompt);
    console.log('Aspect Ratio:', aspectRatio);

    document.getElementById("apiResponse").innerText = "Sending request to API...";

    fetch('/.netlify/functions/proxyApi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, aspect_ratio: aspectRatio })
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('API response:', data);
        if (data.error) {
            document.getElementById("apiResponse").innerText = "Error: " + data.error;
        } else {
            document.getElementById("apiResponse").innerText = "Image generation started. ID: " + data.id;
            checkImageStatus(data.id);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error calling API: " + error.message;
    });
}

function checkImageStatus(predictionId) {
    console.log('Checking status for prediction:', predictionId);
    fetch(`/.netlify/functions/checkStatus?id=${predictionId}`)
    .then(response => {
        console.log('CheckStatus response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('CheckStatus response data:', data);
        document.getElementById("apiResponse").innerText = "Status: " + data.status;
        if (data.status === "succeeded") {
            document.getElementById("generatedImage").src = data.output[0];
            document.getElementById("generatedImage").style.display = "block";
        } else if (data.status === "failed") {
            document.getElementById("apiResponse").innerText = "Image generation failed: " + data.error;
        } else {
            setTimeout(() => checkImageStatus(predictionId), 2000);
        }
    })
    .catch((error) => {
        console.error('Error checking image status:', error);
        document.getElementById("apiResponse").innerText = "Error checking image status: " + error.message;
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded in app.js');
    const form = document.getElementById("apiForm");
    if (form) {
        console.log('Form found in app.js');
        form.addEventListener("submit", handleSubmit);
    } else {
        console.error('Form not found in app.js');
    }
});