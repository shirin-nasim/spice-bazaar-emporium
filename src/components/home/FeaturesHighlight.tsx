
import { ShieldCheck, Truck, RefreshCw, Award } from "lucide-react";

const features = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Premium Quality",
    description: "We source directly from farmers and ensure the highest quality standards"
  },
  {
    id: 2,
    icon: Truck,
    title: "Fast Shipping",
    description: "Free shipping on orders over $50 and express delivery options available"
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy for all our products"
  },
  {
    id: 4,
    icon: Award,
    title: "Certified Organic",
    description: "Many of our products are certified organic and sustainably sourced"
  }
];

const FeaturesHighlight = () => {
  return (
    <section className="py-16 bg-amber-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center">
              <div className="bg-amber-500 p-3 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-amber-900 mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesHighlight;
