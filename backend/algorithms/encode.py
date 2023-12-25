import hashlib
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from PIL import Image
from utils.helperFunctions import determineImageType, displayImage, text_to_binary, generate_key, encrypt_message, decrypt_message, hide_text_in_image, retrieve_text_from_image, saveImage
import sys
import numpy as np
import cv2
import os


def apply_encryption(original_image, image_to_hide, bit_shift):
    encrypted_image = original_image.copy()
    encrypted_image >>= bit_shift
    encrypted_image <<= bit_shift
    image_to_hide >>= (8 - bit_shift)
    encrypted_image |= image_to_hide
    return encrypted_image


def apply_decryption(encrypted_image, bit_shift):
    encrypted_image <<= (8 - bit_shift)
    return encrypted_image


def multipleBitEncryption(original_image, image_to_hide, bit_shift):
    if determineImageType(original_image) == 'grayscale':
        return apply_encryption(original_image, image_to_hide, bit_shift)
    elif determineImageType(original_image) == 'bgr' or determineImageType(original_image) == 'rgb':
        encrypted_image = original_image.copy()
        for i in range(original_image.shape[2]):
            encrypted_image[:, :, i] = apply_encryption(
                original_image[:, :, i], image_to_hide[:, :, i], bit_shift)
        return encrypted_image
    else:
        raise ValueError("Unsupported image type")


def multipleBitDecryption(encrypted_image, bit_shift):
    if determineImageType(encrypted_image) == 'grayscale':
        return apply_decryption(encrypted_image, bit_shift)
    elif determineImageType(encrypted_image) == 'bgr' or determineImageType(encrypted_image) == 'rgb':
        decrypted_image = encrypted_image.copy()
        for i in range(encrypted_image.shape[2]):
            decrypted_image[:, :, i] = apply_decryption(
                encrypted_image[:, :, i], bit_shift)
        return decrypted_image
    else:
        raise ValueError("Unsupported image type")


def multiBitTextEncryption(cover_image, text_to_hide, bit_shift, stop_character='\0'):
    binary_text = text_to_binary(text_to_hide) + text_to_binary(stop_character)

    width, height = cover_image.size

    # Check if the text is too long for the image
    if len(binary_text) > width * height * bit_shift:
        raise ValueError("Text too long for the given image and bit shift")

    # Iterate through each pixel
    pixel_index = 0
    for y in range(height):
        for x in range(width):
            pixel = list(cover_image.getpixel((x, y)))

            for c in range(3):  # For RGB channels
                if pixel_index < len(binary_text):
                    # Modify the LSB of the pixel color values
                    pixel[c] = pixel[c] & ~(1 << bit_shift) | (
                        int(binary_text[pixel_index]) << bit_shift)
                    pixel_index += 1

            cover_image.putpixel((x, y), tuple(pixel))

    return cover_image


def multiBitTextDecryption(modified_image, bit_shift, stop_character='\0'):
    width, height = modified_image.size

    binary_text = ''
    found_stop = False

    # Retrieve text until the stop character is found
    for y in range(height):
        for x in range(width):
            pixel = list(modified_image.getpixel((x, y)))

            for c in range(3):  # For RGB channels
                # Retrieve the LSB of the pixel color values
                binary_text += str((pixel[c] & (1 << bit_shift)) >> bit_shift)

                # Check for stop_character at the end of each character (8 bits)
                if len(binary_text) >= 8 and binary_text[-8:] == text_to_binary(stop_character):
                    found_stop = True
                    break

            if found_stop:
                break

        if found_stop:
            break

    # Remove the stop character from the binary text
    if found_stop:
        binary_text = binary_text[:-8]

    # Padding the binary text to multiples of 8 for conversion
    while len(binary_text) % 8 != 0:
        binary_text += '0'

    # Convert binary text back to characters
    extracted_text = ''.join(
        chr(int(binary_text[i:i + 8], 2)) for i in range(0, len(binary_text), 8))
    return extracted_text


def keyBasedTextEncoding(original_image, message):
    key = generate_key()
    encrypted_message = encrypt_message(message, key)
    modified_image = hide_text_in_image(original_image, encrypted_message)
    return modified_image, key


def keyBaseTextDecoding(retrieved_image, key):
    retrieved_data = retrieve_text_from_image(retrieved_image)
    decrypted_message = decrypt_message(retrieved_data.encode(), key)
    return decrypted_message


#######################################################################

# Randomized Bit Shifts Encryption Algorithm

def generateRandomBitShifts(shape):  # shape = (width, height, channels)
    random_bit_shifts = np.random.randint(1, 4, size=shape)
    sequence_string = ''
    for i in range(shape[0]):
        for j in range(shape[1]):
            sequence_string += str(random_bit_shifts[i, j])

    return random_bit_shifts, sequence_string


def encryptOrder(random_bit_shifts, key):
    encrypted_order = encrypt_message(random_bit_shifts, key)
    return encrypted_order


