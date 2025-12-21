export const metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy for creativity by lily',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-serif text-5xl font-light text-gray-900 mb-8">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-12">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8 prose prose-lg max-w-none">
          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies on our website to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Keep you logged in to your account</li>
              <li>Remember items in your shopping cart</li>
              <li>Understand how you use our website to improve our services</li>
              <li>Provide you with a better browsing experience</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website. These third parties may include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Payment processors (Square) - to process your payments securely</li>
              <li>Analytics services - to understand website usage</li>
              <li>Social media platforms - if you interact with social media features</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">5. Managing Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              To manage cookies, you can:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Adjust your browser settings to refuse cookies</li>
              <li>Delete cookies that have already been set</li>
              <li>Use browser extensions or privacy tools to manage cookies</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Please note that blocking or deleting cookies may impact your experience on our website, and some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">6. Cookie Consent</h2>
            <p className="text-gray-700 leading-relaxed">
              By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or discontinue use of our website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-light text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about our use of cookies, please contact us:
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

