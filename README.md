# MNIST Handwritten Digit Recognition

## 📌 Project Overview

This project focuses on recognizing handwritten digits (0–9) using Deep Learning techniques.

A Neural Network model was developed and trained using TensorFlow and Keras on the MNIST dataset. The trained model predicts handwritten digits from input images. An interactive Gradio application allows users to draw digits and view the model's predictions.

## 🎯 Project Objectives

- Load and explore the MNIST dataset.
- Preprocess and normalize handwritten digit images.
- Build a Neural Network using TensorFlow and Keras.
- Train the model and evaluate its performance.
- Analyze predictions using a confusion matrix and classification report.
- Develop an interactive digit recognition application using Gradio.

## 📊 Dataset Information

The MNIST dataset contains grayscale images of handwritten digits.

- Training images: 60,000
- Testing images: 10,000
- Image dimensions: 28 × 28 pixels
- Image type: Grayscale
- Number of classes: 10 (digits 0–9)

The dataset was loaded using TensorFlow's built-in MNIST dataset.

## 🛠️ Technologies Used

- Python
- TensorFlow
- Keras
- NumPy
- Matplotlib
- Scikit-learn
- Gradio
- Pillow

## 🧠 Model Architecture

The project uses a Sequential Neural Network consisting of:

1. **Input Layer:** Accepts 28 × 28 pixel images.
2. **Flatten Layer:** Converts the image into a one-dimensional array.
3. **Hidden Layer:** 128 neurons with ReLU activation.
4. **Output Layer:** 10 neurons with Softmax activation to classify digits from 0 to 9.

### Model Configuration

- Optimizer: Adam
- Loss Function: Sparse Categorical Crossentropy
- Evaluation Metric: Accuracy
- Training Epochs: 5
- Batch Size: 32

## ⚙️ Project Workflow

1. Import the required Python libraries.
2. Load the MNIST dataset.
3. Visualize sample handwritten digit images.
4. Normalize pixel values between 0 and 1.
5. Build the Neural Network model.
6. Train the model using training data.
7. Evaluate the model using test data.
8. Generate predictions.
9. Analyze performance using a confusion matrix and classification report.
10. Deploy an interactive Gradio interface.

## 📈 Model Performance

The trained model achieved the following results on the MNIST test dataset:

- **Test Accuracy:** 97.47%
- **Test Loss:** 0.08315

The model was also evaluated using a confusion matrix and classification report to understand its performance across individual digit classes.

## 🚀 Interactive Application

The project includes an interactive application developed using Gradio.

**Features:**
- Draw handwritten digits from 0 to 9.
- Get predictions from the trained model.
- View prediction confidence scores.

## 💻 How to Run the Project

### Using Google Colab

1. Open Google Colab.
2. Upload `MNIST_DigitRecognition.ipynb`.
3. Run all notebook cells in sequence.
4. Train and evaluate the model.
5. Launch the Gradio application.
6. Draw a digit and view the prediction.

### Using a Local Environment

**Step 1: Clone the repository**

```bash
git clone https://github.com/Yogesh23082007/MNIST-DigitRecognition.git
```

**Step 2: Open the project folder**

```bash
cd MNIST-Digit-Recognition
```

**Step 3: Install dependencies**

```bash
pip install -r requirements.txt
```

**Step 4:** Open the notebook using Jupyter Notebook or JupyterLab and execute the cells.

## 📁 Project Structure

```text
MNIST-Digit-Recognition/
│
├── MNIST_DigitRecognition.ipynb
├── README.md
└── requirements.txt
```

## 🔮 Future Improvements

- Implement a Convolutional Neural Network (CNN).
- Improve recognition of user-drawn digits.
- Experiment with different model architectures.
- Enhance image preprocessing techniques.
- Improve the interactive application's user experience.

## 👨‍💻 Author

**Yogesh Lingutla**

B.Tech – Computer Science and Engineering

- **GitHub:** [Yogesh23082007](https://github.com/Yogesh23082007)
- **LinkedIn:** [Yogesh Lingutla](https://www.linkedin.com/in/yogesh-lingutla-b0404532b)

## 📜 Acknowledgement

This project was completed as part of my Machine Learning internship project work with Horizon Intern.

---

⭐ Thank you for visiting my project!
