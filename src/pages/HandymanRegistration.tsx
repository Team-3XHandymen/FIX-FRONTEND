
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from '@clerk/clerk-react';
import { HandymanAPI, ClientAPI } from "@/lib/api";

const REG_STEPS = [
  "Personal Information",
  "Profile Photo",
  "Skillset & Services",
  "Professional Details",
];

const certifications = [
  { label: "NVQ Level Certificate", name: "nvq" },
  { label: "Technical / Vocational Courses Certificates", name: "techvoc" },
  { label: "Workshop Certificates", name: "workshop" },
  { label: "No formal training, but practical experience", name: "practical" },
];

const paymentMethods = [
  { label: "Cash", name: "cash" },
  { label: "Bank Transfer", name: "bank" },
  { label: "Frimi", name: "frimi" },
  { label: "ez Cash", name: "ezcash" },
  { label: "Other:", name: "other" },
];

const StepIndicator = ({ step }: { step: number }) => (
  <div className="flex justify-center items-center mt-2 mb-8">
    {[1, 2, 3, 4].map((n, idx) => (
      <React.Fragment key={n}>
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold",
            step > idx
              ? "bg-green-500 text-white"
              : step === idx
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          )}
        >
          {step > idx ? (
            <svg width="18" height="18" className="mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
          ) : (
            n
          )}
        </div>
        {idx < 3 && (
          <div
            className={cn(
              "h-1 w-8 mx-1 rounded",
              step > idx ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const Step1 = ({data, onChange, clientData}: { 
  data: any, 
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  clientData?: any 
}) => (
  <div>
    <div className="flex items-center text-2xl font-semibold text-gray-700 mb-6">
      <svg width="26" className="mr-2 text-gray-500" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-8 0v2"/><circle cx="12" cy="7" r="4"/><rect width="24" height="24"/></svg>
      <span>Personal Information</span>
    </div>
    
    {/* Auto-fill notification */}
    {clientData && (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="font-medium">Profile Information Auto-filled</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          We've pre-filled some fields using your existing client profile. You can edit any information as needed.
        </p>
      </div>
    )}
    
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Full Name <span className="text-red-500">*</span>
          {clientData?.name && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="name"
          value={data.name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          NIC / Driving License Number <span className="text-red-500">*</span>
        </label>
        <input
          name="nic"
          value={data.nic}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="NIC / Driving License Number"
          required
        />
        <p className="text-xs text-gray-500 mt-1">This information is not stored in your client profile and must be provided.</p>
      </div>
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Contact Number <span className="text-red-500">*</span>
          {clientData?.mobileNumber && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="contactNumber"
          value={data.contactNumber}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          placeholder="Contact Number"
          autoComplete="tel"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          Email Address <span className="text-red-500">*</span>
          {clientData?.email && (
            <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
          )}
        </label>
        <input
          name="emailAddress"
          value={data.emailAddress}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          required
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Email address is locked and cannot be changed from your client profile.</p>
      </div>
    </div>
  </div>
);

const Step2 = ({
  photo,
  onPhoto,
}: {
  photo: File | null;
  onPhoto: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <div className="flex items-center text-2xl font-semibold text-gray-700 mb-6">
      <svg width="26" height="26" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 16v6m0 0v2m0-2h2m-2 0H8m8-2v-2a4 4 0 00-8 0v2"/>
        <circle cx="12" cy="7" r="4"/>
        <rect width="24" height="24"/>
      </svg>
      <span>Profile Photo</span>
    </div>
    <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center py-12 mb-4">
      {!photo ? (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-gray-100 h-16 w-16 flex justify-center items-center mb-4">
            <svg className="text-gray-400" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 16v6m0 0v2m0-2h2m-2 0H8m8-2v-2a4 4 0 00-8 0v2"/>
              <circle cx="12" cy="7" r="4"/>
              <rect width="24" height="24"/>
            </svg>
          </div>
          <span className="text-gray-500 mb-3 text-center">Upload a clear, professional-looking photo</span>
          <span className="text-sm text-gray-400 mb-4 text-center">This will be displayed to potential clients</span>
          <label htmlFor="profile-upload" className="cursor-pointer">
            <span className="bg-green-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors inline-block">
              Choose Photo
            </span>
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={URL.createObjectURL(photo)}
            alt="Profile preview"
            className="h-28 w-28 object-cover rounded-full border-4 border-green-200 mb-4"
          />
          <span className="text-green-700 font-medium">Photo selected successfully!</span>
          <span className="text-sm text-gray-500 mt-1 mb-3">Click to change photo</span>
          <label htmlFor="profile-upload" className="cursor-pointer">
            <span className="bg-gray-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block text-sm">
              Change Photo
            </span>
          </label>
        </div>
      )}
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhoto}
      />
    </div>
  </div>
);

const Step3 = ({
  services,
  otherService,
  onServiceChange,
  onOtherChange,
  availableServices,
  clientData
}: {
  services: string[];
  otherService: string;
  onServiceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onOtherChange: (e: ChangeEvent<HTMLInputElement>) => void;
  availableServices: any[];
  clientData?: any;
}) => (
  <div>
    <div className="text-2xl font-semibold text-gray-700 mb-6">
      Skillset & Services Offered
    </div>
    <div className="mb-4 text-gray-600">Select all services you can provide</div>
    <div className="grid grid-cols-1 gap-3">
      {availableServices.length > 0 ? (
        availableServices.map((service) => (
          <div key={service._id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
            <input
              id={`skill-${service._id}`}
              type="checkbox"
              name={service._id}
              checked={services.includes(service._id)}
              onChange={onServiceChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`skill-${service._id}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">
              {service.name}
            </label>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-3"></div>
          <p className="text-gray-500">Loading available services...</p>
        </div>
      )}
    </div>
  </div>
);

const Step4 = ({
  data, onInputChange, certs, onCertChange,
  days, hours, onDaysChange, onHoursChange,
  pay, onPayChange, otherPay, onOtherPayChange,
  clientData,
}: {
  data: any;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  certs: string[];
  onCertChange: (e: ChangeEvent<HTMLInputElement>) => void;
  days: string[];
  hours: string;
  onDaysChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onHoursChange: (e: ChangeEvent<HTMLInputElement>) => void;
  pay: string[];
  onPayChange: (e: ChangeEvent<HTMLInputElement>) => void;
  otherPay: string;
  onOtherPayChange: (e: ChangeEvent<HTMLInputElement>) => void;
  clientData?: any;
}) => (
  <div className="space-y-6">
    {/* Experience Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <svg width="22" height="22" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-1M9 8h6M9 11h6"/></svg>
        <span>Years of Experience</span>
      </div>
      <input
        name="experience"
        value={data.experience}
        onChange={onInputChange}
        type="number"
        min={0}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="e.g., 5 years"
      />
    </div>

    {/* Certifications Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <svg width="22" height="22" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="14" x="3" y="5" rx="2"/><path d="M3 7V5a2 2 0 012-2h3.5"/></svg>
        <span>Certifications / Training</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {certifications.map(cert => (
          <div key={cert.name} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
            <input
              type="checkbox"
              id={`cert-${cert.name}`}
              name={cert.name}
              checked={certs.includes(cert.name)}
              onChange={onCertChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`cert-${cert.name}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">{cert.label}</label>
          </div>
        ))}
      </div>
    </div>

    {/* Availability Section */}
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <svg width="22" height="22" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6v-2h8v2"/></svg>
        <span>Working Schedule</span>
      </div>
      
      {/* Working Days */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Working Days</label>
        <div className="grid grid-cols-2 gap-3">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <div key={day} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
              <input
                type="checkbox"
                id={`day-${day.toLowerCase()}`}
                name="workDays"
                value={day}
                checked={days.includes(day)}
                onChange={onDaysChange}
                className="h-4 w-4 border-gray-400 text-green-600 focus:ring-green-500 rounded"
              />
              <label htmlFor={`day-${day.toLowerCase()}`} className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">{day}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Working Hours</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              name="workHoursStart"
              value={hours.split('-')[0] || ''}
              onChange={onHoursChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              name="workHoursEnd"
              value={hours.split('-')[1] || ''}
              onChange={onHoursChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Location Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <svg width="22" height="22" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <span>Location</span>
        {clientData?.location && (
          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Auto-filled</span>
        )}
      </div>
      <input
        name="location"
        value={data.location || ''}
        onChange={onInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        placeholder="e.g., Colombo, Sri Lanka"
      />
    </div>

    {/* Payment Methods Section */}
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
        <svg width="22" height="22" className="text-gray-500" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M8 6v-2h8v2"/></svg>
        <span>Preferred Payment Methods</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map(method => (
          <div key={method.name} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
            <input
              type="checkbox"
              id={`pay-${method.name}`}
              name={method.name}
              checked={pay.includes(method.name)}
              onChange={onPayChange}
              className="h-5 w-5 border-gray-400 text-green-600 focus:ring-green-500 rounded"
            />
            <label htmlFor={`pay-${method.name}`} className="ml-3 text-base font-medium text-gray-700 cursor-pointer">{method.label}</label>
            {method.name === "other" && pay.includes("other") && (
              <input
                className="ml-3 flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                type="text"
                value={otherPay}
                placeholder="Please specify"
                onChange={onOtherPayChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const initialForm = {
  name: "",
  nic: "",
  contactNumber: "",
  emailAddress: "",
  experience: "",
  location: "",
};

const HandymanRegistration = () => {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [otherService, setOtherService] = useState("");
  const [certs, setCerts] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [hours, setHours] = useState<string>("");
  const [pay, setPay] = useState<string[]>([]);
  const [otherPay, setOtherPay] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [isLoadingClientData, setIsLoadingClientData] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/sign-in');
    }
  }, [isLoaded, user, navigate]);

  // Fetch client data and auto-fill form
  useEffect(() => {
    const fetchClientDataAndAutoFill = async () => {
      if (!user || !isLoaded) return;
      
      try {
        setIsLoadingClientData(true);
        
        // Fetch client data from backend
        const response = await ClientAPI.getClientByUserId(user.id);
        
        if (response.success && response.data) {
          setClientData(response.data);
          
          // Auto-fill form with available client data
          const autoFilledData = {
            name: response.data.name || response.data.username || "",
            nic: "", // NIC is not stored in client profile
            contactNumber: response.data.mobileNumber || "",
            emailAddress: response.data.email || "",
            experience: "",
            location: response.data.location || "",
          };
          
          setPersonal(autoFilledData);
          
          console.log('Auto-filled form with client data:', autoFilledData);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
        // Continue with empty form if client data fetch fails
      } finally {
        setIsLoadingClientData(false);
      }
    };

    fetchClientDataAndAutoFill();
  }, [user, isLoaded]);

  // Fetch available services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await HandymanAPI.getAvailableServices();
        if (response.success) {
          setAvailableServices(response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  // Show loading state while Clerk is initializing or client data is loading
  if (!isLoaded || !user || isLoadingClientData) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">
          {!isLoaded || !user ? 'Loading...' : 'Loading your profile information...'}
        </p>
      </div>
    );
  }

  const handlePersonalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPhoto(e.target.files[0]);
  };

  const handleServiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (checked) {
      setServices([...services, name]);
    } else {
      const filteredServices = services.filter(s => s !== name);
      setServices(filteredServices);
    }
  };

  const handleOtherServiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherService(e.target.value);
  };

  const handleCertChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) setCerts([...certs, name]);
    else setCerts(certs.filter((c) => c !== name));
  };

  const handleDaysChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (days.includes(value)) {
      setDays(days.filter(day => day !== value));
    } else {
      setDays([...days, value]);
    }
  };

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    
    if (name === 'workHoursStart') {
      setHours(`${value}-${hours.split('-')[1] || ''}`);
    } else if (name === 'workHoursEnd') {
      setHours(`${hours.split('-')[0] || ''}-${value}`);
    }
  };

  const handlePayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (checked) setPay([...pay, name]);
    else setPay(pay.filter((p) => p !== name));
  };

  const handleOtherPayChange = (e: ChangeEvent<HTMLInputElement>) => setOtherPay(e.target.value);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent any form submission
    // Validate current step before proceeding
    if (step === 0) {
      if (!personal.name || !personal.nic || !personal.contactNumber || !personal.emailAddress) {
        alert("Please fill in all required fields (Name, NIC, Contact, Email)");
        return;
      }
    } else if (step === 1) {
      if (!photo) {
        alert("Please upload a profile photo");
        return;
      }
    } else if (step === 2) {
      if (services.length === 0) {
        alert("Please select at least one service");
        return;
      }
    }
    setStep((s) => s + 1);
  };
  
  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault(); // Prevent any form submission
    setStep((s) => s - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Only allow submission on the final step
    if (step !== 3) {
      return;
    }
    
    // Validate required fields
    if (!personal.name || !personal.nic || !personal.contactNumber || !personal.emailAddress) {
      alert("Please fill in all required fields (Name, NIC, Contact, Email)");
      return;
    }
    
    if (!photo) {
      alert("Please upload a profile photo");
      return;
    }
    
    if (services.length === 0) {
      alert("Please select at least one service");
      return;
    }
    
    // Validate address fields (only location is required now)
    if (!personal.location || personal.location.trim() === '') {
      alert("Please provide your location");
      return;
    }
    
    // Validate experience field
    if (!personal.experience || personal.experience.trim() === '') {
      alert("Please provide your years of experience");
      return;
    }
    
    // Set default working days and hours if not provided (matching backend behavior)
    let workingDays = days;
    let workingHours = hours;
    if (!workingDays || workingDays.length === 0) {
      workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    }
    if (!workingHours || workingHours.trim() === '') {
      workingHours = '9:00 AM - 5:00 PM';
    }
    
    // Convert arrays to strings as expected by backend
    const workingDaysString = workingDays.join(', ');
    const workingHoursArray = workingHours.split('-').map(hour => hour.trim());
    
    if (pay.length === 0) {
      alert("Please select at least one payment method");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert photo to base64 for storage
      const photoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photo!);
      });

      // Prepare handyman data
      const handymanData = {
        clerkUserId: user?.id, // Add Clerk user ID
        name: personal.name,
        nic: personal.nic,
        contactNumber: personal.contactNumber,
        emailAddress: personal.emailAddress,
        personalPhoto: photoBase64,
        experience: parseInt(personal.experience) || 0,
        certifications: certs,
        services: services, // Only service IDs, no skills array
        location: personal.location || '', // Add location field
        availability: {
          workingDays: workingDaysString,
          workingHours: workingHoursArray.filter(hour => hour.trim() !== '').join(', '),
        },
        paymentMethod: pay.filter(p => p !== 'other').join(', '),
      };

      // Register handyman with backend
      const response = await HandymanAPI.registerHandyman(handymanData);
      
      if (response.success) {
        // Set Clerk metadata to mark user as handyman
        if (user) {
          await user.update({ 
            unsafeMetadata: { 
              ...user.unsafeMetadata, 
              userType: 'handyman',
              isHandyman: true,
              handymanId: response.data.handymanId,
            }
          });
        }
        
        // Set localStorage flag to indicate handyman registration is complete
        localStorage.setItem("fixfinder_handyman_registered", "true");
        localStorage.setItem("handyman_user_id", response.data.userId);
        
        // Show success state
        setShowSuccess(true);
        
        // Navigate to homepage after a short delay to show both dashboard buttons
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        alert(response.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Show more specific error message if available
      if (error.response?.data?.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.join('\n');
        alert(`Registration failed:\n${errorMessages}`);
      } else {
        alert("There was an error completing your registration. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center py-8">
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 md:p-10 mt-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600">Your handyman registration has been completed successfully. You can now access handyman features.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center py-8">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6 md:p-10 mt-6">
        <h2 className="text-2xl md:text-2xl font-bold text-center text-gray-900">Handyman Registration</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
        <StepIndicator step={step} />
        <form id="handyman-registration-form" onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
          {step === 0 && (
            <Step1 data={personal} onChange={handlePersonalChange} clientData={clientData} />
          )}

          {step === 1 && (
            <Step2 photo={photo} onPhoto={handlePhoto} />
          )}

          {step === 2 && (
            <Step3
              services={services}
              otherService={otherService}
              onServiceChange={handleServiceChange}
              onOtherChange={handleOtherServiceChange}
              availableServices={availableServices}
            />
          )}

          {step === 3 && (
            <Step4
              data={personal}
              onInputChange={handlePersonalChange}
              certs={certs}
              onCertChange={handleCertChange}
              days={days}
              hours={hours}
              onDaysChange={handleDaysChange}
              onHoursChange={handleHoursChange}
              pay={pay}
              onPayChange={handlePayChange}
              otherPay={otherPay}
              onOtherPayChange={handleOtherPayChange}
              clientData={clientData}
            />
          )}
        </form>

        {/* Navigation buttons - moved outside form to prevent accidental submission */}
        <div className="flex justify-between mt-8">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              onMouseDown={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1 px-4 py-2 rounded bg-gray-100 text-gray-700 font-medium shadow hover:bg-gray-200 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              onMouseDown={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 px-7 py-2 rounded bg-green-500 text-white font-medium shadow hover:bg-green-600 transition"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              form="handyman-registration-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-2 rounded bg-green-500 text-white font-medium shadow hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandymanRegistration;
