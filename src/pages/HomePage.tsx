
import MainLayout from "../components/layout/MainLayout";
import Hero from "../components/home/Hero";
import FeaturedCategories from "../components/home/FeaturedCategories";
import BestSellers from "../components/home/BestSellers";
import TestimonialsSection from "../components/home/TestimonialsSection";
import FeaturesHighlight from "../components/home/FeaturesHighlight";
import NewsletterSection from "../components/home/NewsletterSection";

const HomePage = () => {
  return (
    <MainLayout>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <FeaturesHighlight />
      <TestimonialsSection />
      <NewsletterSection />
    </MainLayout>
  );
};

export default HomePage;
