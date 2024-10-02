function checkImageStatus(predictionId) {
    console.log('Checking status for prediction:', predictionId);
    fetch(`/.netlify/functions/checkStatus?id=${predictionId}`)
    .then(response => {
        console.log('CheckStatus response status:', response.status);
        console.log('CheckStatus response headers:', response.headers);
        return response.text();
    })
    .then(text => {
        console.log('CheckStatus raw response:', text);
        try {
            return JSON.parse(text);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            throw new Error('Invalid JSON response');
        }
    })
    .then(data => {
        console.log('CheckStatus parsed data:', data);
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