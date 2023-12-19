from flask import Flask, request, jsonify
from utils.helperFunctions import fileToImage, determineImageType, displayImage, resizeImage
from algorithms.encode import multipleBitEncryption, multipleBitDecryption
# from algorithms.decode import multipleBitDecryption
from utils.helperFunctions import determineImageType, displayImage

import cv2

app = Flask(__name__)


@app.route('/api/encode', methods=['POST'])
def api_encode():
    print("[HIT] /api/encode")

    if 'original' not in request.files:
        return jsonify({'status': 'error', 'message': 'Original Image not uploaded'})

    if 'hidden' not in request.files:
        return jsonify({'status': 'error', 'message': 'Hidden Image not uploaded'})

    original_image = fileToImage(request.files['original'])
    hidden_image = fileToImage(request.files['hidden'])

    print(original_image.shape)
    print(hidden_image.shape)

    hidden_image = resizeImage(original_image, hidden_image)

    print(original_image.shape)
    print(hidden_image.shape)

    # Resize the hidden image to fit the original image

    displayImage(original_image, 'original_image')
    displayImage(hidden_image, 'hidden_image')

    # Encode the message into the image
    encoded_image = multipleBitEncryption(original_image, hidden_image, 1)
    displayImage(encoded_image, 'encoded_image')

    decoded_image = multipleBitDecryption(encoded_image, 1)
    displayImage(decoded_image, 'decoded_image')

    return jsonify({'status': 'success', 'message': 'Image encoded successfully'})


@app.route('/api/decode', methods=['POST'])
def api_decode():
    print("[HIT] /api/decode")

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'})
    image = fileToImage(request.files['image'])

    return jsonify({'status': 'success', 'message': 'Message decoded successfully'})


if __name__ == '__main__':
    app.run(debug=True)
