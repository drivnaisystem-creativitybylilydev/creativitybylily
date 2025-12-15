'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'event' as 'event' | 'popup' | 'market',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    link: '',
    is_featured: false,
    image_url: '',
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/admin/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load event');
        }

        const event = data.event;
        const startDate = new Date(event.start_date);
        const endDate = event.end_date ? new Date(event.end_date) : null;

        setFormData({
          title: event.title,
          type: event.type,
          description: event.description,
          start_date: startDate.toISOString().split('T')[0],
          start_time: startDate.toTimeString().slice(0, 5),
          end_date: endDate ? endDate.toISOString().split('T')[0] : '',
          end_time: endDate ? endDate.toTimeString().slice(0, 5) : '',
          location: event.location,
          link: event.link || '',
          is_featured: event.is_featured,
          image_url: event.image_url || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load event');
      } finally {
        setIsLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const startDateTime = formData.start_date && formData.start_time
        ? `${formData.start_date}T${formData.start_time}:00`
        : formData.start_date
        ? `${formData.start_date}T00:00:00`
        : null;

      const endDateTime = formData.end_date && formData.end_time
        ? `${formData.end_date}T${formData.end_time}:00`
        : formData.end_date
        ? `${formData.end_date}T23:59:59`
        : null;

      if (!startDateTime) {
        throw new Error('Start date is required');
      }

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          start_date: startDateTime,
          end_date: endDateTime || null,
          link: formData.link || null,
          image_url: formData.image_url || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setError('');

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'events'); // Store in events folder

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData(prev => ({ ...prev, image_url: data.url }));
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading event...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Events
        </Link>
        <h1 className="text-4xl font-light text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">Update event details</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
              Type *
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
            >
              <option value="event">Event</option>
              <option value="popup">Pop-Up Shop</option>
              <option value="market">Market / Fair</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
            />
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-semibold text-gray-900 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="start_time" className="block text-sm font-semibold text-gray-900 mb-2">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="end_date" className="block text-sm font-semibold text-gray-900 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-semibold text-gray-900 mb-2">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
            />
          </div>

          {/* Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-semibold text-gray-900 mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-gray-900"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Event Image (Optional)
            </label>
            {formData.image_url ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                  <Image
                    src={formData.image_url}
                    alt="Event preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Remove Image
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isUploadingImage
                    ? 'border-[color:var(--logo-pink)] bg-pink-50'
                    : 'border-gray-300 hover:border-[color:var(--logo-pink)] hover:bg-pink-50/50 cursor-pointer'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {isUploadingImage ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 border-4 border-[color:var(--logo-pink)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600">Uploading image...</p>
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
                      <span className="text-[color:var(--logo-pink)] font-semibold">Click to upload</span>
                      <span className="text-gray-600"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Or enter an image URL below if you prefer
            </p>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] text-sm text-gray-900"
              placeholder="/events/image.jpg or https://example.com/image.jpg"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 text-[color:var(--logo-pink)] border-gray-300 rounded focus:ring-[color:var(--logo-pink)]"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-900">
              Feature this event on the homepage
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/events"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}





