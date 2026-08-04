"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Shield, ScrollText, RotateCcw, Cookie } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useUI } from "@/stores/use-ui";
import { cn } from "@/lib/utils";

type LegalSection = "faq" | "privacy" | "terms" | "refund" | "cookie";

const SECTIONS: { id: LegalSection; label: string; icon: React.ElementType }[] = [
  { id: "faq", label: "FAQ", icon: FileText },
  { id: "privacy", label: "Privacy Policy", icon: Shield },
  { id: "terms", label: "Terms & Conditions", icon: ScrollText },
  { id: "refund", label: "Refund Policy", icon: RotateCcw },
  { id: "cookie", label: "Cookie Policy", icon: Cookie },
];

const FAQ_ITEMS = [
  { q: "How do I book a trip?", a: "Browse trips, select your preferred date and number of travelers, fill in traveler information, and complete the payment. You'll receive an instant confirmation email with your booking reference." },
  { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, PayPal, Apple Pay, and bank transfers in USD, EUR, or EGP. All payments are processed through secure 256-bit SSL encryption." },
  { q: "Can I cancel my booking?", a: "Yes. Free cancellation up to 7 days before departure (100% refund). 50% refund between 3-7 days. No refund within 72 hours of departure. See our Refund Policy for details." },
  { q: "Do I need travel insurance?", a: "Yes, travel insurance is mandatory for all international trips. We recommend comprehensive coverage of at least $50,000 medical and trip cancellation protection." },
  { q: "Can I customize a trip?", a: "Absolutely! Our travel experts can customize any itinerary to your preferences. Click 'Book Now' on any trip and a specialist will contact you within 24 hours." },
  { q: "What is the group size?", a: "Group sizes vary by trip but typically range from 6 to 16 travelers for an intimate experience. Private departures are available on request." },
  { q: "Are flights included?", a: "International flights are not included in the trip price. Domestic transportation during the trip (private vans, boats, flights within the country) is included as specified in each itinerary." },
  { q: "How do I get my visa?", a: "We offer visa assistance services for most countries. Visit our Visa Services page, select your destination, and apply online. Processing times vary by country." },
];

const PRIVACY_SECTIONS = [
  { title: "Information We Collect", body: "We collect personal information you provide when creating an account, booking trips, or contacting us. This includes your name, email, phone number, nationality, passport details (for bookings), and payment information. We also automatically collect usage data such as IP address, browser type, and pages visited." },
  { title: "How We Use Your Information", body: "Your information is used to process bookings, send confirmations and updates, provide customer support, personalize your experience, send marketing communications (with consent), comply with legal obligations, and prevent fraud. We never sell your personal data to third parties." },
  { title: "Data Security", body: "We employ bank-grade 256-bit SSL encryption for all data transmissions. Payment information is processed through PCI-DSS compliant payment gateways and is never stored on our servers. Access to personal data is restricted to authorized personnel only, with multi-factor authentication required for all internal systems." },
  { title: "Your Rights", body: "Under GDPR and CCPA, you have the right to access, correct, export, or delete your personal data. You can also object to processing, restrict processing, and withdraw consent for marketing communications at any time. To exercise these rights, contact privacy@bluesky.travel." },
  { title: "Data Retention", body: "We retain booking records for 7 years for legal and tax purposes. Marketing data is retained until you opt out. Inactive accounts are deleted after 3 years of inactivity. You can request immediate deletion of your account at any time." },
  { title: "Cookies", body: "We use essential cookies for site functionality, analytics cookies to improve our services, and marketing cookies (with consent) to show relevant offers. See our Cookie Policy for details on managing cookies." },
];

const TERMS_SECTIONS = [
  { title: "Acceptance of Terms", body: "By accessing and using Boundless Travel's website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services." },
  { title: "Booking & Payment", body: "A 25% deposit secures your booking. The balance is due 14 days before departure. Failure to pay the balance by the due date may result in cancellation of your booking with charges as per our Refund Policy. All prices are in USD unless otherwise stated." },
  { title: "Cancellation by You", body: "Free cancellation up to 7 days before departure (100% refund). 50% refund between 3-7 days before departure. No refund within 72 hours of departure. Cancellation requests must be submitted in writing to bookings@bluesky.travel." },
  { title: "Cancellation by Us", body: "Boundless Travel reserves the right to cancel a trip due to unforeseen circumstances (natural disasters, political instability, insufficient participation). In such cases, a full refund or alternative trip will be offered. We are not liable for ancillary costs such as flights or visas." },
  { title: "Travel Documents", body: "It is your responsibility to ensure you have valid passports (6+ months validity), required visas, and travel insurance. We are not liable for denied boarding or entry due to incomplete documentation." },
  { title: "Liability", body: "Boundless Travel acts as an agent for suppliers (hotels, airlines, tour operators). We are not liable for acts of God, accidents, injuries, delays, or losses caused by third-party suppliers. Our liability is limited to the amount paid for the booking." },
];

const REFUND_SECTIONS = [
  { title: "Refund Eligibility", body: "Refunds are processed based on the cancellation timeline: 100% refund for cancellations 7+ days before departure, 50% refund for 3-7 days before, and no refund within 72 hours. Refund requests must be submitted in writing within 30 days of cancellation." },
  { title: "Refund Processing Time", body: "Approved refunds are processed within 5-10 business days to the original payment method. Bank transfers may take up to 15 business days. We are not responsible for delays caused by your bank or payment processor." },
  { title: "Non-Refundable Items", body: "Visa application fees, travel insurance premiums, and third-party services (hotels, flights booked separately) are non-refundable once processed. Promotional and flash-sale bookings may have modified refund terms — check the specific offer details." },
  { title: "Force Majeure", body: "In cases of natural disasters, pandemics, or government travel bans, we offer full credit toward future travel (valid 24 months) or a 90% refund. We are not liable for ancillary costs such as flights or visas." },
];

const COOKIE_SECTIONS = [
  { title: "What Are Cookies", body: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in, analyze traffic, and provide a personalized experience." },
  { title: "Types of Cookies We Use", body: "Essential cookies (required for login, cart, and checkout), Analytics cookies (anonymous traffic data via Google Analytics), Functional cookies (language, currency preferences), and Marketing cookies (personalized offers — only with your consent)." },
  { title: "Managing Cookies", body: "You can manage cookies through your browser settings. Essential cookies cannot be disabled as they are required for the site to function. You can withdraw consent for non-essential cookies at any time via the cookie banner or your account settings." },
  { title: "Third-Party Cookies", body: "We use Google Analytics for traffic analysis, Stripe for payment processing, and Meta Pixel for marketing attribution (with consent). These third parties have their own privacy policies governing cookie usage." },
];

function getContent(section: LegalSection) {
  switch (section) {
    case "faq": return { title: "Frequently Asked Questions", sections: FAQ_ITEMS.map(f => ({ title: f.q, body: f.a })) };
    case "privacy": return { title: "Privacy Policy", sections: PRIVACY_SECTIONS };
    case "terms": return { title: "Terms & Conditions", sections: TERMS_SECTIONS };
    case "refund": return { title: "Refund Policy", sections: REFUND_SECTIONS };
    case "cookie": return { title: "Cookie Policy", sections: COOKIE_SECTIONS };
  }
}

export function LegalModal() {
  const { legalOpen, closeLegal, legalSection, setLegalSection } = useUI();
  const content = getContent(legalSection);

  return (
    <DialogPrimitive.Root open={legalOpen} onOpenChange={(o) => !o && closeLegal()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-3xl h-[85vh]",
          )}
        >
          <DialogTitle className="sr-only">{content.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Read our {content.title.toLowerCase()} document.
          </DialogDescription>

          <div className="grid h-full grid-cols-1 sm:grid-cols-[200px_1fr]">
            {/* Sidebar */}
            <aside className="hidden flex-col border-r border-border/60 bg-muted/30 sm:flex">
              <div className="p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal</h3>
                <nav className="space-y-1">
                  {SECTIONS.map((s) => {
                    const Icon = s.icon;
                    const isActive = legalSection === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setLegalSection(s.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-gradient-bluesky text-primary-foreground shadow-glow-bluesky"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {s.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Mobile tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 px-2 py-2 no-scrollbar sm:hidden">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setLegalSection(s.id)}
                  className={cn(
                    "shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold",
                    legalSection === s.id ? "bg-gradient-bluesky text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex flex-col overflow-hidden">
              <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <h2 className="text-lg font-bold text-foreground">{content.title}</h2>
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>
              </header>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={legalSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {content.sections.map((s, i) => (
                      <div key={i}>
                        <h4 className="mb-1.5 text-sm font-bold text-foreground">{s.title}</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                      </div>
                    ))}
                    <p className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
