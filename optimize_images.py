#!/usr/bin/env python3
from PIL import Image
import os

# List of images to optimize
images_to_optimize = [
    r"c:\Users\SANTOSH\OneDrive\Desktop\Amol\institute-site1\assets\img\TESTING.jpg",
    r"c:\Users\SANTOSH\OneDrive\Desktop\Amol\institute-site1\assets\img\Front_End.jpg",
    r"c:\Users\SANTOSH\OneDrive\Desktop\Amol\institute-site1\assets\img\UI_UX.jpg",
    r"c:\Users\SANTOSH\OneDrive\Desktop\Amol\institute-site1\assets\img\landing.png",
]

for img_path in images_to_optimize:
    if not os.path.exists(img_path):
        print(f"Skipping (not found): {os.path.basename(img_path)}")
        continue
    
    original_size = os.path.getsize(img_path)
    filename = os.path.basename(img_path)
    
    print(f"\nOptimizing: {filename}")
    print(f"  Original size: {original_size / 1024:.0f} KB")
    
    try:
        # Open the image
        img = Image.open(img_path)
        print(f"  Original dimensions: {img.size}")
        
        # Optimize resolution for web - max 1920px width for hero images
        max_width = 1920
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            print(f"  Resized to: {img.size}")
        
        # Convert RGBA to RGB if needed for JPEG
        if img.mode in ('RGBA', 'LA', 'P'):
            # Create white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Save with optimization
        if img_path.lower().endswith('.jpg') or img_path.lower().endswith('.jpeg'):
            img.save(img_path, quality=85, optimize=True)
        else:
            img.save(img_path, optimize=True)
        
        # Check new size
        new_size = os.path.getsize(img_path)
        reduction = ((original_size - new_size) / original_size * 100)
        print(f"  Optimized size: {new_size / 1024:.0f} KB")
        print(f"  Reduction: {reduction:.1f}%")
        
    except Exception as e:
        print(f"  Error optimizing {filename}: {e}")

print("\nImage optimization complete!")
