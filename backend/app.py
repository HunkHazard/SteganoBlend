from flask import Flask, request, jsonify
from utils.helperFunctions import fileToImage, determineImageType, displayImage, resizeImage
from algorithms.encode import multipleBitEncryption, multipleBitDecryption, randomAlgorithmEncryption, randomAlgorithmDecryption
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


@app.route('/api/randomAlgoEncrypt', methods=['POST'])
def api_randomAlgo():
    print("[HIT] /api/randomAlgo")

    if 'original' not in request.files:
        return jsonify({'status': 'error', 'message': 'Original Image not uploaded'})

    if 'hidden' not in request.files:
        return jsonify({'status': 'error', 'message': 'Hidden Image not uploaded'})

    original_image = fileToImage(request.files['original'])
    hidden_image = fileToImage(request.files['hidden'])

    # print(original_image.shape)
    # print(hidden_image.shape)

    hidden_image = resizeImage(original_image, hidden_image)

    encrypted_image, encrypted_order, key = randomAlgorithmEncryption(
        original_image=original_image, image_to_hide=hidden_image)

    # convert the encrypted order which is bytes to json
    encrypted_order = encrypted_order.decode('utf-8')
    key = key.decode('utf-8')

    return jsonify({'status': 'success', 'message': 'Image encoded successfully', 'encrypted_order': encrypted_order, 'key': key})


@app.route('/api/randomAlgoDecrypt', methods=['POST'])
def api_randomAlgoDecrypt():
    print("[HIT] /api/randomAlgoDecrypt")

    if 'encrypted_image' not in request.files:
        return jsonify({'status': 'error', 'message': 'Encrypted Image not uploaded'})

    if 'encrypted_order' not in request.form:
        return jsonify({'status': 'error', 'message': 'Encrypted Order not uploaded'})

    if 'key' not in request.form:
        return jsonify({'status': 'error', 'message': 'Key not uploaded'})

    encrypted_image = fileToImage(request.files['encrypted_image'])
    encrypted_order = request.form['encrypted_order']
    key = request.form['key']
    print(encrypted_order)

    # convert the encrypted order which is json to bytes

    encrypted_order = encrypted_order.encode('utf-8')
    key = key.encode('utf-8')

    decrypted_order = randomAlgorithmDecryption(
        encrypted_image=encrypted_image, encrypted_order=encrypted_order, key=key)

    return jsonify({'status': 'success', 'message': 'Image decoded successfully', 'decrypted_order': decrypted_order})


@app.route('/api/decode', methods=['POST'])
def api_decode():
    print("[HIT] /api/decode")

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'})
    image = fileToImage(request.files['image'])

    return jsonify({'status': 'success', 'message': 'Message decoded successfully'})


if __name__ == '__main__':
    app.run(debug=True)
