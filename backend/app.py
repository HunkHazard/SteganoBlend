from flask import Flask, request, jsonify, send_file
from base64 import b64encode
from utils.helperFunctions import fileToImage, determineImageType, displayImage, resizeImage
from algorithms.encode import multipleBitEncryption, multipleBitDecryption,multiBitTextEncryption,keyBasedTextEncoding,keyBasedTextDecoding,multiBitTextDecryption
from algorithms.randomizer import encryptImage, decryptImage
# from algorithms.decode import multipleBitDecryption
from utils.helperFunctions import determineImageType, imageToFile, saveImage, createClientFile
import base64
import json
import numpy as np
from PIL import Image
import io
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)




@app.route('/api/encode', methods=['POST'])
def api_encode():
    print("[HIT] /api/encode")

    if 'original' not in request.files:
        return jsonify({'status': 'error', 'message': 'Original Image not uploaded'})

    if 'hidden' not in request.files:
        return jsonify({'status': 'error', 'message': 'Hidden Image not uploaded'})

    if 'bits' not in request.form:
        return jsonify({'status': 'error', 'message': 'Bits not uploaded'})

    original_image = fileToImage(request.files['original'])
    hidden_image = fileToImage(request.files['hidden'])
    bits = int(request.form['bits'])

    print(original_image.shape)
    print(hidden_image.shape)

    hidden_image = resizeImage(original_image, hidden_image)

    print(original_image.shape)
    print(hidden_image.shape)

    # Encode the message into the image
    encoded_image = multipleBitEncryption(original_image, hidden_image, bits)

    # for testing purpose; to be removed
    # saveImage(encoded_image, 'encoded_image.png')

    img_file = createClientFile(encoded_image)

    return jsonify({'status': 'success', 'message': 'Image encoded successfully', 'encoded_image': img_file})


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

    # bits is max 8 i.e. max no of bits to be used for encryption
    encrypted_image, encrypted_order, key = encryptImage(
        original_image, hidden_image, bits=4)

    # for testing purpose; to be removed
    # saveImage(encrypted_image, 'encrypted_image.png')

    img_file = createClientFile(encrypted_image)

    # send back the encrypted image and the encrypted order
    # encrypted order is a json string

    combined_data = {'encrypted_order': encrypted_order, 'key': key}
    combined_data_string = json.dumps(combined_data)
    encoded_combined_data = base64.b64encode(combined_data_string.encode()).decode()

    return jsonify({'status': 'success', 'message': 'Image encoded successfully', 'encrypted_image': img_file, 'combined_key': encoded_combined_data})


@app.route('/api/randomAlgoDecrypt', methods=['POST'])
def api_randomAlgoDecrypt():
    print("[HIT] /api/randomAlgoDecrypt")

    if 'encrypted_image' not in request.files:
        return jsonify({'status': 'error', 'message': 'Encrypted Image not uploaded'})

    if 'combined_key' not in request.form:
        return jsonify({'status': 'error', 'message': 'Combined Key not uploaded'})

    # Decoding the combined key back to encrypted_order and key
    encoded_combined_data = request.form['combined_key']
    decoded_combined_data = base64.b64decode(encoded_combined_data).decode()
    combined_data = json.loads(decoded_combined_data)
    encrypted_order = combined_data['encrypted_order']
    key = combined_data['key']


    encrypted_image = fileToImage(request.files['encrypted_image'])

    # convert the encrypted order which is json to bytes
    decrypted_img = decryptImage(encrypted_image, encrypted_order, key)

    # for testing purpose; to be removed
    saveImage(decrypted_img, 'decrypted_image.png')

    img_file = imageToFile(decrypted_img)
    img_file = base64.b64encode(img_file).decode('utf-8')

    return jsonify({'status': 'success', 'message': 'Image decoded successfully', 'decrypted_image': img_file})


@app.route('/api/decode', methods=['POST'])
def api_decode():
    print("[HIT] /api/decode")

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'})
    image = fileToImage(request.files['image'])

    if 'bits' not in request.form:
        return jsonify({'status': 'error', 'message': 'No bits uploaded'})

    bits = int(request.form['bits'])

    # Decode the message from the image
    decoded_image = multipleBitDecryption(image, bits)

    # for testing purpose; to be removed
    saveImage(decoded_image, 'decoded_image.png')

    img_file = createClientFile(decoded_image)

    return jsonify({'status': 'success', 'message': 'Image decoded successfully', 'decoded_image': img_file})


@app.route('/text-image-encrypt', methods=['POST'])
def handle_data():
    if 'image' not in request.files:
        return jsonify({'message': 'No image part in the request'}), 400
    if 'text' not in request.form:
        return jsonify({'message': 'No text part in the request'}), 400
    if 'technique' not in request.form:
        return jsonify({'message': 'No technique part in the request'}), 400
    
    image_file = request.files['image']
    text = request.form['text']
    technique = request.form['technique']

    if image_file.filename == '':
        return jsonify({'message': 'No image selected for uploading'}), 400

    in_memory_file = io.BytesIO()
    image_file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    cv_image = cv2.imdecode(data, 1)  # color_image_flag is usually 1 for color
    pil_image = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))

    if technique == 'multi-bit':
        bit_shift = request.form.get('bitShift', 1)  # Default to 1 if not provided
        result_image = multiBitTextEncryption(pil_image, text, int(bit_shift))
    elif technique == 'encryption':
        result_image, key = keyBasedTextEncoding(pil_image, text)
    else:
        return jsonify({'message': 'Invalid technique'}), 400


    result_image_np = np.array(result_image)
    result_image_np = cv2.cvtColor(result_image_np, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.png', result_image_np)
    base64_image = base64.b64encode(buffer).decode('utf-8')
    response_data = {'image': base64_image}
    if technique == 'encryption':
        response_data['key'] = key

    return jsonify(response_data), 200


@app.route('/text-image-decrypt', methods=['POST'])
def handle_decryption():
    if 'image' not in request.files:
        return jsonify({'message': 'No image part in the request'}), 400
    if 'technique' not in request.form:
        return jsonify({'message': 'No technique part in the request'}), 400
    
    image_file = request.files['image']
    technique = request.form['technique']

    if image_file.filename == '':
        return jsonify({'message': 'No image selected for uploading'}), 400

    in_memory_file = io.BytesIO()
    image_file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    cv_image = cv2.imdecode(data, 1)
    pil_image = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))

    decrypted_text = ''
    if technique == 'multi-bit':
        bit_shift = int(request.form.get('bitShift', 1))  # Default to 1 if not provided
        decrypted_text = multiBitTextDecryption(pil_image, bit_shift)
    elif technique == 'encryption':
        key = request.form.get('key', '')
        decrypted_text = keyBasedTextDecoding(pil_image, key)
    else:
        return jsonify({'message': 'Invalid technique'}), 400

    return jsonify({'decrypted_text': decrypted_text}), 200

if __name__ == '__main__':
    app.run(debug=True)
