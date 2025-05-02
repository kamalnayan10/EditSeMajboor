# fastapi_server.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
from main import inpaint

app = FastAPI()

# Allow requests from frontend (localhost:5173 for Vite, adjust as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to your frontend URL in production
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
):
    # Save original image
    image_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    # Save mask
    mask_path = os.path.join(UPLOAD_DIR, mask.filename)
    with open(mask_path, "wb") as f:
        shutil.copyfileobj(mask.file, f)

    # (Optionally) simulate processing
    inpaint(image_path, mask_path)

    return {"url": f"/processed/result.png"}

@app.get("/processed/{filename}")
async def get_processed_image(filename: str):
    return FileResponse(os.path.join(PROCESSED_DIR, filename))
