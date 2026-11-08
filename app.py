
import os
import io
import base64

import numpy as np
import tensorflow as tf

from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained MNIST model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "mnist_model.keras"
)

model = tf.keras.models.load_model(MODEL_PATH)


def preprocess_image(image_data):
    # Decode image from frontend
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("L")

    # Convert white handwritten digit on black
    # background into MNIST format
    image = image.point(lambda p: 255 if p > 30 else 0)

    # Crop around the digit
    bbox = image.getbbox()

    if bbox is None:
        raise ValueError("Please draw a digit.")

    image = image.crop(bbox)

    # Resize while maintaining proportions
    image.thumbnail((20, 20))

    # Center inside 28x28 image
    canvas = Image.new("L", (28, 28), 0)

    x = (28 - image.width) // 2
    y = (28 - image.height) // 2

    canvas.paste(image, (x, y))

    # Normalize
    image_array = np.array(canvas).astype("float32") / 255.0

    return image_array.reshape(1, 28, 28)


@app.route("/")
def home():
    return jsonify({
        "message": "MNIST Digit Recognition API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({
                "error": "No image received"
            }), 400

        processed_image = preprocess_image(data["image"])

        predictions = model.predict(
            processed_image,
            verbose=0
        )[0]

        predicted_digit = int(np.argmax(predictions))
        confidence = float(predictions[predicted_digit])

        return jsonify({
            "prediction": predicted_digit,
            "confidence": confidence,
            "probabilities": predictions.tolist()
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
