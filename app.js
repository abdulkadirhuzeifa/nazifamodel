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
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        console.log('ProxyApi response:', data);
        document.getElementById("apiResponse").innerText = "Image generation started. ID: " + data.id;
        checkImageStatus(data.id);
    })
    .catch((error) => {
        console.error('Error:', error);
        document.getElementById("apiResponse").innerText = "Error calling proxyApi: " + error.message;
    });
});

function checkImageStatus(predictionId) {
    console.log('Checking status for prediction:', predictionId);
    fetch(`/.netlify/functions/checkStatus?id=${predictionId}`)
    .then(response => {
        console.log('CheckStatus response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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