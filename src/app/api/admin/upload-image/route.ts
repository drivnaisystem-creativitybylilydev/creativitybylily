import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const BUCKET = 'product-images';
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'avif'];

/**
 * Returns a signed upload URL so the browser can upload directly to
 * Supabase Storage without the file passing through Vercel.
 * This removes Vercel's 4.5 MB serverless body-size limit entirely.
 */
export async function POST(request: Request) {
  try {
    const supabase = createAdminClient();
    const { folder = 'products', filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    const extension = (filename.split('.').pop() || '').toLowerCase();
    const isAllowedMime = (contentType as string).startsWith('image/');
    const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);

    if (!isAllowedMime && !isAllowedExtension) {
      return NextResponse.json(
        { error: 'File must be an image (e.g. JPEG, PNG, HEIC, WebP)' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = extension || 'jpg';
    const storagePath = `${folder}/${timestamp}-${randomString}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error('Error creating signed upload URL:', error);
      return NextResponse.json(
        { error: `Failed to create upload URL: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: storagePath,
      publicUrl: urlData.publicUrl,
    });
  } catch (error) {
    console.error('Error in upload-image route:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
