from flask import Flask, request, jsonify
from algorithms.encode import encode_message
from algorithms.decode import decode_message

app = Flask(__name__)


@app.route('/api/encode', methods=['POST'])
def api_encode():
    # Handle the uploaded image and message for encoding
    # Use the encode_message function from the steganography module
    # Return the encoded image as a response or any relevant data
    return jsonify({'status': 'success', 'message': 'Image encoded successfully'})


@app.route('/api/decode', methods=['POST'])
def api_decode():
    # Handle the uploaded image for decoding
    # Use the decode_message function from the steganography module
    # Return the decoded message as a response or any relevant data
    return jsonify({'status': 'success', 'message': 'Message decoded successfully'})


if __name__ == '__main__':
    app.run(debug=True)
