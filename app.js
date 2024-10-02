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
            document.getElementById("apiResponse").innerText = "API response received. ID: " + data.id;
            // Here you would typically call checkImageStatus(data.id)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error calling API: " + error.message;
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