def decryptOrder(encrypted_order, key):
    decrypted_order = decrypt_message(encrypted_order, key)
    return decrypted_order


def encrypt_pixel(original_pixel, hidden_pixel, random_bit_shift):
    encrypted_pixel = original_pixel.copy()
    encrypted_pixel >>= random_bit_shift
    encrypted_pixel <<= random_bit_shift
    hidden_pixel >>= (8 - random_bit_shift)
    encrypted_pixel |= hidden_pixel
    return encrypted_pixel


def encrypt_channel(original_channel, hidden_channel, random_bit_shift):
    encrypted_channel = original_channel.copy()
    for i in range(original_channel.shape[0]):
        for j in range(original_channel.shape[1]):
            encrypted_channel[i, j] = encrypt_pixel(
                original_channel[i, j], hidden_channel[i, j], random_bit_shift[i, j])
    return encrypted_channel


def encryptImage(original_image, image_to_hide, random_bit_shifts):
    encrypted_image = original_image.copy()

    print("encryptImage reached")
    print(original_image.shape)
    print(image_to_hide.shape)
    print(random_bit_shifts.shape)

    if determineImageType(original_image) == 'grayscale':
        for i in range(original_image.shape[0]):
            for j in range(original_image.shape[1]):
                encrypted_image[i, j] = encrypt_pixel(
                    original_image[i, j], image_to_hide[i, j], random_bit_shifts[i, j])

    elif determineImageType(original_image) == 'bgr' or determineImageType(original_image) == 'rgb':
        for i in range(original_image.shape[2]):
            encrypted_image[:, :, i] = encrypt_channel(
                original_image[:, :, i], image_to_hide[:, :, i], random_bit_shifts[:, :, i])
    else:
        raise ValueError("Unsupported image type")

    return encrypted_image


def decryptImage(encrypted_image, decrypted_order):
    decrypted_image = encrypted_image.copy()
    if determineImageType(encrypted_image) == 'grayscale':
        for i in range(encrypted_image.shape[0]):
            for j in range(encrypted_image.shape[1]):
                decrypted_image[i, j] = apply_decryption(
                    encrypted_image[i, j], decrypted_order[i, j])

    elif determineImageType(encrypted_image) == 'bgr' or determineImageType(encrypted_image) == 'rgb':
        for i in range(encrypted_image.shape[2]):
            decrypted_image[i, j] = apply_decryption(
                encrypted_image[i, j], decrypted_order[i, j])
    else:
        raise ValueError("Unsupported image type")

    return decrypted_image


def derive_short_key(sequence_string, key):
    # Use a KDF (e.g., SHA-256) to derive a fixed-size key
    short_key = hashlib.sha256((key + sequence_string).encode()).digest()
    return short_key


def generateRandomBitShifts(shape, key):
    # Combine the key with the shape to create a unique seed
    seed = key + str(shape)

    # Use a cryptographic hash function to generate a seed for the random number generator
    seed = hashlib.sha256(seed.encode()).hexdigest()

    # Seed the random number generator
    np.random.seed(int(seed, 16))

    # Generate random bit shifts
    random_bit_shifts = np.random.randint(1, 4, size=shape)

    # Convert the 2D array to a flattened 1D array
    flat_shifts = random_bit_shifts.flatten()

    # Convert each shift value to a hexadecimal string and concatenate
    sequence_string = ''.join(format(shift, 'X') for shift in flat_shifts)

    return random_bit_shifts, sequence_string


def randomAlgorithmEncryption(original_image, image_to_hide):

    print("[Generating Key]")
    key = generate_key()
    key = key.decode('utf-8')
    print("[Key Generated]")

    print("[Generating Random Bit Shifts]")
    random_bit_shifts, sequence_string = generateRandomBitShifts(
        original_image.shape, key)
    print("[Random Bit Shifts Generated]")

    print("[Deriving Short Key]")
    short_key = derive_short_key(sequence_string, key)
    print("[Short Key Derived]")

    print("[Encrypting Order]")
    encrypted_order = encryptOrder(sequence_string, key)
    print("[Order Encrypted]")

    print("Encrypting Image")
    encrypted_image = encryptImage(
        original_image, image_to_hide, random_bit_shifts)
    print("Image Encrypted")

    saveImage(encrypted_image, 'encrypted_image.jpg')

    return encrypted_image, encrypted_order, short_key


def randomAlgorithmDecryption(encrypted_image, encrypted_order, key):
    sequence_string = decryptOrder(encrypted_order, key)
    decrypted_order = np.array(list(sequence_string)).reshape(
        encrypted_image.shape[0], encrypted_image.shape[1]).astype(int)

    print("Decrypting Image")
    decrypted_image = decryptImage(encrypted_image, decrypted_order)
    print("Image Decrypted")

    saveImage(decrypted_image, 'decrypted_image')
    return decrypted_image
