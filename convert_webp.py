import cv2
import os
import glob


if __name__ == "__main__":
    # Traverse the entire folder structure and find all *.png files
    for png_file in glob.glob('**/*.png', recursive=True):
        # Create the webp filename by replacing .png with .webp
        webp_file = png_file.replace('.png', '.webp')

        # Read the PNG image
        png_img = cv2.imread(png_file, cv2.IMREAD_UNCHANGED)

        if png_img is not None:
            # Save as WebP with specified quality (80%)
            success = cv2.imwrite(webp_file, png_img, [int(cv2.IMWRITE_WEBP_QUALITY), 100])

            if success:
                # Remove the original PNG file
                # os.remove(png_file)
                print(f"Converted and replaced: {png_file} -> {webp_file}")
            else:
                print(f"Failed to convert: {png_file}")
        else:
            print(f"Could not read: {png_file}")
