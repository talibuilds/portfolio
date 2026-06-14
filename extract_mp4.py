import cv2
import sys
from PIL import Image

def extract_video_frames(video_path, output_path, interval_sec=1.0):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video")
        return
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Video FPS: {fps}, Total Frames: {total_frames}")
    
    frame_interval = int(fps * interval_sec)
    
    frames = []
    success, image = cap.read()
    count = 0
    
    while success:
        if count % frame_interval == 0:
            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            frames.append((count / fps, image))
        success, image = cap.read()
        count += 1
        
    cap.release()
    
    # Create sprite sheet
    cols = 5
    rows = (len(frames) + cols - 1) // cols
    
    h, w, _ = frames[0][1].shape
    max_w = 300
    ratio = max_w / w
    w = int(w * ratio)
    h = int(h * ratio)
    
    sheet = Image.new("RGB", (w * cols, h * rows), (0, 0, 0))
    
    for i, (t, frame) in enumerate(frames):
        img = Image.fromarray(frame).resize((w, h), Image.Resampling.LANCZOS)
        row = i // cols
        col = i % cols
        sheet.paste(img, (col * w, row * h))
        
    sheet.save(output_path, "JPEG", quality=85)
    print(f"Saved {len(frames)} frames to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <video> <output>")
    else:
        extract_video_frames(sys.argv[1], sys.argv[2])
