import Head from './head';
import { Header } from './header';
import { Footer } from './footer';
import MobileNav from './mobile-navigation';

interface Props {
  children: React.ReactNode;
}

export const underline =
  'decoration-amber-500 underline underline-offset-[5px] decoration-[3px]';

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col max-width-full min-h-screen">
      <Head />
      <Header />
      <MobileNav />
      <main className="mt-[64px] md:mt-[72px] mx-auto flex-1 w-full max-w-screen-lg ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
