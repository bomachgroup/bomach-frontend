import PageTitle from "@/components/PageTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description: "Privacy Policy - Bomach Group of Company. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageTitle
        title="Privacy Policy"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">

          {/* 1. Introduction */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">1. Introduction</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Bomach Group of Company (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and ensuring you have a positive experience on our website and when using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong className="text-secondary-950">bomachgroup.com</strong> (the &quot;Site&quot;) and engage with our services.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Site or services. If you have any questions about this Privacy Policy, please contact us at <strong className="text-secondary-950">bomachgroupmanagement@gmail.com</strong>.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">2. Information We Collect</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">We collect information in several ways:</p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">2.1 Information You Provide Directly</h4>
            <p className="text-secondary-600 leading-relaxed mb-4">When you interact with our Site and services, you may provide us with:</p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Contact Forms:</strong> Name, email address, phone number, location, and messages when you submit contact inquiries</li>
              <li><strong className="text-secondary-950">Service Quotes:</strong> Personal details and service preferences when requesting quotes</li>
              <li><strong className="text-secondary-950">Booking System:</strong> Name, email, phone, preferred meeting time, and service details for appointment scheduling</li>
              <li><strong className="text-secondary-950">Job Applications:</strong> Full name, email, phone number, resume, cover letter, and additional information when applying for positions</li>
              <li><strong className="text-secondary-950">Property Inquiries:</strong> Contact information and property preferences when inquiring about real estate listings</li>
              <li><strong className="text-secondary-950">Newsletter Subscription:</strong> Email address when subscribing to our newsletter</li>
              <li><strong className="text-secondary-950">Payment Information:</strong> Billing address, payment method details (processed securely through third-party providers)</li>
            </ul>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">2.2 Information Collected Automatically</h4>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Cookies and Similar Technologies:</strong> We use cookies to enhance your browsing experience, remember preferences, and analyze Site usage</li>
              <li><strong className="text-secondary-950">Server Logs:</strong> IP address, browser type, operating system, pages visited, and time/date of access</li>
              <li><strong className="text-secondary-950">Analytics Data:</strong> Google Analytics and similar tools help us understand how you use our Site</li>
              <li><strong className="text-secondary-950">Device Information:</strong> Device type, model, operating system, and unique device identifiers</li>
            </ul>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">2.3 Third-Party Sources</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We may receive information from business partners, marketing partners, and publicly available sources to enhance our records and improve our services.
            </p>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">3. How We Use Your Information</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">We use the information we collect for various purposes:</p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Service Delivery:</strong> Processing quotes, bookings, job applications, and providing requested services</li>
              <li><strong className="text-secondary-950">Communication:</strong> Responding to inquiries, sending confirmation emails, and providing customer support</li>
              <li><strong className="text-secondary-950">Marketing:</strong> Sending newsletters, promotional materials, and updates about our services (with your consent)</li>
              <li><strong className="text-secondary-950">Account Management:</strong> Managing your account, processing payments, and maintaining records</li>
              <li><strong className="text-secondary-950">Compliance:</strong> Meeting legal, regulatory, and contractual obligations</li>
              <li><strong className="text-secondary-950">Analytics and Improvement:</strong> Analyzing Site usage patterns, improving user experience, and optimizing our services</li>
              <li><strong className="text-secondary-950">Security:</strong> Protecting against fraud, unauthorized access, and other illegal activities</li>
              <li><strong className="text-secondary-950">Business Operations:</strong> Managing our business, internal operations, and business relationships</li>
              <li><strong className="text-secondary-950">Recruitment:</strong> Evaluating job applications and contacting candidates</li>
            </ul>
          </div>

          {/* 4. Data Sharing and Disclosure */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">We do not sell your personal information. However, we may share your information in the following circumstances:</p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.1 Service Providers</h4>
            <p className="text-secondary-600 leading-relaxed mb-4">
              We share information with third-party service providers who assist us in operating our Site and conducting our business, including:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>Email service providers (for sending communications)</li>
              <li>Payment processors (for handling transactions)</li>
              <li>Cloud hosting providers (Cloudinary for media storage)</li>
              <li>SMS service providers (SendChamp for communications)</li>
              <li>Analytics providers (Google Analytics)</li>
              <li>Security services (Google reCAPTCHA)</li>
            </ul>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.2 Legal Requirements</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We may disclose your information when required by law, to comply with legal processes, or to protect our rights and the rights of others.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.3 Business Transfers</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If Bomach Group is involved in a merger, acquisition, bankruptcy, dissolution, reorganization, or similar transaction or proceeding, your information may be transferred as part of that transaction.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.4 Aggregated and De-Identified Data</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We may share aggregated or de-identified information that cannot reasonably be used to identify you with third parties for marketing, analytics, and research purposes.
            </p>
          </div>

          {/* 5. Data Security */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">5. Data Security</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              We implement appropriate administrative, technical, and physical security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>Secure encryption protocols (SSL/TLS) for data transmission</li>
              <li>Restricted access to personal data (staff access on need-to-know basis)</li>
              <li>Regular security assessments and updates</li>
              <li>Secure file storage and backup procedures</li>
              <li>CSRF protection and secure form handling</li>
              <li>Google reCAPTCHA protection against automated abuse</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mb-6">
              However, please note that no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
            </p>
          </div>

          {/* 6. Your Rights and Choices */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">6. Your Rights and Choices</h2>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">6.1 Access and Correction</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You have the right to access the personal information we hold about you and request corrections to any inaccurate data. Contact us at <strong className="text-secondary-950">bomachgroupmanagement@gmail.com</strong> to make such requests.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">6.2 Opt-Out of Communications</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You may unsubscribe from our newsletter and marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly. Note that we will still send you transactional and service-related messages.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">6.3 Cookie Management</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You can control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect the functionality of our Site.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">6.4 Data Deletion</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You may request deletion of your personal information, subject to certain legal and operational requirements. We may retain information as necessary to fulfill our obligations, comply with the law, or resolve disputes.
            </p>
          </div>

          {/* 7. Data Retention */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">7. Data Retention</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Retention periods vary depending on the type of information and the purpose for which we use it:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Contact Inquiries:</strong> Retained for 2 years unless you request deletion</li>
              <li><strong className="text-secondary-950">Job Applications:</strong> Retained for 12 months unless you request deletion</li>
              <li><strong className="text-secondary-950">Booking Records:</strong> Retained for service and support purposes for 3 years</li>
              <li><strong className="text-secondary-950">Newsletter Subscribers:</strong> Retained until unsubscription</li>
              <li><strong className="text-secondary-950">Transaction Records:</strong> Retained for 7 years for legal and tax purposes</li>
            </ul>
          </div>

          {/* 8. Third-Party Links */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">8. Third-Party Links and Services</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Our Site may contain links to third-party websites and services that are not operated by Bomach Group. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites before providing your personal information.
            </p>
          </div>

          {/* 9. International Data Transfer */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">9. International Data Transfer</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Our Site is operated in Nigeria. If you are accessing our Site from outside Nigeria, please be aware that your information may be transferred to, stored in, and processed in Nigeria and other countries where our service providers are located. By using our Site, you consent to such transfers.
            </p>
          </div>

          {/* 10. Children's Privacy */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Our Site and services are not directed to children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information and terminate the child&apos;s account immediately. If you believe we have collected information from a child under 18, please contact us immediately.
            </p>
          </div>

          {/* 11. California Privacy Rights */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">11. California Privacy Rights</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Right to Know:</strong> You have the right to know what personal information is collected, used, shared, or sold</li>
              <li><strong className="text-secondary-950">Right to Delete:</strong> You have the right to request deletion of personal information collected from you</li>
              <li><strong className="text-secondary-950">Right to Opt-Out:</strong> You have the right to opt-out of the sale or sharing of your personal information</li>
              <li><strong className="text-secondary-950">Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights</li>
            </ul>
          </div>

          {/* 12. Updates */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">12. Updates to This Privacy Policy</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated Privacy Policy on our Site and updating the &quot;Last Updated&quot; date. Your continued use of our Site following the posting of revised Privacy Policy means that you accept and agree to the changes.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">13. Contact Us</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If you have questions about this Privacy Policy, our privacy practices, or your personal information, please contact us at:
            </p>
            <div className="glass-card p-6">
              <p className="font-display font-bold text-secondary-950 mb-3">Bomach Group of Company</p>
              <p className="text-secondary-600 mb-3">
                <strong className="text-secondary-950">Address:</strong><br />
                3a Isiuzo Street<br />
                Independence Layout<br />
                Enugu State<br />
                Nigeria
              </p>
              <p className="text-secondary-600 mb-3">
                <strong className="text-secondary-950">Email:</strong><br />
                <a href="mailto:bomachgroupmanagement@gmail.com" className="text-primary-600 hover:text-primary-700 transition-colors">bomachgroupmanagement@gmail.com</a>
              </p>
              <p className="text-secondary-600">
                <strong className="text-secondary-950">Phone:</strong><br />
                <a href="tel:09018000118" className="text-primary-600 hover:text-primary-700 transition-colors">090 1800 0118</a> | <a href="tel:08036656173" className="text-primary-600 hover:text-primary-700 transition-colors">080 3665 6173</a>
              </p>
            </div>
          </div>

          <div>
            <p className="text-secondary-500 italic">
              <strong>Last Updated:</strong> November 19, 2025
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
