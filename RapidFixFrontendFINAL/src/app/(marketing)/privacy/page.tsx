import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RapidFix collects, uses, and protects your information, including WhatsApp communications.",
  alternates: { canonical: "https://www.rapidfixauto.in/privacy" },
};

const UPDATED = "20 May 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--color-grey-100)] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white border-2 border-[var(--color-black)] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
          Privacy <span className="text-[var(--color-primary)]">Policy</span>
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-grey-800)] mb-10">
          Last updated: {UPDATED}
        </p>

        <div className="space-y-8 text-[var(--color-grey-800)] leading-relaxed">
          <Section title="1. Who We Are">
            <p>
              RapidFix (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides doorstep car
              and bike repair, servicing, and related automotive services. This
              policy explains what information we collect when you use our
              website or book a service, how we use it, and your choices.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <ul className="list-disc pl-5 space-y-1">
              <li>Your name and contact number</li>
              <li>Email address (if provided)</li>
              <li>
                Vehicle details (type, make, model, registration) and the
                service requested
              </li>
              <li>
                Service location / address, where required for doorstep service
              </li>
              <li>Messages you send us via WhatsApp, phone, or our website</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and confirm your bookings</li>
              <li>To carry out the requested service and prepare your bill</li>
              <li>
                To send you service updates and your invoice over WhatsApp
                (booking confirmations, job status, bill links)
              </li>
              <li>To respond to your enquiries and provide support</li>
            </ul>
          </Section>

          <Section title="4. WhatsApp Communications">
            <p>
              When you book a service, submit your number through our website, or
              message us on WhatsApp, you consent to receive service-related
              WhatsApp messages from RapidFix at the number you provide. These
              are transactional updates about your booking, job, and bill â€” not
              promotional spam.
            </p>
            <p className="mt-2">
              You can opt out at any time by replying <strong>STOP</strong> to
              any of our WhatsApp messages, or by messaging us at the number
              below. We will stop sending you WhatsApp updates after you opt out.
            </p>
          </Section>

          <Section title="5. Sharing Your Information">
            <p>
              We do not sell your personal information. We share it only as
              needed to deliver our service â€” for example, with Meta Platforms
              (WhatsApp) to deliver messages you have opted in to, and with
              service providers who help us operate (such as hosting and
              database providers). These parties are only permitted to use your
              data to provide services to us.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We keep your information for as long as needed to provide our
              services, maintain service history, and meet legal or accounting
              requirements. You may request deletion of your data at any time.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>
              You may request access to, correction of, or deletion of your
              personal information, and you may withdraw your consent to WhatsApp
              communications. To exercise any of these, contact us using the
              details below.
            </p>
          </Section>

          <Section title="8. Contact Us">
            <p>
              For any privacy questions or requests, reach us on WhatsApp or
              call:
            </p>
            <p className="mt-2 font-black text-[var(--color-black)] text-lg">
              +91 96678 91434
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-black uppercase tracking-tight text-[var(--color-black)] mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}
