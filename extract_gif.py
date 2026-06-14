from PIL import Image
import sys

def create_sprite_sheet(gif_path, output_path, num_frames=25):
    try:
        gif = Image.open(gif_path)
    except Exception as e:
        print(f"Error opening GIF: {e}")
        return

    frames = []
    try:
        while True:
            # Convert to RGB to ensure no palette issues
            frames.append(gif.convert("RGB"))
            gif.seek(gif.tell() + 1)
    except EOFError:
        pass

    total_frames = len(frames)
    if total_frames == 0:
        print("No frames found.")
        return

    print(f"Loaded {total_frames} frames from GIF.")
    
    # Pick frames evenly
    step = max(1, total_frames // num_frames)
    selected_frames = frames[::step][:num_frames]
    
    # Calculate grid size (5x5)
    cols = 5
    rows = (len(selected_frames) + cols - 1) // cols
    
    # Get frame size
    w, h = selected_frames[0].size
    
    # Scale down if too large (to keep the sprite sheet reasonable)
    max_w = 400
    if w > max_w:
        ratio = max_w / w
        w = int(w * ratio)
        h = int(h * ratio)
        selected_frames = [f.resize((w, h), Image.Resampling.LANCZOS) for f in selected_frames]

    # Create blank canvas
    sheet = Image.new("RGB", (w * cols, h * rows), (0, 0, 0))
    
    for i, frame in enumerate(selected_frames):
        row = i // cols
        col = i % cols
        sheet.paste(frame, (col * w, row * h))
        
    sheet.save(output_path, "JPEG", quality=85)
    print(f"Saved sprite sheet to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <input_gif> <output_jpg>")
    else:
        create_sprite_sheet(sys.argv[1], sys.argv[2])
