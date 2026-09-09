import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import ProductGrid from "@/components/ProductGrid";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProductGrid />
        <About />
      </main>
      <Footer />
    </>
  );
}
