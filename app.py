import os
import io
import base64
import numpy as np

from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={
    r"/predict": {
        "origins": "https://yogesh23082007.github.io"
    }
})

# Load trained model weights
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
weights = np.load(os.path.join(BASE_DIR, "mnist_weights.npz"))

W1 = weights["W1"]
b1 = weights["b1"]
W2 = weights["W2"]
b2 = weights["b2"]


def preprocess_image(image_data):
    image_data = image_data.split(",", 1)[1]
    image_bytes = base64.b64decode(image_data)

    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = image.point(lambda p: 255 if p > 30 else 0)

    bbox = image.getbbox()

    if bbox is None:
        raise ValueError("Please draw a digit.")

    image = image.crop(bbox)
    image.thumbnail((20, 20))

    canvas = Image.new("L", (28, 28), 0)

    x = (28 - image.width) // 2
    y = (28 - image.height) // 2

    canvas.paste(image, (x, y))

    image_array = np.array(canvas).astype("float32") / 255.0

    return image_array.reshape(1, 784)


def predict_digit(image):
    # Hidden layer: ReLU
    hidden = np.maximum(0, np.dot(image, W1) + b1)

    # Output layer
    output = np.dot(hidden, W2) + b2

    # Softmax
    output = output - np.max(output, axis=1, keepdims=True)
    exp_output = np.exp(output)
    probabilities = exp_output / np.sum(exp_output, axis=1, keepdims=True)

    prediction = int(np.argmax(probabilities))
    confidence = float(probabilities[0][prediction])

    return prediction, confidence, probabilities[0].tolist()


@app.route("/")
def home():
    return jsonify({
        "message": "MNIST Digit Recognition API is running!"
    })


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"error": "No image received"}), 400

        processed_image = preprocess_image(data["image"])

        prediction, confidence, probabilities = predict_digit(
            processed_image
        )

        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "probabilities": probabilities
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
