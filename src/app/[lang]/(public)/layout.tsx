import { BackgroundScene } from "@/components/3d/BackgroundScene";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getDictionary } from "@/app/dictionaries/getDictionary";
import { cookies } from "next/headers";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang);
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("auth_token")?.value);

  return (
    <div className="relative isolate min-h-screen pointer-events-none">
      <BackgroundScene />
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="relative z-10 pointer-events-none">{children}</div>
      <div className="pointer-events-auto w-full">
        <Footer dictionary={dictionary.footer} lang={lang} />
      </div>
    </div>
  );
}
