from skimage.feature import match_template
from skimage.metrics import mean_squared_error as mse
import matplotlib.pyplot as plt
from skimage.metrics import structural_similarity as ssim
from skimage.metrics import peak_signal_noise_ratio as psnr
import cv2
import numpy as np
from cryptography.fernet import Fernet
import os


seq = 32  # length of sequence


def display(img, title='Image'):
    cv2.imshow(title, img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


def generateSequence(bits=3):
    # a numpy array of length 5 random integers between 1 and bits
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
            encrypted_pixel = channel[i, j]
            decrypted_pixel = encrypted_pixel.copy()
            decrypted_pixel <<= (8 - random_bit_shift[j % seq])

            channel[i, j] = decrypted_pixel

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
    return decrypted_pixel


def encryptImage(original_img, secret_img, bits=3):
    dimensions = (secret_img.shape[0], secret_img.shape[1])

    secret_img = cv2.resize(
        secret_img, (original_img.shape[1], original_img.shape[0]))

    encrypted_img = original_img.copy()
    random_bit_shift = generateSequence(bits)
    for i in range(3):
        channelEncrypt(encrypted_img[:, :, i],
                       secret_img[:, :, i], random_bit_shift)

    sequence = addDimensionToSequence(random_bit_shift, dimensions)
    sequence = encryptSequence(sequence)

    return encrypted_img, sequence


def decryptImage(encrypted_img, sequence):
    sequence = decryptSequence(sequence)

    dimensions = (sequence[-2], sequence[-1])
    sequence = sequence[:-2]

    decrypted_img = encrypted_img.copy()
    for i in range(3):
        channelDecrypt(decrypted_img[:, :, i], sequence)

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


def encryptSequence(sequence):
    sequence = sequence.tobytes()

    # will move this to .env file later
    secret_pass = b'jBeyakSKKnW-ebH2MKuk7JQ5rj0uU2WnvqZ6csfmPDo='
    f = Fernet(secret_pass)

    encrypted_sequence = f.encrypt(sequence)
    # print(encrypted_sequence)

    # convert from bytes to string (this will be sent back to the client)
    encrypted_sequence = encrypted_sequence.decode('utf-8')
    # print(encrypted_sequence)

    return encrypted_sequence


def decryptSequence(encrypted_sequence):
    secret_pass = b'jBeyakSKKnW-ebH2MKuk7JQ5rj0uU2WnvqZ6csfmPDo='
    f = Fernet(secret_pass)

    decrypted_sequence = f.decrypt(encrypted_sequence)

    # convert from bytes to numpy array
    decrypted_sequence = np.frombuffer(decrypted_sequence, dtype=np.int64)
    # print(decrypted_sequence)

    return decrypted_sequence


def main():
    # bits = 2
    # original_img = cv2.imread('original.jpg')
    # secret_img = cv2.imread('car.jpeg')

    # # display(original_img, 'Original')
    # # display(secret_img, 'Secret')

    # # plot_histogram(original_img, 'Original')

    # encrypted_img, sequence = encryptImage(original_img, secret_img, bits=bits)
    # # display(encrypted_img, 'Encrypted')
    # # plot_histogram(encrypted_img, 'Encrypted')

    # encrypted_img, sequence = encryptImage(original_img, secret_img, bits=bits)
    # print("PSNR: ", calculate_psnr(original_img, encrypted_img))
    # print("MSE: ", calculate_mse(original_img, encrypted_img))
    # print("NCC: ", calculate_ncc(original_img, encrypted_img))

    # decrypted_img = decryptImage(encrypted_img, sequence)
    # # display(decrypted_img, 'Decrypted')

    sequence = generateSequence()
    print(sequence)
    encrypted_sequence = encryptSequence(sequence)
    print(encrypted_sequence)
    decrypted_sequence = decryptSequence(encrypted_sequence)
    print(decrypted_sequence)


# if __name__ == '__main__':
#     main()
