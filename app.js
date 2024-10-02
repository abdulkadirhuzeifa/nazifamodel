console.log('app.js loaded');

function handleSubmit(e) {
    e.preventDefault();
    console.log('Form submitted from app.js');

    const prompt = document.getElementById("prompt").value;
    const aspectRatio = document.getElementById("aspect_ratio").value;

    console.log('Prompt:', prompt);
    console.log('Aspect Ratio:', aspectRatio);

    document.getElementById("apiResponse").innerText = "Form submitted from app.js";
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