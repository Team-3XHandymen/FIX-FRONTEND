
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutImage from "@/assets/images/about.png";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-green-500 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">About FixFinder</h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Your trusted platform for connecting with skilled handymen for all your home maintenance needs
            </p>
          </div>
        </div>
        
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src={AboutImage}
                  alt="About FixFinder" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Who We Are</h2>
                <p className="text-gray-600 mb-4">
                  FixFinder was founded with a simple mission: to connect homeowners and businesses with reliable, skilled handymen who can tackle any home maintenance or repair project efficiently and affordably.
                </p>
                <p className="text-gray-600 mb-4">
                  Our platform makes it easy to find, book, and pay for handyman services, eliminating the hassle of searching for trusted professionals when you need help around your home or office.
                </p>
                <p className="text-gray-600">
                  We carefully vet all handymen on our platform to ensure they have the skills, experience, and professionalism to deliver high-quality services that meet our standards and exceed your expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Mission</h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-xl font-bold text-green-500 mb-4">For Customers</h3>
                <p className="text-gray-600">
                  We aim to provide a hassle-free experience for finding reliable handymen, ensuring your home maintenance and repair needs are met with quality service, fair pricing, and professional conduct.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-xl font-bold text-orange-500 mb-4">For Handymen</h3>
                <p className="text-gray-600">
                  We strive to create opportunities for skilled tradespeople to connect with clients in their area, grow their business, and showcase their expertise through a trusted platform that values their skills.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-xl font-bold text-blue-500 mb-4">For Communities</h3>
                <p className="text-gray-600">
                  We work to strengthen local economies by facilitating connections between community members and local service providers, keeping skills and resources within neighborhoods.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-16 bg-green-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Ready to Experience FixFinder?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/services" 
                className="bg-white text-green-500 hover:bg-green-100 px-8 py-3 rounded-md font-medium"
              >
                Browse Services
              </a>
              <a 
                href="/signup" 
                className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-3 rounded-md font-medium"
              >
                Join FixFinder
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
