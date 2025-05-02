from diffusers import StableDiffusionInpaintPipeline,StableDiffusionXLInpaintPipeline
import torch
from PIL import Image, ImageOps


# def inpaint(img, img_mask, prompt = "natural background, realistic, detailed, seamless continuation",
#             negative_prompt = "blurry, distorted, unrealistic, cartoonish, low quality", img_path = "processed/result.png"):

#     pipe = StableDiffusionInpaintPipeline.from_single_file(
#         "weights/realisticVisionV60B1_v51HyperInpaintVAE.safetensors",
#         torch_dtype=torch.float16,
#         use_safetensors=True,
#     ).to("cuda")

#     # pipe.enable_vae_tiling()

#     img = Image.open(img).convert("RGB")
#     img_mask = Image.open(img_mask).convert("L")

#     image = pipe(
#         negative_prompt = negative_prompt,
#         prompt=prompt,
#         image=img,
#         mask_image=img_mask,
#         num_inference_steps=50,
#         strength = 1,
#         guidance_scale=8
#     ).images[0]

#     image = image.resize(img.size)

#     image.save(img_path)

def inpaint(img, img_mask, prompt = "natural background, realistic, detailed, seamless continuation",
            negative_prompt = "blurry, distorted, unrealistic, cartoonish, low quality", img_path = "processed/result.png"):

    pipe = StableDiffusionXLInpaintPipeline.from_single_file(
        "weights/sd_xl_refiner_1.0.safetensors",
        torch_dtype=torch.float16,
        variant="fp16",
    ).to("cuda")

    # pipe.enable_vae_tiling()

    img = Image.open(img).convert("RGB")
    img_mask = Image.open(img_mask).convert("L")

    image = pipe(
        negative_prompt = negative_prompt,
        prompt=prompt,
        image=img,
        mask_image=img_mask,
        num_inference_steps=50,
        strength = 1,
        guidance_scale=8
    ).images[0]

    image = image.resize(img.size)

    image.save(img_path)



def outpaint(img_path, prompt="""expand the landscape naturally, ultra realistic, seamless blending,
             beautiful natural scenery, matching style, detailed textures, photorealistic, soft lighting, vivid
             but natural colors, smooth transitions, wide angle view""",
             negative_prompt = """blurry, distorted, low quality, duplicate elements, artifacts, unnatural
             patterns, sharp edges, bad anatomy, bad perspective, overexposed, underexposed, text, logo,
             watermark, ugly, unnatural colors, mutated""", padding=128):

    # 1. Load model
    pipe = StableDiffusionInpaintPipeline.from_single_file(
        "weights/realisticVisionV60B1_v51HyperInpaintVAE.safetensors",
        torch_dtype=torch.float16,
        use_safetensors=True,
    ).to("cuda")

    # 2. Open image
    img = Image.open(img_path).convert("RGB")

    # 3. Pad image
    padded_img = ImageOps.expand(img, border=padding, fill=(128,128,128))  # neutral gray padding

    # 4. Create mask: mask only the padded regions
    mask = Image.new("L", padded_img.size, 0)  # Start with black mask
    width, height = img.size
    mask.paste(255, (0, 0, padded_img.size[0], padding))  # Top
    mask.paste(255, (0, padded_img.size[1] - padding, padded_img.size[0], padded_img.size[1]))  # Bottom
    mask.paste(255, (0, 0, padding, padded_img.size[1]))  # Left
    mask.paste(255, (padded_img.size[0] - padding, 0, padded_img.size[0], padded_img.size[1]))  # Right

    mask.save("maskoutpain.png")

    # 5. Inpaint
    outpainted_image = pipe(
        negative_prompt = negative_prompt,
        prompt=prompt,
        image=padded_img,
        mask_image=mask,
        guidance_scale=7.5,
    ).images[0]

    # 6. Save
    outpainted_image.save("outpainted_output.png")


if __name__ == "__main__":
    IMG_PATH = "images/hat.jpg"
    IMG_MASK_PATH = "images/hatMask.png"
    PROMPT = "add a yellow flower"

    # instructPix2Pix(IMG_PATH, PROMPT)
    # inpaint(IMG_PATH,IMG_MASK_PATH, PROMPT)
    # inpaint_external(IMG_PATH,IMG_MASK_PATH, PROMPT)
    # outpaint(IMG_PATH)

    from huggingface_hub import snapshot_download

    # Download the entire model (including safetensors)
    snapshot_download(
        repo_id="kandinsky-community/kandinsky-2-2-decoder-inpaint",
        local_dir="weights/kandinsky-2-2-decoder-inpaint",
        ignore_patterns=["*.msgpack", "*.bin"],  # Optional: Exclude non-essential files
    )