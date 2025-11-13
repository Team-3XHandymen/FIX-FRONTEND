
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-green-500 py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-2">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-3xl mx-auto px-2">
              Have questions or need assistance? We're here to help you with any inquiries about our handyman services.
            </p>
          </div>
        </div>
        
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12">
              <div className="lg:w-1/2 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Get In Touch</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
                
                <form className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="first-name">
                        First Name
                      </label>
                      <input
                        id="first-name"
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="last-name">
                        Last Name
                      </label>
                      <input
                        id="last-name"
                        type="text"
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="What is this regarding?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="lg:w-1/2 w-full">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg h-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Contact Information</h3>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Phone</h4>
                        <p className="text-sm sm:text-base text-gray-600">+1 (555) 123-4567</p>
                        <p className="text-sm sm:text-base text-gray-600">Mon-Fri: 8am - 6pm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Email</h4>
                        <p className="text-sm sm:text-base text-gray-600 break-all">support@fixfinder.com</p>
                        <p className="text-sm sm:text-base text-gray-600 break-all">info@fixfinder.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Office</h4>
                        <p className="text-sm sm:text-base text-gray-600">123 Main Street</p>
                        <p className="text-sm sm:text-base text-gray-600">Anytown, USA 12345</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Working Hours</h4>
                        <p className="text-sm sm:text-base text-gray-600">Monday - Friday: 8am - 6pm</p>
                        <p className="text-sm sm:text-base text-gray-600">Saturday: 9am - 4pm</p>
                        <p className="text-sm sm:text-base text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-64 sm:h-80 md:h-96 w-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.131346521185!2d-122.41941648515827!3d37.77492997975857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f7e1bba1a0d35%3A0xc5f20b64717e04b9!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1650444268692!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
