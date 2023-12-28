import cv2
import numpy as np
from cryptography.fernet import Fernet
import os


seq = 32  # length of sequence
# increasing this will add thicker lines to the decrypted image


def generateSequence(bits=4):
    # would be better if generate these ourselves instead of using this function
    sequence = np.random.randint(1, bits, size=(seq,))
    return sequence


# to resize the image to the original dimensions (the secret image)
def addDimensionToSequence(sequence, dimensions):
    sequence = np.append(sequence, dimensions[0])
    sequence = np.append(sequence, dimensions[1])
    return sequence


def channelEncrypt(channel, hidden_channel, random_bit_shift):
    for i in range(channel.shape[0]):
        for j in range(channel.shape[1]):
            original_pixel = channel[i, j]
            hidden_pixel = hidden_channel[i, j]
            encrypted_pixel = encryptPixel(
                original_pixel, hidden_pixel, random_bit_shift[j % seq])
            channel[i][j] = encrypted_pixel


def channelDecrypt(channel, random_bit_shift):
    for i in range(channel.shape[0]):
        for j in range(channel.shape[1]):
            channel[i, j] = decryptPixel(
                channel[i, j], random_bit_shift[j % seq])

    return channel


def encryptPixel(original_pixel, hidden_pixel, bit_shift):
    encrypted_pixel = original_pixel.copy()
    encrypted_pixel >>= bit_shift
    encrypted_pixel <<= bit_shift
    hidden_pixel >>= (8 - bit_shift)
    encrypted_pixel |= hidden_pixel

    return encrypted_pixel


def decryptPixel(encrypted_pixel, bit_shift):
    decrypted_pixel = encrypted_pixel.copy()
    decrypted_pixel <<= (8 - bit_shift)

    decrypted_pixel &= 0b10000000  # QUICK FIX FOR VERTICAL LINE ISSUE

    return decrypted_pixel


def encryptImage(original_img, secret_img, bits=4):
    dimensions = (secret_img.shape[0], secret_img.shape[1])

    secret_img = cv2.resize(
        secret_img, (original_img.shape[1], original_img.shape[0]))

    encrypted_img = original_img.copy()
    random_bit_shift = generateSequence(bits)
    for i in range(3):
        channelEncrypt(encrypted_img[:, :, i],
                       secret_img[:, :, i], random_bit_shift)

    sequence = addDimensionToSequence(random_bit_shift, dimensions)
    sequence, key = encryptSequence(sequence)

    return encrypted_img, sequence, key


def decryptImage(encrypted_img, sequence, key):

    sequence = decryptSequence(sequence, key)

    dimensions = (sequence[-2], sequence[-1])
    sequence = sequence[:-2]

    decrypted_img = encrypted_img.copy()
    for i in range(3):
        channelDecrypt(decrypted_img[:, :, i], sequence)

    saveImage(decrypted_img, 'decrypted_image_inter.jpg')

    decrypted_img = cv2.resize(
        decrypted_img, (dimensions[1], dimensions[0]))

    return decrypted_img


def applyBilinearInterpolation(img, dimensions):
    interpolated_img = cv2.resize(
        img, (int(img.shape[1] * dimensions), int(img.shape[0] * dimensions)), interpolation=cv2.INTER_LINEAR)
    return interpolated_img


def saveImage(img, filename):
    if not os.path.exists('static'):
        os.makedirs('static')

    filename = os.path.join('static', filename)
    cv2.imwrite(filename, img)


def encryptSequence(sequence):
    sequence = sequence.tobytes()

    # will move this to .env file later
    # secret_pass = b'jBeyakSKKnW-ebH2MKuk7JQ5rj0uU2WnvqZ6csfmPDo='
    secret_pass = Fernet.generate_key()
    f = Fernet(secret_pass)

    encrypted_sequence = f.encrypt(sequence)
    # print(encrypted_sequence)

    # convert from bytes to string (this will be sent back to the client)
    encrypted_sequence = encrypted_sequence.decode('utf-8')
    key = secret_pass.decode('utf-8')
    # print(encrypted_sequence)

    return encrypted_sequence, key


def decryptSequence(encrypted_sequence, key):
    # secret_pass = b'jBeyakSKKnW-ebH2MKuk7JQ5rj0uU2WnvqZ6csfmPDo='
    secret_pass = key.encode("utf-8")
    f = Fernet(secret_pass)

    decrypted_sequence = f.decrypt(encrypted_sequence)

    # convert from bytes to numpy array
    decrypted_sequence = np.frombuffer(decrypted_sequence, dtype=np.int64)
    # print(decrypted_sequence)

    return decrypted_sequence
