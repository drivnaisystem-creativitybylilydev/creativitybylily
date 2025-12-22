'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestEmailsPage() {
  const [selectedEmail, setSelectedEmail] = useState('order');

  const emailTypes = [
    { value: 'order', label: 'Order Confirmation', description: 'Sent when customer places an order' },
    { value: 'shipping', label: 'Shipping Confirmation', description: 'Sent when order ships' },
    { value: 'return-request', label: 'Return Request Received', description: 'Sent when customer submits return' },
    { value: 'return-approved', label: 'Return Approved', description: 'Sent when admin approves return' },
    { value: 'refund', label: 'Refund Processed', description: 'Sent when refund is processed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Template Preview</h1>
          <p className="text-gray-600">
            Preview all email templates. Click on an email type to view it in a new tab.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Email Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTypes.map((email) => (
              <a
                key={email.value}
                href={`/api/test/emails?type=${email.value}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{email.label}</h3>
                <p className="text-sm text-gray-600">{email.description}</p>
                <span className="text-xs text-pink-600 mt-2 inline-block">
                  Click to preview →
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">📧 Testing Real Emails</h3>
          <p className="text-sm text-yellow-800 mb-2">
            To test sending actual emails (not just preview):
          </p>
          <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1 ml-4">
            <li>Make sure <code className="bg-yellow-100 px-1 rounded">RESEND_API_KEY</code> is in <code className="bg-yellow-100 px-1 rounded">.env.local</code></li>
            <li>Set <code className="bg-yellow-100 px-1 rounded">RESEND_FROM_EMAIL</code> to your email address</li>
            <li>Restart your dev server</li>
            <li>
              <strong>Test Return Emails:</strong> Submit a return request at{' '}
              <Link href="/returns/start" className="text-pink-600 underline">
                /returns/start
              </Link>
            </li>
            <li>
              <strong>Test Order Email:</strong> Currently disabled. Enable it in{' '}
              <code className="bg-yellow-100 px-1 rounded">src/app/api/orders/create/route.ts</code>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}



