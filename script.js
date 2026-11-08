
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const clearBtn = document.getElementById("clearBtn");
const predictBtn = document.getElementById("predictBtn");
const placeholder = document.querySelector(".canvas-placeholder");
const statusText = document.getElementById("status");
const result = document.getElementById("result");
const probabilityBars = document.getElementById("probabilityBars");

const API_URL = "https://mnist-digitrecognition.onrender.com/predict";

let isDrawing = false;
let hasDrawing = false;

// Canvas settings
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 18;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Get accurate mouse/touch position
function getPosition(event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height
    };
}

// Start drawing
canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    isDrawing = true;
    hasDrawing = true;
    canvas.setPointerCapture(event.pointerId);

    placeholder.style.display = "none";

    const position = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();

    statusText.textContent = "Digit drawn. Ready to predict.";
});

// Draw while moving
canvas.addEventListener("pointermove", (event) => {
    if (!isDrawing) return;

    event.preventDefault();

    const position = getPosition(event);

    ctx.lineTo(position.x, position.y);
    ctx.stroke();
});

// Stop drawing
function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);

// Clear canvas
clearBtn.addEventListener("click", () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hasDrawing = false;
    placeholder.style.display = "flex";

    result.textContent = "—";
    probabilityBars.innerHTML = "";

    statusText.textContent = "Canvas cleared. Draw a digit.";
});

// Display prediction probabilities
function displayProbabilities(probabilities) {
    probabilityBars.innerHTML = "";

    probabilities.forEach((probability, digit) => {
        const percentage = (probability * 100).toFixed(2);

        const row = document.createElement("div");
        row.className = "probability-row";

        row.innerHTML = `
            <div class="probability-label">
                <span>Digit ${digit}</span>
                <span>${percentage}%</span>
            </div>
            <div class="probability-track">
                <div class="probability-fill"
                     style="width: ${percentage}%"></div>
            </div>
        `;

        probabilityBars.appendChild(row);
    });
}

// Predict digit
predictBtn.addEventListener("click", async () => {
    if (!hasDrawing) {
        statusText.textContent = "Please draw a digit first.";
        return;
    }

    if (API_URL.startsWith("YOUR_RENDER")) {
        statusText.textContent =
            "Backend connection will be added in the next step.";
        return;
    }

    predictBtn.disabled = true;
    statusText.textContent = "AI is analyzing your digit...";
    result.textContent = "…";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                image: canvas.toDataURL("image/png")
            })
        });

        if (!response.ok) {
            throw new Error("Prediction request failed.");
        }

        const data = await response.json();

        if (!Array.isArray(data.probabilities) ||
            data.probabilities.length !== 10) {
            throw new Error("Invalid prediction response.");
        }

        result.textContent = data.prediction;
        displayProbabilities(data.probabilities);

        statusText.textContent =
            `Prediction completed! Confidence: ${(data.confidence * 100).toFixed(2)}%`;
} catch (error) {
    console.error("Prediction Error:", error);

    result.textContent = "—";
    statusText.textContent = "Error: " + error.message;

} finally {
    predictBtn.disabled = false;
}
    }
});
