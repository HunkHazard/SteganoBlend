from utils.helperFunctions import determineImageType, displayImage
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
