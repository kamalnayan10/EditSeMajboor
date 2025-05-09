from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse,StreamingResponse
import shutil
import os, io
from main import inpaint
from sam import generate_mask

app = FastAPI()

# Allow requests from frontend (localhost:5173 for Vite, adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
PROCESSED_DIR = "processed"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

@app.post("/upload")
async def upload_image(
    image: UploadFile = File(...),
    mask: UploadFile = File(...),
    prompt: str = Form(None),
):
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    mask_path = os.path.join(UPLOAD_DIR, mask.filename)
    with open(mask_path, "wb") as f:
        shutil.copyfileobj(mask.file, f)

    if len(prompt) > 0:
        inpaint(image_path, mask_path, prompt)
    else:
        inpaint(image_path, mask_path)

    return {"url": f"/processed/result.png"}

@app.post("/generate-mask")
async def upload_image(
    image: UploadFile = File(...),
    mask: UploadFile = File(...),
    x: float = Form(...),
    y: float = Form(...),
):
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    mask_path = os.path.join(UPLOAD_DIR, mask.filename)
    with open(mask_path, "wb") as f:
        shutil.copyfileobj(mask.file, f)

    mask_img = generate_mask(image_path, mask_path, float(x), float(y))

    # stream image back
    buf = io.BytesIO()
    mask_img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
    

@app.get("/processed/{filename}")
async def get_processed_image(filename: str):
    return FileResponse(os.path.join(PROCESSED_DIR, filename))
