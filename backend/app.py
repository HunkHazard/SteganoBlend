from flask import Flask, request, jsonify
import backend.utils as utils

app = Flask(__name__)


@app.route('/api/encode', methods=['POST'])
def api_encode():
    print("[HIT] /api/encode")

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'})
    image = utils.fileToImage(request.files['image'])

    return jsonify({'status': 'success', 'message': 'Image encoded successfully'})


@app.route('/api/decode', methods=['POST'])
def api_decode():
    print("[HIT] /api/decode")

    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image uploaded'})
    image = utils.fileToImage(request.files['image'])

    return jsonify({'status': 'success', 'message': 'Message decoded successfully'})


if __name__ == '__main__':
    app.run(debug=True)
