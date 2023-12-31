import base64
import string
from skimage.feature import match_template
from skimage.metrics import mean_squared_error as mse
import matplotlib.pyplot as plt
from skimage.metrics import peak_signal_noise_ratio as psnr
import cv2
import numpy as np
from cryptography.fernet import Fernet
import os


def displayImage(image, label='Image'):
    cv2.imshow(label, image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# convert the incoming file to an numpy array (image)
def fileToImage(file):
    return cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)


def imageToFile(image):
    return cv2.imencode('.png', image)[1].tobytes()


def determineImageType(image):
    if len(image.shape) == 2:
        return 'grayscale'
    elif len(image.shape) == 3 and image.shape[2] == 3:
        return 'rgb'
    else:
        raise ValueError("Unsupported image type")


def resizeImage(original_image, image_to_hide):
    return cv2.resize(image_to_hide, (original_image.shape[1], original_image.shape[0]))

# Function to check if the text contains only English alphabets, digits, and common punctuation


def createClientFile(image):
    img_file = imageToFile(image)
    img_file = base64.b64encode(img_file).decode('utf-8')

    return img_file


def is_valid_text(text):
    valid_characters = string.ascii_letters + \
        string.digits + string.punctuation + ' '
    return all(char in valid_characters for char in text)


# Function to convert text to binary
def text_to_binary(text):
    binary_text = ''.join(format(ord(char), '08b') for char in text)
    return binary_text


def binary_to_text(binary):
    text = ''.join(chr(int(binary[i:i+8], 2))
                   for i in range(0, len(binary), 8))
    return text


def decrypt_message(encrypted_message, key):
    try:
        f = Fernet(key)
        return f.decrypt(encrypted_message).decode()
    except Exception as e:
        return "Decryption failed: Invalid key or corrupted data"

# Encryption and Decryption


def generate_key():
    return Fernet.generate_key()


def encrypt_message(message, key):
    f = Fernet(key)
    return f.encrypt(message.encode())


def saveImage(image, filename):

    # Check if the directory exists
    if not os.path.exists('static/'):
        os.makedirs('static/')

    cv2.imwrite('static/' + filename, image)


def hide_text_in_image(image, text_to_hide, bit_shift=1):
    binary_text = text_to_binary(text_to_hide)
    width, height = image.size

    if len(binary_text) > width * height * 3 * bit_shift:
        raise ValueError("Text too long for the given image and bit shift")

    pixel_index = 0
    for y in range(height):
        for x in range(width):
            pixel = list(image.getpixel((x, y)))
            for c in range(3):
                if pixel_index < len(binary_text):
                    pixel[c] = pixel[c] & ~(1 << bit_shift) | (
                        int(binary_text[pixel_index]) << bit_shift)
                    pixel_index += 1
            image.putpixel((x, y), tuple(pixel))
    return image


def retrieve_text_from_image(image, bit_shift=1):
    binary_text = ''
    width, height = image.size

    for y in range(height):
        for x in range(width):
            pixel = list(image.getpixel((x, y)))
            for c in range(3):
                binary_text += str((pixel[c] & (1 << bit_shift)) >> bit_shift)
                if len(binary_text) % 8 == 0 and len(binary_text) >= 8:
                    if binary_text[-8:] == '00000000':
                        return binary_to_text(binary_text[:-8])
    return binary_to_text(binary_text)


def typeChecker(img):
    if len(img.shape) == 2:
        return True  # grayscale
    else:
        return False  # color


def calculate_psnr(img1, img2):
    return psnr(img1, img2)


def plot_histogram(image, title):
    color = ('b', 'g', 'r')
    for i, col in enumerate(color):
        histr = cv2.calcHist([image], [i], None, [256], [0, 256])
        plt.plot(histr, color=col)
        plt.xlim([0, 256])
    plt.title(title)
    plt.show()


def calculate_mse(img1, img2):
    return mse(img1, img2)


def calculate_ncc(img1, img2):
    return match_template(img1, img2).max()
