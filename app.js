document.getElementById("apiForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const prompt = document.getElementById("prompt").value;
    const aspectRatio = document.getElementById("aspect_ratio").value;

    document.getElementById("apiResponse").innerText = "Generating image...";
    document.getElementById("generatedImage").style.display = "none";

    fetch('/.netlify/functions/proxyApi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, aspect_ratio: aspectRatio })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("apiResponse").innerText = "Error: " + data.error;
        } else {
            document.getElementById("apiResponse").innerText = "Image generated successfully!";
            checkImageStatus(data.id);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error calling API: " + error.message;
    });
});

function checkImageStatus(predictionId) {
    fetch(`/.netlify/functions/checkStatus?id=${predictionId}`)
    .then(response => response.json())
    .then(data => {
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
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error checking image status: " + error.message;
    });
}