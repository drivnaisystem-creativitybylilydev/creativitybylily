'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

type ShippingFormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  sameAsShipping: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Square payment state
  const [squarePayment, setSquarePayment] = useState<any>(null);
  const [cardElementLoaded, setCardElementLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const cardElementRef = useRef<HTMLDivElement>(null);
  const squareApplicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  
  const [formData, setFormData] = useState<ShippingFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
    sameAsShipping: true,
  });

  const subtotal = getTotalPrice();
  const FREE_SHIPPING_THRESHOLD = 35;
  const DEFAULT_SHIPPING_COST = 6.99; // Default flat rate shown before calculation
  
  // Calculate shipping: free if subtotal >= $35, otherwise use calculated rate or default
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD 
    ? 0 
    : (shippingCost ?? DEFAULT_SHIPPING_COST);
  
  const tax = subtotal * 0.0625; // 6.25% tax (adjust as needed)
  const total = subtotal + shipping + tax;

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    checkUser();
  }, []);

  // Load Square Web Payments SDK
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!squareApplicationId) {
      console.error('Square Application ID not found. Check NEXT_PUBLIC_SQUARE_APPLICATION_ID in .env.local');
      setPaymentError('Payment system not configured. Please contact support.');
      return;
    }

    // Add CSS to control Square iframe height and remove extra spacing
    if (!document.getElementById('square-form-styles')) {
      const style = document.createElement('style');
      style.id = 'square-form-styles';
      style.textContent = `
        #sq-card-container {
          padding-bottom: 0 !important;
        }
        #sq-card-container iframe {
          height: 56px !important;
          min-height: 56px !important;
          max-height: 56px !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Check if Square script is already loaded
    if ((window as any).Square) {
      initializeSquare();
      return;
    }

    // Load Square Web Payments SDK script (use sandbox for testing, production for live)
    const script = document.createElement('script');
    const isSandbox = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox';
    script.src = isSandbox 
      ? 'https://sandbox.web.squarecdn.com/v1/square.js'
      : 'https://web.squarecdn.com/v1/square.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      console.log('Square script loaded, initializing...');
      initializeSquare();
    };
    script.onerror = (error) => {
      console.error('Failed to load Square script:', error);
      setPaymentError('Failed to load payment system. Please check your internet connection and refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup - style will persist for the session
    };
  }, [squareApplicationId]);

  const initializeSquare = async () => {
    if (!squareApplicationId || !cardElementRef.current) return;
    
    try {
      const Square = (window as any).Square;
      if (!Square || !Square.payments) {
        throw new Error('Square SDK not loaded');
      }
      
      const environment = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production';
      const payments = Square.payments(squareApplicationId, environment);
      
      // Create card payment method - check if it returns a promise
      let card;
      try {
        card = await payments.card();
      } catch (err) {
        // If card() doesn't return a promise, try calling it directly
        card = payments.card();
      }
      
      // Try mount first, then attach as fallback
      if (card && typeof card.mount === 'function') {
        await card.mount(cardElementRef.current);
      } else if (card && typeof card.attach === 'function') {
        await card.attach(cardElementRef.current);
      } else {
        throw new Error('Card element does not have mount or attach method');
      }
      
      setCardElementLoaded(true);
      setSquarePayment(card);
      console.log('Square card element mounted successfully');
    } catch (error: any) {
      console.error('Error initializing Square:', error);
      console.error('Square object:', (window as any).Square);
      setPaymentError(`Failed to initialize payment system: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Google Places Autocomplete for address field (if API key is configured)
  useEffect(() => {
    if (!googleMapsApiKey) return;
    if (typeof window === 'undefined') return;

    const initAutocomplete = () => {
      if (!addressInputRef.current) return;
      const anyWindow = window as any;
      const google = anyWindow.google;
      if (!google || !google.maps || !google.maps.places) return;

      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place || !place.address_components) return;

        const components = place.address_components;
        const getComponent = (type: string) => {
          const comp = components.find((c: any) => c.types.includes(type));
          return comp ? comp.long_name || comp.short_name : '';
        };

        const streetNumber = getComponent('street_number');
        const route = getComponent('route');
        const city =
          getComponent('locality') ||
          getComponent('sublocality') ||
          getComponent('postal_town');
        const state = getComponent('administrative_area_level_1');
        const zip = getComponent('postal_code');
        const country = getComponent('country');

        setFormData(prev => ({
          ...prev,
          address: [streetNumber, route].filter(Boolean).join(' ') || prev.address,
          city: city || prev.city,
          state: state || prev.state,
          zip: zip || prev.zip,
          country: country || prev.country,
        }));

        // Clear address-related errors if we got a structured place
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.address;
          delete newErrors.city;
          delete newErrors.state;
          delete newErrors.zip;
          return newErrors;
        });
      });
    };

    // If script already exists, just init autocomplete
    if (document.getElementById('google-maps-places-script')) {
      initAutocomplete();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-places-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);

    return () => {
      // Keep script loaded for page lifetime
    };
  }, [googleMapsApiKey]);

  // Calculate shipping when address fields change (debounced)
  useEffect(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      // Clear shipping cost if order qualifies for free shipping
      setShippingCost(0);
      setShippingError(null);
      return;
    }

    // Only calculate if we have minimum required address fields
    if (!formData.address || !formData.city || !formData.state || !formData.zip) {
      setShippingCost(null);
      return;
    }

    // Debounce shipping calculation
    const timeoutId = setTimeout(() => {
      calculateShipping();
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.address, formData.city, formData.state, formData.zip, subtotal]);

  const calculateShipping = async () => {
    // Skip if order qualifies for free shipping
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      setShippingCost(0);
      return;
    }

    // Check if we have minimum required address fields
    if (!formData.address || !formData.city || !formData.state || !formData.zip) {
      return;
    }

    setIsCalculatingShipping(true);
    setShippingError(null);

    try {
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: formData,
          items: items.map(item => ({
            quantity: item.quantity,
            productId: item.product.id,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate shipping');
      }

      setShippingCost(data.shippingCost);
    } catch (error: any) {
      console.error('Error calculating shipping:', error);
      setShippingError(error.message || 'Unable to calculate shipping. Please try again.');
      // Set a default shipping cost as fallback
      setShippingCost(6.99);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) newErrors.zip = 'Invalid ZIP code';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // If Shippo reported a shipping/address error, prevent checkout until it's fixed
    if (shippingError) {
      alert(
        `Please double-check your shipping address so we can generate a shipping label:\n\n${shippingError}`
      );
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty!');
      router.push('/products');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Step 1: Process payment with Square
      if (!squarePayment) {
        throw new Error('Payment form not loaded. Please refresh the page and try again.');
      }

      // Tokenize the card
      const tokenResult = await squarePayment.tokenize();
      if (tokenResult.status !== 'OK') {
        throw new Error(tokenResult.errors?.[0]?.detail || 'Failed to process payment information');
      }

      // Generate idempotency key (prevents duplicate charges)
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Create payment
      const paymentResponse = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: tokenResult.token,
          idempotencyKey,
          amount: total,
          currency: 'USD',
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Payment processing failed');
      }

      // Step 2: Create order in database (only after successful payment)
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId || null, // Include user ID if logged in
          items: items.map(item => ({
            productId: item.product.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shippingAddress: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          },
          billingAddress: formData.sameAsShipping ? {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          } : {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          },
          subtotal,
          tax,
          shippingCost: shipping,  // Calculated shipping or 0 for free shipping
          total,
          paymentId: paymentData.payment?.id, // Store Square payment ID
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an error. Please check the browser console and server logs for details.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle inventory errors specifically
        if (data.error === 'Insufficient inventory' && data.details) {
          const inventoryErrors = Array.isArray(data.details) 
            ? data.details.join('\n')
            : data.details;
          alert(
            `${data.message || 'Some items are no longer available:'}\n\n${inventoryErrors}\n\nPlease update your cart and try again.`
          );
          // Refresh the page to update cart with current inventory
          window.location.reload();
          return;
        }
        
        const errorMsg = data.error || 'Failed to create order';
        const details = data.details ? ` (${data.details})` : '';
        throw new Error(errorMsg + details);
      }

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      router.push(`/checkout/confirmation?order=${data.orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl font-light text-gray-800 mb-8">Checkout</h1>
          <div className="bg-white rounded-2xl shadow-sm p-12">
            <p className="text-gray-600 mb-8">Your cart is empty!</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-serif text-5xl font-light text-gray-900 mb-12">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="font-serif text-3xl font-light text-gray-900 mb-8">Shipping Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1 font-medium">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1 font-medium">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    ref={addressInputRef}
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Street address"
                  />
                  {errors.address && <p className="text-red-600 text-sm mt-1 font-medium">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="address2" className="block text-sm font-semibold text-gray-900 mb-2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    id="address2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all"
                    placeholder="Apt, suite, unit, etc."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1 font-medium">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-900 mb-2">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </select>
                    {errors.state && <p className="text-red-600 text-sm mt-1 font-medium">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zip" className="block text-sm font-semibold text-gray-900 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.zip ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="12345"
                    />
                    {errors.zip && <p className="text-red-600 text-sm mt-1 font-medium">{errors.zip}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--logo-pink)] focus:border-[color:var(--logo-pink)] transition-all ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
                <h2 className="font-serif text-3xl font-light text-gray-900 mb-6">Payment Information</h2>
                
                {paymentError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{paymentError}</p>
                  </div>
                )}

                {!cardElementLoaded && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">Loading secure payment form...</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Card Details *
                  </label>
                  <div 
                    id="sq-card-container" 
                    ref={cardElementRef} 
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[color:var(--logo-pink)] focus-within:border-[color:var(--logo-pink)] transition-all"
                    style={{ overflow: 'hidden' }}
                  ></div>
                </div>
                
                <div className="flex items-start gap-2 mt-4">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Your payment information is secure and encrypted. We never see your full card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-light text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variantId || 'default'}`} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate mb-1">{item.product.title}</p>
                      <p className="text-xs text-gray-600 mb-2">Qty: {item.quantity}</p>
                      <p className="text-base font-bold text-[color:var(--logo-pink)]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-6 space-y-4 mb-6">
                <div className="flex justify-between text-gray-900">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span className="font-medium">Shipping</span>
                  <span className="font-semibold">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-green-600">Free</span>
                    ) : isCalculatingShipping ? (
                      <span className="text-gray-500 text-sm">Calculating...</span>
                    ) : shippingCost !== null ? (
                      <span>${shippingCost.toFixed(2)}</span>
                    ) : (
                      <span>${DEFAULT_SHIPPING_COST.toFixed(2)}</span>
                    )}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                  <div className="text-sm text-gray-600 mt-1 mb-2">
                    <span className="font-medium">💡 Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!</span>
                  </div>
                )}
                {shippingError && (
                  <div className="text-xs text-red-600 mt-1">
                    {shippingError}
                  </div>
                )}
                <div className="flex justify-between text-gray-900">
                  <span className="font-medium">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-4 flex justify-between">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-[color:var(--logo-pink)]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !cardElementLoaded}
                className="w-full bg-[color:var(--logo-pink)] text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing Payment...' : `Complete Order - $${total.toFixed(2)}`}
              </button>
              {!cardElementLoaded && (
              <p className="text-xs text-gray-500 text-center mt-2">
                  Please wait for the payment form to load...
              </p>
              )}

              <Link
                href="/cart"
                className="block w-full text-center mt-4 text-gray-600 hover:text-[color:var(--logo-pink)] transition-colors"
              >
                ← Back to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

