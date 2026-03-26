import PageTitle from "@/components/PageTitle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Bomach Group",
  description: "Terms of Service - Bomach Group of Company. Read our terms and conditions for using our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageTitle
        title="Terms of Service"
        bgImage="/images/about/bomach-engineering5.jpg"
        breadcrumbs={[{ label: "Terms of Service" }]}
      />

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">

          {/* 1. Acceptance of Terms */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">1. Acceptance of Terms</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              These Terms of Service (&quot;Terms,&quot; &quot;Terms of Service,&quot; or &quot;Agreement&quot;) constitute a legal agreement between you (the &quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and Bomach Group of Company (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing and using this website <strong className="text-secondary-950">bomachgroup.com</strong> (the &quot;Site&quot;) and our services, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions outlined in this Agreement.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If you do not agree with these Terms, you must immediately discontinue use of the Site and our services. We reserve the right to modify these Terms at any time, and such modifications will become effective immediately upon posting to the Site. Your continued use of the Site following any modifications constitutes your acceptance of the revised Terms.
            </p>
          </div>

          {/* 2. Use License */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">2. Use License</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access and use the Site for lawful purposes only. This license is subject to these Terms and does not permit you to:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>Modify or copy the content from the Site</li>
              <li>Use the Site for commercial purposes or to conduct business with us outside of our authorized services</li>
              <li>Attempt to gain unauthorized access to any portion or feature of the Site</li>
              <li>Use any automated systems (bots, scrapers, etc.) to access or monitor the Site</li>
              <li>Transmit any harmful, offensive, or illegal content</li>
              <li>Remove any copyright, trademark, or other proprietary notices</li>
              <li>Use the Site to compete with us or create derivative works</li>
              <li>Reverse engineer, decompile, or disassemble any portion of the Site</li>
            </ul>
          </div>

          {/* 3. Intellectual Property Rights */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">3. Intellectual Property Rights</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              All content on the Site, including text, graphics, images, logos, videos, audio, and code (the &quot;Content&quot;), is the exclusive property of Bomach Group of Company or our content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You may not reproduce, distribute, transmit, modify, create derivative works from, or otherwise exploit any Content without our prior written permission. Any unauthorized use of our Content is a violation of these Terms and may constitute copyright, trademark, or other intellectual property infringement.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              &quot;Bomach Group,&quot; &quot;Bomach Shelters,&quot; &quot;Alpha Logistics,&quot; and other related trademarks, logos, and service marks are the property of Bomach Group of Company. You may not use these marks without our prior written consent.
            </p>
          </div>

          {/* 4. User Content and Submissions */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">4. User Content and Submissions</h2>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.1 Responsibility for User Content</h4>
            <p className="text-secondary-600 leading-relaxed mb-4">
              If you submit, post, or display content on the Site (including but not limited to comments, reviews, messages, photos, or any other materials), you are solely responsible for that content. You represent and warrant that:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>You own or have the right to submit the content</li>
              <li>The content is accurate, complete, and not misleading</li>
              <li>The content does not infringe on any third-party rights</li>
              <li>The content does not violate any applicable laws or regulations</li>
              <li>The content is not obscene, defamatory, or otherwise harmful</li>
            </ul>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">4.2 License to Use Your Content</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              By submitting content to the Site, you grant Bomach Group of Company a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, translate, and distribute your content in connection with our business operations and marketing efforts.
            </p>
          </div>

          {/* 5. Services Description */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">5. Services Description</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              Bomach Group of Company provides diverse services across multiple sectors, including:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Real Estate Development:</strong> Property development, sales, and consultancy services</li>
              <li><strong className="text-secondary-950">Civil Engineering:</strong> Construction, infrastructure, and engineering services</li>
              <li><strong className="text-secondary-950">ICT &amp; Business Automation:</strong> Software development, IT solutions, and business automation</li>
              <li><strong className="text-secondary-950">Food Production &amp; Processing:</strong> Food production and processing services</li>
              <li><strong className="text-secondary-950">Land Services:</strong> Land surveying, documentation, and consultancy</li>
              <li><strong className="text-secondary-950">Logistics &amp; Courier Services:</strong> Goods delivery and logistics management</li>
              <li><strong className="text-secondary-950">Booking &amp; Consultation:</strong> Meeting scheduling and professional consultations</li>
              <li><strong className="text-secondary-950">Job Placement:</strong> Job listings and employment opportunities</li>
              <li><strong className="text-secondary-950">Newsletter &amp; Communications:</strong> Information updates and marketing materials</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Service descriptions provided on the Site are general in nature. We reserve the right to modify, suspend, or discontinue any service at any time without notice. Specific service terms and conditions may apply to individual services and will be provided upon engagement.
            </p>
          </div>

          {/* 6. Booking and Appointment Scheduling */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">6. Booking and Appointment Scheduling</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              By booking an appointment or consultation through our Site, you agree to the following:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li><strong className="text-secondary-950">Minimum Notice:</strong> You must schedule appointments at least 24 hours in advance</li>
              <li><strong className="text-secondary-950">Cancellation Policy:</strong> Cancellations must be made at least 24 hours before the scheduled appointment. Cancellations made less than 24 hours in advance may be subject to cancellation fees</li>
              <li><strong className="text-secondary-950">No-Show Policy:</strong> Failure to attend a scheduled appointment without prior cancellation may result in fees or suspension of booking privileges</li>
              <li><strong className="text-secondary-950">Accurate Information:</strong> You agree to provide accurate and complete information when booking</li>
              <li><strong className="text-secondary-950">Confirmation:</strong> A confirmation email will be sent to the email address provided. It is your responsibility to verify the appointment details</li>
            </ul>
          </div>

          {/* 7. Job Applications */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">7. Job Applications</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              If you apply for a position through our Site, you agree to the following:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>All information provided in your application is accurate and complete</li>
              <li>Your resume and cover letter do not plagiarize or infringe on anyone&apos;s rights</li>
              <li>We may contact references you provide</li>
              <li>We may conduct background checks as permitted by law</li>
              <li>Your application will be kept on file for consideration and may be reviewed by multiple team members</li>
              <li>We reserve the right to reject any application at our discretion</li>
              <li>Submitting an application does not guarantee employment or an interview</li>
            </ul>
          </div>

          {/* 8. Pricing and Payment */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">8. Pricing and Payment</h2>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">8.1 Pricing</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              All prices quoted on the Site are in Nigerian Naira (NGN) unless otherwise specified. We reserve the right to change prices at any time without notice. Service quotes provided are valid for 30 days from the date of issuance unless otherwise stated in the quote.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">8.2 Payment Terms</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Payment terms will be specified in the service agreement or quote. Accepted payment methods include bank transfers, mobile money, and other methods as specified at the time of transaction. Invoices are due as specified in the terms provided.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">8.3 Late Payment</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Payments not received by the due date may result in service suspension, late fees, or legal action to collect outstanding amounts.
            </p>

            <h4 className="font-display text-lg font-semibold text-secondary-950 mb-3">8.4 Refunds</h4>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Refund policies are specific to each service and will be outlined in the individual service terms. Generally, we do not provide refunds for services rendered unless defective or not in compliance with the service agreement. Consultation services are non-refundable once completed.
            </p>
          </div>

          {/* 9. Limitation of Liability */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">9. Limitation of Liability</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              To the maximum extent permitted by law, in no event shall Bomach Group of Company, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost revenue, lost data, or business interruption, arising out of or related to your use of the Site or services, even if we have been advised of the possibility of such damages.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Our total liability to you for any claims arising out of or related to these Terms or your use of the Site shall not exceed the amount you have paid us in the 12 months preceding the claim, or 100,000 NGN if you have not made any payments.
            </p>
          </div>

          {/* 10. Disclaimer of Warranties */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              The Site and services are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without any warranties of any kind, either express or implied. To the maximum extent permitted by law, we disclaim all warranties, including but not limited to:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>Implied warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties of title and non-infringement</li>
              <li>Warranties that the Site will be uninterrupted, error-free, or free of harmful components</li>
              <li>Warranties that defects will be corrected or that the Site is suitable for your needs</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We do not guarantee the accuracy, completeness, or timeliness of information on the Site. Information is subject to change without notice.
            </p>
          </div>

          {/* 11. Prohibited Conduct */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">11. Prohibited Conduct</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>Violating any applicable federal, state, local, or international laws or regulations</li>
              <li>Infringing on intellectual property rights of others</li>
              <li>Harassing, threatening, defaming, or abusing others</li>
              <li>Sending unsolicited communications or spam</li>
              <li>Engaging in hacking, phishing, or other unauthorized access attempts</li>
              <li>Introducing viruses, malware, or other harmful code</li>
              <li>Impersonating another person or entity</li>
              <li>Interfering with the operation of the Site or its infrastructure</li>
              <li>Collecting or tracking personal information of others without consent</li>
              <li>Attempting to bypass security measures or access restricted areas</li>
              <li>Using the Site for fraudulent or deceptive purposes</li>
              <li>Downloading or distributing content illegally</li>
            </ul>
          </div>

          {/* 12. Termination and Suspension */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">12. Termination and Suspension</h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your access to the Site and our services, with or without cause, immediately and without notice if we determine that:
            </p>
            <ul className="space-y-2 list-disc pl-6 text-secondary-600 mb-6">
              <li>You have violated these Terms</li>
              <li>You have engaged in prohibited conduct</li>
              <li>You have engaged in illegal activities</li>
              <li>We believe your actions could harm us, our users, or third parties</li>
              <li>We discontinue the service or Site</li>
              <li>Your account shows signs of unauthorized access</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mb-6">
              Upon termination, your right to access the Site immediately ceases. We may delete your account and associated data as permitted by law.
            </p>
          </div>

          {/* 13. Indemnification */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">13. Indemnification</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              You agree to indemnify, defend, and hold harmless Bomach Group of Company, its directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorney&apos;s fees) arising out of or related to: (a) your use of the Site or services; (b) your violation of these Terms; (c) your violation of any applicable law or regulation; (d) your infringement of any third-party intellectual property rights; or (e) your User Content or submissions.
            </p>
          </div>

          {/* 14. Third-Party Links */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">14. Third-Party Links and Services</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              The Site may contain links to third-party websites, services, and resources. We do not endorse, warrant, or guarantee the accuracy, completeness, or quality of third-party content. Your access to and use of third-party sites are at your own risk and subject to their terms and conditions.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We are not responsible for any loss, damage, or harm caused by third-party sites, services, or content. We encourage you to review the terms and privacy policies of third-party sites before providing any information.
            </p>
          </div>

          {/* 15. Governing Law */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">15. Governing Law and Dispute Resolution</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles. The courts of Enugu State, Nigeria shall have exclusive jurisdiction over any disputes arising from these Terms or your use of the Site.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If you have a dispute with us, you agree to first attempt to resolve it through good faith negotiation. If negotiation is unsuccessful, you agree to submit the matter to binding arbitration in accordance with the arbitration rules applicable in Nigeria, or alternatively to litigation in the appropriate courts.
            </p>
          </div>

          {/* 16. Severability */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">16. Severability</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it valid, or if such modification is not possible, the provision shall be severed. The remaining provisions shall continue in full force and effect.
            </p>
          </div>

          {/* 17. Entire Agreement */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">17. Entire Agreement</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              These Terms, together with our Privacy Policy and any other terms referenced herein, constitute the entire agreement between you and Bomach Group of Company regarding the Site and services and supersede all prior agreements and understandings. If there is a conflict between these Terms and any other document, these Terms shall control.
            </p>
          </div>

          {/* 18. Amendments */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">18. Amendments</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              We reserve the right to amend or modify these Terms at any time. We will notify you of material changes by posting the updated Terms on the Site and updating the &quot;Last Updated&quot; date. Your continued use of the Site following any modifications constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.
            </p>
          </div>

          {/* 19. Contact Information */}
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-secondary-950 mb-4">19. Contact Information</h2>
            <p className="text-secondary-600 leading-relaxed mb-6">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="glass-card p-6">
              <p className="font-display font-bold text-secondary-950 mb-3">Bomach Group of Company</p>
              <p className="text-secondary-600 mb-3">
                <strong className="text-secondary-950">Address:</strong><br />
                Suite 9 Swiss Guard Plaza<br />
                450 Ogui Road<br />
                Enugu, Enugu State<br />
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
