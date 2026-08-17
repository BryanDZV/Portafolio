import { getDictionary } from "@/app/dictionaries/getDictionary";
import ContactSection from "@/components/organisms/ContactSection";
import { ContactPageData } from "@/types/Contact";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const contactData: ContactPageData = {
    pageTitle: dictionary.contact.pageTitle,
    description: dictionary.contact.description,
    emailLabel: dictionary.contact.emailLabel,
    email: dictionary.contact.email,
    backLink: dictionary.contact.backLink,
    availability: dictionary.contact.availability,
    location: dictionary.contact.location,
    socials: dictionary.contact.socials,
  };

  return (
    <main className="relative min-h-[70vh] px-6 md:px-12 pt-32 pb-16 pointer-events-auto">
      <ContactSection data={contactData} homeHref={`/${lang}`} />
    </main>
  );
}
