
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutImage from "@/assets/images/about.png";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-green-500 py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">About FixFinder</h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-3xl mx-auto px-2">
              Your trusted platform for connecting with skilled handymen for all your home maintenance needs
            </p>
          </div>
        </div>
        
        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
              <div className="md:w-1/2 w-full">
                <img 
                  src={AboutImage}
                  alt="About FixFinder" 
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-1/2 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Who We Are</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  FixFinder was founded with a simple mission: to connect homeowners and businesses with reliable, skilled handymen who can tackle any home maintenance or repair project efficiently and affordably.
                </p>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  Our platform makes it easy to find, book, and pay for handyman services, eliminating the hassle of searching for trusted professionals when you need help around your home or office.
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  We carefully vet all handymen on our platform to ensure they have the skills, experience, and professionalism to deliver high-quality services that meet our standards and exceed your expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 px-2">Our Mission</h2>
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-green-500 mb-3 sm:mb-4">For Customers</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We aim to provide a hassle-free experience for finding reliable handymen, ensuring your home maintenance and repair needs are met with quality service, fair pricing, and professional conduct.
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-orange-500 mb-3 sm:mb-4">For Handymen</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We strive to create opportunities for skilled tradespeople to connect with clients in their area, grow their business, and showcase their expertise through a trusted platform that values their skills.
                </p>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-blue-500 mb-3 sm:mb-4">For Communities</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We work to strengthen local economies by facilitating connections between community members and local service providers, keeping skills and resources within neighborhoods.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-12 sm:py-16 bg-green-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 px-2">Ready to Experience FixFinder?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a 
                href="/services" 
                className="bg-white text-green-500 hover:bg-green-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium text-sm sm:text-base"
              >
                Browse Services
              </a>
              <a 
                href="/signup" 
                className="bg-orange-500 text-white hover:bg-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-medium text-sm sm:text-base"
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
