'use client';

import { useState } from 'react';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

type ProductImageGalleryProps = {
  images: string[];
  productTitle: string;
};

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );
}

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) {
    return null;
  }

  const currentImage = images[selectedImageIndex] || images[0];
  const mainFailed = failedImages.has(selectedImageIndex);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main image display */}
      <ScrollReveal className="w-full">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-none border border-stone-200/80 bg-white shadow-sm">
          {mainFailed ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={currentImage}
              alt={productTitle}
              fill
              className="object-cover"
              priority
              onError={() => setFailedImages((prev) => new Set(prev).add(selectedImageIndex))}
            />
          )}
        </div>
      </ScrollReveal>
      
      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-none bg-white shadow-sm cursor-pointer hover:shadow-md transition-all border-2 ${
                selectedImageIndex === index
                  ? 'border-[color:var(--logo-pink)] shadow-md'
                  : 'border-transparent'
              }`}
            >
              {failedImages.has(index) ? (
                <ImagePlaceholder />
              ) : (
                <Image 
                  src={imageUrl} 
                  alt={`${productTitle} - Image ${index + 1}`}
                  fill 
                  className="object-cover transition-transform duration-300 ease-out hover:scale-[1.02]"
                  onError={() => setFailedImages(prev => new Set(prev).add(index))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}








