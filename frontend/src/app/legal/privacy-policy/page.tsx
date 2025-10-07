export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
            <section className="max-w-4xl mx-auto px-6 py-16">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4"> Privacy Policy </h1>
                    <p className="text-sm text-gray-400">Effective Date: October 7, 2025</p>
                </header>
                <article className="space-y-10 text-white/90 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">1. Information We Collect</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Account Information:</strong> Email, password, and related details when you register.</li>
                            <li><strong>User Content:</strong> Job descriptions, personal details, and other text you provide.</li>
                            <li><strong>Generated Content:</strong> Cover letters created by our AI models.</li>
                            <li><strong>Usage Data:</strong> Log data, device information, and analytics.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">2. How We Use Your Information</h2>
                        <p>
                            To generate customized cover letters using large language models (LLMs), store them securely in our database, improve our services, and comply with legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">3. Data Sharing</h2>
                        <p>
                            We do not sell your personal data. We may share it with trusted third-party services for hosting, analytics, and legal compliance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your data, including encryption, access controls, and regular audits.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">5. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information. Contact us at <a href="mailto:support@example.com" className="text-blue-400 underline">support@example.com</a> to make a request.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-2">6. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. Continued use of our services after changes indicates your acceptance of the revised policy.
                        </p>
                    </section>
                </article>
            </section>
        </main>

    );
}