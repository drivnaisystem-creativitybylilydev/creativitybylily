'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Browser-side Supabase client (anon key — used only for uploadToSignedUrl)
const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ImageUploadProps = {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
};

export default function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToUpload = filesArray.slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      alert(`You can only upload up to ${maxImages} images total.`);
      return;
    }

    setIsUploading(true);

    try {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'avif'];
      const MAX_SIZE = 50 * 1024 * 1024; // 50 MB — file goes directly to Supabase, not through Vercel

      const uploadPromises = filesToUpload.map(async (file) => {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        const isImageMime = file.type.startsWith('image/');
        const isImageExtension = allowedExtensions.includes(ext);
        if (!isImageMime && !isImageExtension) {
          throw new Error(`${file.name} is not a supported image (use JPEG, PNG, HEIC, WebP, etc.)`);
        }

        if (file.size > MAX_SIZE) {
          throw new Error(`${file.name} is too large. Maximum size is 50 MB.`);
        }

        // Step 1: Ask the API for a signed upload URL (only metadata sent through Vercel)
        const metaRes = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder: 'products',
            filename: file.name,
            contentType: file.type || 'image/jpeg',
          }),
        });

        if (!metaRes.ok) {
          const err = await metaRes.json();
          throw new Error(err.error || 'Failed to get upload URL');
        }

        const { token, path, publicUrl } = await metaRes.json();

        // Step 2: Upload the file directly from the browser to Supabase Storage
        // using uploadToSignedUrl — bypasses Vercel entirely and handles CORS correctly
        const { error: uploadError } = await supabaseBrowser.storage
          .from('product-images')
          .uploadToSignedUrl(path, token, file, {
            contentType: file.type || 'image/jpeg',
          });

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        }

        return publicUrl as string;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message || 'Unknown error. Check the browser console for details.'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return; // Already primary
    const newImages = [images[index], ...images.filter((_, i) => i !== index)];
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isUploading
            ? 'border-[color:var(--logo-pink)] bg-pink-50'
            : 'border-gray-300 hover:border-[color:var(--logo-pink)] hover:bg-pink-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,image/gif,image/bmp,image/tiff,image/avif,image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="w-12 h-12 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[color:var(--logo-pink)] font-semibold hover:opacity-80 transition-opacity"
              >
                Click to upload
              </button>
              <span className="text-gray-600"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500">
              JPEG, PNG, HEIC, WebP, GIF and other image formats up to 50 MB each ({images.length}/{maxImages} images)
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Uploaded Images ({images.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(index)}
                      className="bg-white text-gray-900 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
                      title="Set as primary"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-600"
                    title="Remove image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            First image will be used as the main product image
          </p>
        </div>
      )}
    </div>
  );
}








