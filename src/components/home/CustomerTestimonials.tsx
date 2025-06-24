
import React from "react";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  quote: string;
  occupation: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=64&h=64&q=80",
    quote:
      "FixFinder connected me with an amazing handyman who fixed my leaking faucet quickly and professionally. Highly recommend!",
    occupation: "Homeowner"
  },
  {
    id: 2,
    name: "Michael Lee",
    avatar: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=64&h=64&q=80",
    quote:
      "The platform is easy to use and helped me find reliable help for a home renovation. The handyman was punctual and exceeded my expectations.",
    occupation: "Apartment Renter"
  },
  {
    id: 3,
    name: "Emily Smith",
    avatar: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=64&h=64&q=80",
    quote:
      "I love how secure and simple FixFinder makes payments. The handyman was great and I'll definitely be using this service again!",
    occupation: "Small Business Owner"
  }
];

const CustomerTestimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Customer Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ id, name, avatar, quote, occupation }) => (
            <div
              key={id}
              className="bg-green-50 rounded-lg shadow p-6 flex flex-col items-center text-center"
            >
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 rounded-full mb-4 object-cover"
              />
              <p className="text-gray-700 italic mb-4">&quot;{quote}&quot;</p>
              <h3 className="text-lg font-semibold text-green-700">{name}</h3>
              <p className="text-sm text-green-600">{occupation}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
