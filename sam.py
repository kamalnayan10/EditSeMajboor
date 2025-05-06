import torch
from sam2.build_sam import build_sam2
from sam2.sam2_image_predictor import SAM2ImagePredictor

from PIL import Image, ImageChops
import numpy as np
import matplotlib.pyplot as plt

def generate_mask(img_path, mask_path, x, y):
    checkpoint = "weights/sam2.1_hiera_large.pt"
    model_cfg = "E:/PROGRAMMING/PYTHON/img_edit/weights/sam2.1_hiera_l.yaml"
    predictor = SAM2ImagePredictor(build_sam2(model_cfg, checkpoint))

    image = Image.open(img_path)
    image = np.array(image)

    prev_mask = Image.open(mask_path).convert("L")

    input_point = np.array([[x,y]])
    input_label = np.array([1])


    with torch.inference_mode(), torch.autocast("cuda", dtype=torch.bfloat16):
        predictor.set_image(image)
        gen_mask, _, _ = predictor.predict(point_coords=input_point, point_labels=input_label, multimask_output=False)

    gen_mask = Image.fromarray((gen_mask[0] * 255).astype(np.uint8))

    prev_arr = np.array(prev_mask, dtype=np.uint8)
    gen_arr  = np.array(gen_mask, dtype=np.uint8)
    combined_arr = np.maximum(prev_arr, gen_arr)

    # 5) return as PIL image
    combined = Image.fromarray(combined_arr, mode="L")

    return combined

if __name__ == "__main__":
    IMG_PATH = "E:/PROGRAMMING/PYTHON/img_edit/images/building.jpg"
    POINTS = [470,395]

    mask = generate_mask(IMG_PATH, POINTS[0], POINTS[1])

    mask.save("mask.png")