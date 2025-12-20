export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for creativity by lily',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-5xl font-light text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 prose prose-lg max-w-none">
          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using creativitybylily.com (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on creativity by lily's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the Website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">3. Products and Pricing</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Product Descriptions:</strong> We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content on this Website is accurate, complete, reliable, current, or error-free.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Pricing:</strong> All prices are in U.S. dollars and are subject to change without notice. We reserve the right to modify prices at any time. In the event a product is listed at an incorrect price, we reserve the right to refuse or cancel any orders placed for that product.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Availability:</strong> We reserve the right to limit the quantity of items purchased per person, per household, or per order. We also reserve the right to discontinue any product at any time.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">4. Orders and Payment</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Order Acceptance:</strong> Your receipt of an electronic or other form of order confirmation does not constitute our acceptance of your order. We reserve the right to accept or decline your order for any reason.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Payment:</strong> You agree to provide current, complete, and accurate purchase and account information for all purchases made on our Website. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Sales Tax:</strong> Sales tax will be calculated based on the shipping address provided at checkout.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              Shipping terms and delivery times are estimates only and are not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss and title for products purchased from us pass to you upon delivery of the products to the carrier.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Please review our Returns Policy, which is incorporated into these Terms by reference. Our Returns Policy can be found at <a href="/returns" className="text-[color:var(--logo-pink)] hover:underline">/returns</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">7. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you create an account on our Website, you are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">8. Prohibited Uses</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not use our Website:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
              <li>In any manner that could disable, overburden, damage, or impair the Website</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              The Website and its original content, features, and functionality are owned by creativity by lily and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              THE WEBSITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, AND HEREBY DISCLAIM AND NEGATE ALL OTHER WARRANTIES INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL PROPERTY.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              IN NO EVENT SHALL CREATIVITY BY LILY, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE WEBSITE.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">12. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless creativity by lily and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable attorney's fees, arising out of or in any way connected with your access to or use of the Website or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Massachusetts, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>creativity by lily</strong><br />
                Email: info@creativitybylily.com<br />
                Website: creativitybylily.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


