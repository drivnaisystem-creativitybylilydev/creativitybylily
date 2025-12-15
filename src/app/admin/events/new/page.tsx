'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Combine date and time for start_date
      const startDateTime = formData.start_date && formData.start_time
        ? `${formData.start_date}T${formData.start_time}:00`
        : formData.start_date
        ? `${formData.start_date}T00:00:00`
        : null;

      // Combine date and time for end_date (optional)
      const endDateTime = formData.end_date && formData.end_time
        ? `${formData.end_date}T${formData.end_time}:00`
        : formData.end_date
        ? `${formData.end_date}T23:59:59`
        : null;

      if (!startDateTime) {
        throw new Error('Start date is required');
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
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
        throw new Error(data.error || 'Failed to create event');
      }

      router.push('/admin/events');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      errors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      errors.description = 'Description must be 1000 characters or less';
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    } else {
      const startDate = new Date(`${formData.start_date}T${formData.start_time || '00:00'}:00`);
      if (startDate < new Date()) {
        errors.start_date = 'Start date cannot be in the past';
      }
    }

    if (formData.end_date) {
      const startDate = new Date(`${formData.start_date}T${formData.start_time || '00:00'}:00`);
      const endDate = new Date(`${formData.end_date}T${formData.end_time || '23:59'}:00`);
      if (endDate < startDate) {
        errors.end_date = 'End date must be after start date';
      }
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (formData.link && !/^https?:\/\/.+/.test(formData.link)) {
      errors.link = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Events
        </Link>
        <h1 className="text-4xl font-light text-gray-900 mb-2">Add New Event</h1>
        <p className="text-gray-600">Create a new event, pop-up shop, or market</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Event Details</h2>
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900 ${
                    fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Summer Market 2024"
                  maxLength={100}
                />
                {fieldErrors.title && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-900 mb-2">
                  Event Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] bg-white text-gray-900"
                >
                  <option value="event">Event</option>
                  <option value="popup">Pop-Up Shop</option>
                  <option value="market">Market / Fair</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose the category that best fits your event
                </p>
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
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors resize-none text-gray-900 ${
                    fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell visitors about your event... What makes it special? What can they expect?"
                  maxLength={1000}
                />
                {fieldErrors.description && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters (minimum 20)
                </p>
              </div>

              {/* Start Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Start Date & Time *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_date" className="block text-xs text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      name="start_date"
                      required
                      value={formData.start_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900 ${
                        fieldErrors.start_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.start_date && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.start_date}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="start_time" className="block text-xs text-gray-600 mb-1">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      id="start_time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave blank for all-day events</p>
                  </div>
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  End Date & Time (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="end_date" className="block text-xs text-gray-600 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      min={formData.start_date || new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900 ${
                        fieldErrors.end_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {fieldErrors.end_date && (
                      <p className="text-red-600 text-xs mt-1">{fieldErrors.end_date}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="end_time" className="block text-xs text-gray-600 mb-1">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      id="end_time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave blank for single-day events
                </p>
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
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900 ${
                    fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Cape Cod Market, Hyannis, MA"
                />
                {fieldErrors.location && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.location}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Include venue name, city, and state for best results
                </p>
              </div>

              {/* Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-semibold text-gray-900 mb-2">
                  External Link (Optional)
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-colors text-gray-900 ${
                    fieldErrors.link ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://instagram.com/event or https://maps.google.com/..."
                />
                {fieldErrors.link && (
                  <p className="text-red-600 text-sm mt-1">{fieldErrors.link}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Link to Instagram post, Google Maps, event page, etc.
                </p>
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
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-[color:var(--logo-pink)] border-gray-300 rounded focus:ring-[color:var(--logo-pink)] mt-0.5"
                  />
                  <div className="flex-1">
                    <label htmlFor="is_featured" className="text-sm font-semibold text-gray-900 cursor-pointer">
                      Feature this event on the homepage
                    </label>
                    <p className="text-xs text-gray-600 mt-1">
                      Featured events appear prominently in the "Upcoming Events" section on your homepage
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
            <Link
              href="/admin/events"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-[#faf8f5] rounded-lg p-4 border border-gray-200">
              {formData.title || formData.description || formData.image_url ? (
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  {formData.image_url && (
                    <div className="relative aspect-video w-full bg-gray-100">
                      <Image
                        src={formData.image_url}
                        alt={formData.title || 'Event preview'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-[color:var(--logo-pink)]/10 text-[color:var(--logo-pink)] rounded-full capitalize">
                        {formData.type || 'event'}
                      </span>
                      {formData.is_featured && (
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {formData.title || 'Event Title'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {formData.description || 'Event description will appear here...'}
                    </p>
                    {formData.start_date && (
                      <div className="text-xs text-gray-600 mb-1">
                        📅 {new Date(`${formData.start_date}T${formData.start_time || '00:00'}:00`).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                    {formData.location && (
                      <div className="text-xs text-gray-600">
                        📍 {formData.location}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Preview will appear as you fill out the form
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}





