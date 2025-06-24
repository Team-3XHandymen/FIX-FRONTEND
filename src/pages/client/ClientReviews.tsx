
import { Edit } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";

const ClientReviews = () => {
  const reviews = [
    {
      id: 1,
      handyman: "Kamal Perera",
      service: "Plumbing Repair",
      date: "January 15, 2023",
      rating: 5,
      comment: "Exceptional service from start to finish. Kamal was very professional and knowledgeable. He fixed my sink perfectly!",
      handymanPhoto: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      handyman: "Electrical Installation",
      service: " Nimal Gunasinghe",
      date: "December 22, 2022",
      rating: 4,
      comment: "Great job installing my ceiling fan. He was polite, fast, and cleaned up after the work.",
      handymanPhoto: "https://randomuser.me/api/portraits/men/55.jpg"
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <ClientDashboardLayout title="Reviews Given">
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={review.handymanPhoto} 
                    alt={review.handyman} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{review.handyman}</h3>
                  <p className="text-gray-600 text-sm">{review.date}</p>
                  <div className="flex mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </ClientDashboardLayout>
  );
};

export default ClientReviews;
