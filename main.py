from diffusers import StableDiffusionInpaintPipeline
import torch
from PIL import Image

def inpaint(img, img_mask, prompt = "empty natural background, seamless continuation, realistic scenery, background only, high detail, environment matching surrounding context",
            negative_prompt = "people, person, human, character, figure, face, body, text, animal, unnatural patterns, artifacts, distortion, blurry, duplicate, watermark, unrealistic",
            img_path = "processed/result.png"):

    pipe = StableDiffusionInpaintPipeline.from_single_file(
        "weights/cyberrealistic_v80Inpainting.safetensors",
        torch_dtype=torch.float16,
        use_safetensors=True,
    ).to("cuda")

    # model optimisation functions
    pipe.enable_model_cpu_offload()  # Offloads unused components to CPU
    pipe.enable_vae_slicing()        # Processes VAE in slices
    pipe.enable_vae_tiling()         # Processes VAE in tiles
    pipe.enable_attention_slicing(1) # More aggressive memory saving
    pipe.enable_xformers_memory_efficient_attention() 

    img = Image.open(img).convert("RGB")
    img_mask = Image.open(img_mask).convert("L")

    original_size = img.size

    torch.cuda.empty_cache()
    with torch.no_grad():
        image = pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=img,
            mask_image=img_mask,
            num_inference_steps=50,            
            guidance_scale=14,                  
            strength=1,                       
        ).images[0]


    del pipe
    torch.cuda.empty_cache()

    image = image.resize(original_size, Image.LANCZOS)

    # Composite result: Only apply changes inside mask
    final_image = Image.composite(image, img, img_mask)

    final_image.save(img_path)


if __name__ == "__main__":
    IMG_PATH = "images/building.jpg"
    IMG_MASK_PATH = "images/buildingMask.png"
    PROMPT = "add a football stadium"

    inpaint(IMG_PATH,IMG_MASK_PATH, PROMPT)