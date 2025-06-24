
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { Star, Phone, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const profile = {
  name: "Kamal Perera",
  title: "Plumbing Specialist",
  avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  rating: 4.8,
  reviews: 24,
  location: "36/1, Colombo, Sri Lanka",
  phone: "(555) 123-4567",
  email: "kamal.perera@example.com",
  experience: "5 years experience",
  skills: [
    "Plumbing", "Electrical", "Bathroom Renovation", "Kitchen Installation",
    "Drywall Repair", "Painting", "Flooring"
  ]
};

const AboutMeSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <div className="flex justify-between items-start mb-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">About Me</h2>
    </div>
    <p className="text-gray-700 mb-2">
      Licensed plumber with over 5 years of experience in residential and commercial plumbing services. Specializing in pipe installation, repair, and maintenance. Also skilled in bathroom renovations and kitchen installations. Committed to providing high-quality workmanship and excellent customer service.
    </p>
    <button className="text-sm text-green-700 font-medium hover:underline px-0 py-0 bg-transparent border-none">
      Edit Description
    </button>
  </div>
);

const WorkExperienceSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <div className="flex justify-between items-start mb-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Work Experience</h2>
      <button className="text-green-700 text-sm font-medium hover:underline px-0 py-0 bg-transparent border-none">
        + Add Experience
      </button>
    </div>
    <div className="mb-4">
      <div className="font-semibold text-gray-900">Senior Plumber</div>
      <div className="text-gray-700 text-sm">ABC Plumbing Services</div>
      <div className="text-xs text-gray-500 mb-1">2020 - Present</div>
      <div className="text-gray-700 text-sm">
        Lead plumber responsible for managing complex residential and commercial plumbing projects. Supervise a team of junior plumbers and apprentices.
      </div>
    </div>
    <div>
      <div className="font-semibold text-gray-900">Plumbing Technician</div>
      <div className="text-gray-700 text-sm">XYZ Home Services</div>
      <div className="text-xs text-gray-500 mb-1">2018 - 2020</div>
      <div className="text-gray-700 text-sm">
        Performed installation, maintenance, and repair of plumbing systems in residential properties. Specialized in bathroom renovations and kitchen plumbing.
      </div>
    </div>
  </div>
);

const CertificationsSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <div className="flex justify-between items-start mb-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Certifications</h2>
      <button className="text-green-700 text-sm font-medium hover:underline px-0 py-0 bg-transparent border-none">
        + Add Certification
      </button>
    </div>
    <div className="mb-4">
      <div className="font-semibold text-gray-900">Master Plumber License</div>
      <div className="text-gray-700 text-sm">Sri Lanka State Board</div>
      <div className="text-xs text-gray-500 mb-2">Issued 2019</div>
    </div>
    <div className="mb-4">
      <div className="font-semibold text-gray-900">Certified Bathroom Remodeler</div>
      <div className="text-gray-700 text-sm">National Association of Home Builders</div>
      <div className="text-xs text-gray-500 mb-2">Issued 2020</div>
    </div>
    <div>
      <div className="font-semibold text-gray-900">Green Plumbing Certification</div>
      <div className="text-gray-700 text-sm">Sustainable Plumbing Council</div>
      <div className="text-xs text-gray-500">Issued 2021</div>
    </div>
  </div>
);

const RecentReviewsSection = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex justify-between items-start mb-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Recent Reviews</h2>
      <button className="text-green-700 text-sm font-medium hover:underline px-0 py-0 bg-transparent border-none">
        View All Reviews
      </button>
    </div>
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <Star className="text-yellow-400 fill-yellow-300" size={18} />
        <span className="font-medium text-gray-900">Dhammika Perera</span>
        <span className="ml-2 text-xs text-gray-500">2 days ago</span>
      </div>
      <div className="text-gray-700 text-sm">
        John did an excellent job with our electrical wiring. He was professional, punctual, and the work was completed to a high standard. Would definitely recommend!
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Star className="text-yellow-400 fill-yellow-300" size={18} />
        <span className="font-medium text-gray-900">Miona de silva</span>
        <span className="ml-2 text-xs text-gray-500">1 week ago</span>
      </div>
      <div className="text-gray-700 text-sm">
        Fixed our leaky faucet quickly and efficiently. Very reasonable pricing and explained everything clearly. Will be using John's services again in the future.
      </div>
    </div>
  </div>
);

const SidebarProfileCard = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col items-center mb-5">
    <img
      src={profile.avatar}
      alt="Profile"
      className="w-24 h-24 object-cover rounded-full mb-3 border"
    />
    <div className="text-xl font-semibold text-gray-900">{profile.name}</div>
    <div className="text-gray-700">{profile.title}</div>
    {/* Star Rating */}
    <div className="flex items-center gap-1 mt-2">
      {/* 5 static stars, using lucide 'star' icon and fill for each */}
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={i <= Math.floor(profile.rating) ? "text-yellow-400 fill-yellow-300" : "text-gray-300"}
          size={18}
        />
      ))}
      <span className="ml-2 text-gray-700 text-sm font-medium">
        {profile.rating} <span className="text-gray-500">({profile.reviews} reviews)</span>
      </span>
    </div>
    <Button className="w-full mt-4 mb-3 bg-green-600 hover:bg-green-700">
      Edit Profile
    </Button>
    <div className="w-full mb-2">
      <div className="flex items-center mt-2 text-gray-600 text-sm gap-2">
        <MapPin size={17} /> <span>{profile.location}</span>
      </div>
      <div className="flex items-center mt-2 text-gray-600 text-sm gap-2">
        <Phone size={17} /> <span>{profile.phone}</span>
      </div>
      <div className="flex items-center mt-2 text-gray-600 text-sm gap-2">
        <Mail size={17} /> <span>{profile.email}</span>
      </div>
      <div className="flex items-center mt-2 text-gray-600 text-sm gap-2">
        <span className="text-lg">⏳</span> <span>{profile.experience}</span>
      </div>
    </div>
  </div>
);

const SidebarSkillsCard = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="font-semibold text-gray-900 mb-2">Skills &amp; Services</div>
    <div className="flex flex-wrap gap-2 mb-2">
      {profile.skills.slice(0, 7).map(skill => (
        <Badge
          key={skill}
          variant="secondary"
          className="bg-green-50 border-none text-green-700 font-medium px-3 py-1 text-sm"
        >
          {skill}
        </Badge>
      ))}
    </div>
    <button className="text-green-700 text-sm font-medium hover:underline px-0 py-0 bg-transparent border-none">
      + Add More Skills
    </button>
  </div>
);

const HandymanProfile = () => (
  <HandymanDashboardLayout title="Profile">
    <div className="flex flex-col-reverse md:flex-row gap-8">
      {/* Sidebar */}
      <div className="md:w-1/3 flex flex-col gap-5 mb-6 md:mb-0">
        <SidebarProfileCard />
        <SidebarSkillsCard />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        <AboutMeSection />
        <WorkExperienceSection />
        <CertificationsSection />
        <RecentReviewsSection />
      </div>
    </div>
  </HandymanDashboardLayout>
);

export default HandymanProfile;
