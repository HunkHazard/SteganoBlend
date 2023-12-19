import cv2
import numpy as np


def displayImage(image, label='Image'):
    cv2.imshow(label, image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# convert the incoming file to an numpy array (image)
def fileToImage(file):
    return cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)


def determineImageType(image):
    if len(image.shape) == 2:
        return 'grayscale'
    elif len(image.shape) == 3 and image.shape[2] == 3:
        return 'rgb'
    # elif len(image.shape) == 3 and image.shape[2] == 3:
    #     return 'rgb'
    else:
        raise ValueError("Unsupported image type")


def resizeImage(original_image, image_to_hide):
    if original_image.shape[0] > image_to_hide.shape[0] and original_image.shape[1] > image_to_hide.shape[1]:
        return image_to_hide
    else:
        return cv2.resize(image_to_hide, (original_image.shape[1], original_image.shape[0]))
