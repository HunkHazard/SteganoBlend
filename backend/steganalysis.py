import cv2
from skimage.metrics import structural_similarity as ssim
import numpy as np

def calculate_psnr(original_image_path, stego_image_path):
    # Read images
    original_image = cv2.imread(original_image_path)
    stego_image = cv2.imread(stego_image_path)

    # Ensure the images have the same dimensions
    if original_image.shape != stego_image.shape:
        raise ValueError("Images must have the same dimensions")

    # Calculate PSNR
    mse = np.mean((original_image - stego_image) ** 2)
    max_pixel_value = 255.0
    psnr = 20 * np.log10(max_pixel_value / np.sqrt(mse))

    return psnr

def calculate_ssim(original_image_path, stego_image_path):
    # Read images
    original_image = cv2.imread(original_image_path, cv2.IMREAD_GRAYSCALE)
    stego_image = cv2.imread(stego_image_path, cv2.IMREAD_GRAYSCALE)

    # Ensure the images have the same dimensions
    if original_image.shape != stego_image.shape:
        raise ValueError("Images must have the same dimensions")

    # Calculate SSIM
    ssim_value, _ = ssim(original_image, stego_image, full=True)

    return ssim_value

# Example usage
original_image_path = 'ron2.jpg'
stego_image_path = 'output_image_with_embedded_data.png'

psnr_value = calculate_psnr(original_image_path, stego_image_path)
ssim_value = calculate_ssim(original_image_path, stego_image_path)

print(f"PSNR: {psnr_value} dB")
print(f"SSIM: {ssim_value}")
