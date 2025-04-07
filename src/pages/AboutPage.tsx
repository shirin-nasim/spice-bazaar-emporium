
import MainLayout from "@/components/layout/MainLayout";

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Spice & Nut Emporium</h1>
          
          <div className="mb-12 relative rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1606914535298-5d10ff5ec78c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Spice market" 
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold">Our Heritage Since 1998</h2>
                <p className="text-white/90">Bringing the finest spices and nuts from around the world to your kitchen</p>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-gray-700">
              Founded in 1998, Spice & Nut Emporium has been dedicated to sourcing the highest quality spices, nuts, and dried fruits from around the world.
            </p>
            
            <h2>Our Story</h2>
            <p>
              What began as a small family-owned shop in a local market has grown into a premium emporium with a commitment to quality, authenticity, and sustainability. Our founder, Sarah Thompson, discovered her passion for spices during her travels across Asia and the Middle East, where she learned about traditional harvesting methods and the cultural significance of various spices.
            </p>
            
            <p>
              Upon returning home, Sarah was determined to bring these authentic flavors to local kitchens, establishing Spice & Nut Emporium with a simple mission: to provide the freshest, most flavorful ingredients while supporting sustainable farming practices and ethical sourcing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-amber-800 font-semibold text-lg mb-2">Quality</h3>
                <p className="text-gray-700">We never compromise on quality, selecting only the finest ingredients from trusted suppliers.</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-amber-800 font-semibold text-lg mb-2">Sustainability</h3>
                <p className="text-gray-700">We support sustainable farming practices and ethical trading relationships.</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg">
                <h3 className="text-amber-800 font-semibold text-lg mb-2">Authenticity</h3>
                <p className="text-gray-700">We celebrate cultural heritage and traditional harvesting methods in all our products.</p>
              </div>
            </div>
            
            <h2>Our Commitment</h2>
            <p>
              Today, Spice & Nut Emporium remains committed to these founding principles while continuously evolving to meet the needs of modern consumers. We work directly with farmers and cooperatives around the world, ensuring fair compensation and promoting sustainable agricultural practices.
            </p>
            
            <p>
              Our team of experts carefully selects each product, ensuring optimal flavor, aroma, and freshness. We believe that quality ingredients are the foundation of exceptional cooking, and we're proud to be a part of our customers' culinary journeys.
            </p>
            
            <h2>Join Our Community</h2>
            <p>
              We invite you to explore our extensive selection of premium spices, nuts, and dried fruits. Whether you're a professional chef or a home cooking enthusiast, we have everything you need to elevate your dishes and create memorable dining experiences.
            </p>
            
            <div className="mt-8 bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Visit Our Store</h3>
              <p className="mb-4">Experience the Spice & Nut Emporium difference at our flagship store:</p>
              <address className="not-italic">
                123 Flavor Street<br />
                Culinary District<br />
                Gourmet City, GC 12345<br />
                <span className="block mt-2">Phone: (555) 123-4567</span>
                <span className="block">Email: info@spicenutemprium.com</span>
              </address>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
