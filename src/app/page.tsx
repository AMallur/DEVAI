import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ToolsGrid from "@/components/ToolsGrid";
import Docs from "@/components/Docs";
import Blog from "@/components/Blog";
import Contribute from "@/components/Contribute";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ToolsGrid />
      <Docs />
      <Blog />
      <Contribute />
      <Footer />
    </>
  );
}
