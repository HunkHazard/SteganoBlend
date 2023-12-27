import hashlib
from utils.helperFunctions import determineImageType, displayImage, text_to_binary, generate_key, encrypt_message, decrypt_message, hide_text_in_image, retrieve_text_from_image, typeChecker
import numpy as np


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
    if typeChecker(original_image):  # image is grayscale
        return apply_encryption(original_image=original_image, image_to_hide=image_to_hide, bit_shift=bit_shift)

    else:
        encrypted_image = original_image.copy()
        for i in range(original_image.shape[2]):
            encrypted_image[:, :, i] = apply_encryption(
                original_image[:, :, i], image_to_hide[:, :, i], bit_shift)
        return encrypted_image


def multipleBitDecryption(encrypted_image, bit_shift):
    if typeChecker(encrypted_image):
        return apply_decryption(encrypted_image, bit_shift)
    else:
        decrypted_image = encrypted_image.copy()
        for i in range(encrypted_image.shape[2]):
            decrypted_image[:, :, i] = apply_decryption(
                encrypted_image[:, :, i], bit_shift)
        return decrypted_image


def multiBitTextEncryption(cover_image, text_to_hide, bit_shift, stop_character='\0'):
    binary_text = text_to_binary(text_to_hide) + text_to_binary(stop_character)

    bit_shift = int(bit_shift)
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
