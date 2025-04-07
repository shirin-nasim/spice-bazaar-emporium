
const NewsletterSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Spice Community</h2>
          <p className="text-amber-100 mb-8">
            Subscribe to our newsletter for recipes, special offers, and cooking tips. Get 10% off your first order!
          </p>
          
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Your name"
              className="bg-white/90 rounded-lg px-4 py-3 text-amber-900 placeholder-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-300 md:w-1/3"
            />
            <input
              type="email"
              placeholder="Your email address"
              className="bg-white/90 rounded-lg px-4 py-3 text-amber-900 placeholder-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-300 md:w-1/3"
            />
            <button 
              type="submit"
              className="bg-amber-900 hover:bg-amber-950 text-white font-medium rounded-lg px-6 py-3 transition-colors"
            >
              Subscribe Now
            </button>
          </form>
          
          <p className="text-xs text-amber-200 mt-4">
            By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
