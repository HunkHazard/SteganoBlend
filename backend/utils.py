import cv2
import numpy as np


def displayImage(image):
    cv2.imshow('Image', image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# convert the incoming file to an numpy array (image)
def fileToImage(file):
    return cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)
