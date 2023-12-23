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


def encryptImage(original_image, image_to_hide, random_bit_shifts):
    encrypted_image = original_image.copy()
    if determineImageType(original_image) == 'grayscale':
        for i in range(original_image.shape[0]):
            for j in range(original_image.shape[1]):
                encrypted_image[i, j] = apply_encryption(
                    original_image[i, j], image_to_hide[i, j], random_bit_shifts[i, j])

    elif determineImageType(original_image) == 'bgr' or determineImageType(original_image) == 'rgb':
        for i in range(original_image.shape[2]):
            encrypted_image[i, j] = apply_encryption(
                original_image[i, j], image_to_hide[i, j], random_bit_shifts[i, j])
    else:
        raise ValueError("Unsupported image type")

    saveImage(encrypted_image, 'encrypted_image')
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


def randomAlgorithmEncryption(original_image, image_to_hide):
    key = generate_key()

    random_bit_shifts, sequence_string = generateRandomBitShifts(
        original_image.shape)
    encrypted_order = encryptOrder(sequence_string, key)

    print("Encrypting Image")
    encrypted_image = encryptImage(
        original_image, image_to_hide, random_bit_shifts)
    print("Image Encrypted")

    saveImage(encrypted_image, 'decrypted_image')

    return encrypted_image, encrypted_order, key


def randomAlgorithmDecryption(encrypted_image, encrypted_order, key):
    sequence_string = decryptOrder(encrypted_order, key)
    decrypted_order = np.zeros(encrypted_image.shape)
    for i in range(encrypted_image.shape[0]):
        for j in range(encrypted_image.shape[1]):
            decrypted_order[i, j] = int(sequence_string[i * j])

    print("Decrypting Image")
    decrypted_image = decryptImage(encrypted_image, decrypted_order)
    print("Image Decrypted")

    saveImage(decrypted_image, 'decrypted_image')
    return decrypted_image
