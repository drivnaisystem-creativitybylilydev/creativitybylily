'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'earrings',
    description: '',
    price: '',
    compare_at_price: '',
    image_url: '',
    images: [] as string[],
    inventory_count: '0',
    is_active: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-*|-*$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (formData.images.length === 0 && !formData.image_url.trim()) {
      newErrors.image_url = 'At least one product image is required';
    }
    if (!['earrings', 'necklaces', 'bracelets'].includes(formData.category)) {
      newErrors.category = 'Valid category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          compare_at_price: formData.compare_at_price ? Number(formData.compare_at_price) : null,
          inventory_count: Number(formData.inventory_count),
          images: formData.images.length > 0 ? formData.images : [formData.image_url],
          image_url: formData.images[0] || formData.image_url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-sm text-gray-600 hover:text-[color:var(--logo-pink)] mb-4 inline-block"
        >
          ← Back to Products
        </Link>
        <h1 className="text-4xl font-light text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Cape Cod Bracelet 14k Gold"
                />
                {errors.title && <p className="text-red-600 text-sm mt-1 font-medium">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-semibold text-gray-900 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 bg-gray-50 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="cape-cod-bracelet-14k-gold"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated from title. Used in product URL.</p>
                {errors.slug && <p className="text-red-600 text-sm mt-1 font-medium">{errors.slug}</p>}
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                </select>
                {errors.category && <p className="text-red-600 text-sm mt-1 font-medium">{errors.category}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="A beautifully handcrafted piece from the Cape Cod collection, made with love on Cape Cod."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1 font-medium">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="29.99"
                />
                {errors.price && <p className="text-red-600 text-sm mt-1 font-medium">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="compare_at_price" className="block text-sm font-semibold text-gray-900 mb-2">
                  Compare at Price ($)
                </label>
                <input
                  type="number"
                  id="compare_at_price"
                  name="compare_at_price"
                  value={formData.compare_at_price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                  placeholder="39.99"
                />
                <p className="text-xs text-gray-500 mt-1">Original price (for sale display)</p>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="inventory_count" className="block text-sm font-semibold text-gray-900 mb-2">
                Inventory Count
              </label>
              <input
                type="number"
                id="inventory_count"
                name="inventory_count"
                value={formData.inventory_count}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Images</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload product images. The first image will be used as the main product image.
            </p>
            <ImageUpload
              images={formData.images}
              onImagesChange={(images) => {
                setFormData(prev => ({
                  ...prev,
                  images,
                  image_url: images[0] || '', // Set first image as primary
                }));
              }}
              maxImages={10}
            />
            {errors.image_url && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.image_url}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-5 h-5 text-[color:var(--logo-pink)] border-gray-300 rounded focus:ring-[color:var(--logo-pink)]"
              />
              <span className="text-sm font-semibold text-gray-900">Product is active (visible on website)</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[color:var(--logo-pink)] text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              href="/admin/products"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

