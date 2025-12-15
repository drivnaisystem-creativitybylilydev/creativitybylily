'use client';

import { useState } from 'react';
import Image from 'next/image';

type ProductImageGalleryProps = {
  images: string[];
  productTitle: string;
};

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main image display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm">
        <Image 
          src={currentImage} 
          alt={productTitle} 
          fill 
          className="object-cover" 
          priority
        />
      </div>
      
      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm cursor-pointer hover:shadow-md transition-all border-2 ${
                selectedImageIndex === index
                  ? 'border-[color:var(--logo-pink)] shadow-md'
                  : 'border-transparent'
              }`}
            >
              <Image 
                src={imageUrl} 
                alt={`${productTitle} - Image ${index + 1}`}
                fill 
                className="object-cover hover:scale-105 transition-transform duration-300" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}








