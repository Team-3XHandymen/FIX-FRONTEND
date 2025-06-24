
import { CheckCircle, Heart, Clock } from "lucide-react";

const Values = () => {
  return (
    <div className="py-16 bg-orange-100 bg-opacity-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              <span className="text-green-500">OUR</span><br />
              <span className="text-green-600">CORE</span><br />
              <span className="text-green-700">VALUES</span>
            </h2>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg p-6 bg-white bg-opacity-20 backdrop-blur-sm">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Quality Assurance</h3>
              <p className="text-gray-700 text-center">
                All our handymen are vetted and qualified to ensure top-notch service quality for every job.
              </p>
            </div>
            
            <div className="rounded-lg p-6 bg-white bg-opacity-20 backdrop-blur-sm">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Customer Satisfaction</h3>
              <p className="text-gray-700 text-center">
                Your satisfaction is our top priority. We ensure every service meets your expectations.
              </p>
            </div>
            
            <div className="rounded-lg p-6 bg-white bg-opacity-20 backdrop-blur-sm">
              <div className="flex justify-center mb-4">
                <Clock className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">On-Time Service</h3>
              <p className="text-gray-700 text-center">
                We value your time and ensure our handymen arrive on schedule for every appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
