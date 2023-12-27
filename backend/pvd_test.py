from pvd_ver_lib import pvd_lib

# Example paths, replace these with your actual paths
ref_image_path = "ron2.jpg"
secret_file_path = "C:\\Users\\MM Traders\\Desktop\DIP PROJECT\\text.txt"
output_image_path = "C:\\Users\\MM Traders\\Desktop\DIP PROJECT\\output_image_with_embedded_data.png"
output_secret_path = "C:\\Users\\MM Traders\\Desktop\DIP PROJECT\\output_secret_file.txt"


""" Test """
if __name__ == "__main__":

    pvd_obj = pvd_lib()

    # Embed data
    pvd_obj.pvd_embed(ref_image_path, secret_file_path, output_image_path)

    # Extract data
    pvd_obj.pvd_extract(ref_image_path, output_secret_path, output_image_path)
