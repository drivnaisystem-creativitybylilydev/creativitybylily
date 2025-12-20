import Link from 'next/link';
import StartReturnButton from '@/components/StartReturnButton';

export const metadata = {
  title: 'Returns & Exchanges',
  description: 'Returns and exchanges policy for creativity by lily',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-5xl font-light text-gray-900 mb-2">Returns & Exchanges</h1>
            <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <StartReturnButton />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 prose prose-lg max-w-none">
          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Return Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We want you to love your purchase from creativity by lily. If you're not completely satisfied, we're here to help.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-900 font-semibold mb-2">✨ Unlimited Returns</p>
              <p className="text-green-800">
                We offer <strong>unlimited returns</strong> with no time restrictions. You can return your jewelry at any time, even if you've worn it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Return Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We want you to love your jewelry! Our return policy is simple and flexible:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>No time limit:</strong> Return your items at any time</li>
              <li><strong>Worn items accepted:</strong> You can return jewelry even if you've worn it</li>
              <li><strong>Original packaging preferred:</strong> While not required, original packaging helps protect items during return shipping</li>
              <li><strong>Proof of purchase:</strong> Please have your order number ready</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Note:</strong> All returns are subject to admin approval to ensure quality and authenticity.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">How to Initiate a Return</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 1: Start Your Return</h3>
                <p className="text-gray-700 leading-relaxed">
                  Click the "Start Return" button above to begin the return process. You'll need to log in to your account (or create one if you checked out as a guest).
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 2: Select Your Order</h3>
                <p className="text-gray-700 leading-relaxed">
                  Choose the order you'd like to return items from. You can return items from any past order.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 3: Select Items & Submit</h3>
                <p className="text-gray-700 leading-relaxed">
                  Select which items you'd like to return and provide a reason (optional). Submit your return request for admin approval.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 4: Ship Your Return</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once approved, you'll receive return shipping instructions. Package your items securely and ship them back using a trackable method. You are responsible for return shipping costs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Step 5: Receive Your Refund</h3>
                <p className="text-gray-700 leading-relaxed">
                  Once we receive and inspect your return, we'll process your refund within 5-7 business days. Refunds will be issued to the original payment method.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Exchanges</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We currently offer exchanges for different sizes or styles, subject to availability. To request an exchange:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Follow the return process above</li>
              <li>Specify in your email that you'd like to exchange the item</li>
              <li>Include the item and size you'd like to exchange for</li>
              <li>If the exchange item is available, we'll process it once we receive your return</li>
            </ol>
            <p className="text-gray-700 leading-relaxed mt-4">
              If the exchange item is not available, we'll issue a refund instead.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Refund Processing</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the purchase.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Processing Time:</strong> Once we receive your return, please allow 5-7 business days for us to process your refund. It may take additional time for the refund to appear in your account, depending on your bank or credit card company.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Shipping Costs:</strong> Original shipping costs are non-refundable. Return shipping costs are the responsibility of the customer.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you receive a damaged or defective item, please contact us immediately at <a href="mailto:info@creativitybylily.com" className="text-[color:var(--logo-pink)] hover:underline">info@creativitybylily.com</a> with:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Your order number</li>
              <li>Photos of the damage or defect</li>
              <li>A description of the issue</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We'll arrange for a replacement or full refund, including return shipping costs, at no charge to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">International Returns</h2>
            <p className="text-gray-700 leading-relaxed">
              International customers are responsible for return shipping costs and any customs fees. We recommend using a trackable shipping method and declaring the package as a return to avoid additional customs charges.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our return policy, please don't hesitate to contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>creativity by lily</strong><br />
                Email: <a href="mailto:info@creativitybylily.com" className="text-[color:var(--logo-pink)] hover:underline">info@creativitybylily.com</a><br />
                Website: creativitybylily.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


