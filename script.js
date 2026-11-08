
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("drawingCanvas");
    const clearBtn = document.getElementById("clearBtn");
    const predictBtn = document.getElementById("predictBtn");
    const placeholder = document.querySelector(".canvas-placeholder");
    const statusText = document.getElementById("status");
    const result = document.getElementById("result");
    const probabilityBars = document.getElementById("probabilityBars");

    const API_URL = "https://mnist-digitrecognition.onrender.com/predict";

    if (!canvas || !clearBtn || !predictBtn ||
        !statusText || !result || !probabilityBars) {
        console.error("Required HTML elements are missing.");
        return;
    }

    const ctx = canvas.getContext("2d");

    let isDrawing = false;
    let hasDrawing = false;

    // Initialize canvas
    function resetCanvas() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    resetCanvas();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Get mouse or touch position
    function getPosition(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) *
                canvas.width / rect.width,
            y: (event.clientY - rect.top) *
                canvas.height / rect.height
        };
    }

    // Start drawing
    canvas.addEventListener("pointerdown", (event) => {
        event.preventDefault();

        isDrawing = true;
        hasDrawing = true;

        canvas.setPointerCapture(event.pointerId);

        if (placeholder) {
            placeholder.style.display = "none";
        }

        const pos = getPosition(event);

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
        ctx.stroke();

        statusText.textContent = "Digit drawn. Ready to predict.";
    });

    // Continue drawing
    canvas.addEventListener("pointermove", (event) => {
        if (!isDrawing) return;

        event.preventDefault();

        const pos = getPosition(event);

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    // Stop drawing
    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath();
    }

    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("lostpointercapture", stopDrawing);

    // Clear canvas
    clearBtn.addEventListener("click", () => {
        resetCanvas();

        hasDrawing = false;

        if (placeholder) {
            placeholder.style.display = "flex";
        }

        result.textContent = "—";
        probabilityBars.innerHTML = "";

        statusText.textContent = "Canvas cleared. Draw a digit.";
    });

    // Show probability bars
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Server prediction failed.");
            }

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
    });

    console.log("MNIST Digit Recognizer initialized successfully.");

});
