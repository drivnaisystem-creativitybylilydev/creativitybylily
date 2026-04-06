export const metadata = {
  title: 'Shipping Policy',
  description: 'Shipping and delivery policy for creativity by lily',
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-5xl font-light text-gray-900 mb-8">Shipping Policy</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 prose prose-lg max-w-none">
          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Shipping Methods & Rates</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer shipping within the United States. Shipping rates are calculated at checkout based on your location and the weight of your order.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Standard shipping typically takes 5-7 business days</li>
              <li>Express shipping options may be available at checkout</li>
              <li>Shipping costs are calculated automatically based on your shipping address</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Processing Time</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders are processed within 1-3 business days (excluding weekends and holidays) after payment is confirmed. You will receive an email confirmation once your order has been shipped.
            </p>
            <p className="text-gray-700 leading-relaxed">
              During peak seasons or sales events, processing times may be extended. We will notify you if there are any delays.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              Once your order ships, you will receive a tracking number via email. You can use this tracking number to monitor your package's progress. If you have any questions about your shipment, please contact us at <a href="mailto:creativitybylilyco@gmail.com" className="text-[color:var(--logo-pink)] hover:underline">creativitybylilyco@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Delivery times are estimates provided by the shipping carrier and are not guaranteed. We are not responsible for delays caused by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Weather conditions</li>
              <li>Carrier delays</li>
              <li>Incorrect shipping addresses</li>
              <li>Customs delays (for international orders)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">International Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Currently, we only ship within the United States. If you are located outside the U.S. and would like to place an order, please contact us at <a href="mailto:creativitybylilyco@gmail.com" className="text-[color:var(--logo-pink)] hover:underline">creativitybylilyco@gmail.com</a> to discuss shipping options.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Shipping Address</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Please ensure your shipping address is correct at checkout. We are not responsible for orders shipped to incorrect addresses provided by the customer. If you need to change your shipping address after placing an order, please contact us immediately.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Note:</strong> We cannot modify shipping addresses once an order has been processed and shipped.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Lost or Stolen Packages</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If your package is lost or stolen, please contact us at <a href="mailto:creativitybylilyco@gmail.com" className="text-[color:var(--logo-pink)] hover:underline">creativitybylilyco@gmail.com</a> with your order number. We will work with the shipping carrier to resolve the issue.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We recommend using a secure delivery location or requiring a signature for delivery if you are concerned about package security.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our shipping policy, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>creativity by lily</strong><br />
                Email: <a href="mailto:creativitybylilyco@gmail.com" className="text-[color:var(--logo-pink)] hover:underline">creativitybylilyco@gmail.com</a><br />
                Website: creativitybylily.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

