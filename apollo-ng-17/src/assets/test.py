import os
import onnx

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the absolute path to the model file
model_path = os.path.join(script_dir, 'yolov8s.onnx')

print("Loading model from:", model_path)
model = onnx.load(model_path)
print("Model loaded successfully!")
