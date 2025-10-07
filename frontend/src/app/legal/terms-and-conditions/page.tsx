"use client";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-400">Effective Date: October 7, 2025</p>
        </header>

        <article className="space-y-10 text-white/90 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">1. Introduction</h2>
            <p>
              These Terms & Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">2. Services Provided</h2>
            <p>
              We offer an AI-powered platform that generates personalized cover letters based on job descriptions and user input. The generated content is intended for personal use and should be reviewed before submission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate information and to use the generated content responsibly. You are solely responsible for the final content submitted to employers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">4. Intellectual Property</h2>
            <p>
              All content, trademarks, and intellectual property on this site are owned by us or our licensors. You may not reproduce, distribute, or create derivative works without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">5. Privacy</h2>
            <p>
              Your privacy is important to us. Please refer to our <a href="/legal/privacy-policy" className="text-blue-400 underline">Privacy Policy</a> for details on how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">6. Limitation of Liability</h2>
            <p>
              We are not liable for any damages arising from the use of our services, including but not limited to errors in generated content or missed job opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the platform at our discretion, especially in cases of misuse or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">8. Changes to Terms</h2>
            <p>
              We may update these Terms & Conditions from time to time. Continued use of the platform after changes indicates your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:support@example.com" className="text-blue-400 underline">support@example.com</a>.
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
