import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, PhoneCall, Video, Smile } from "lucide-react";
import ClientDashboardLayout from "@/components/client/ClientDashboardLayout";
import { Button } from "@/components/ui/button";
const serviceImage = "/lovable-uploads/dee4bc78-008e-48fe-9a6d-0a851f0e0b58.png";
const currentUser = {
  name: "You",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};
const handymanUser = {
  name: "Handyman",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};

// The chat page expects booking data via location.state.
const ClientChat = () => {
  const {
    state
  } = useLocation() as {
    state: {
      booking: any;
    };
  };
  const {
    bookingId
  } = useParams();
  const navigate = useNavigate();

  // For this demo, just use the booking passed in (add null check for robustness)
  const booking = state?.booking;

  // Provide fake conversation messages, order info always at the top
  const [messages, setMessages] = useState<any[]>([{
    id: "order-info",
    sender: "ORDER_INFO",
    order: {
      image: serviceImage,
      title: booking?.service || "Service",
      description: booking?.description || "Service description",
      date: booking?.date || "",
      time: booking?.time || "",
      price: booking?.price || "",
      bookingId: booking?.id || "",
      handyman: booking?.handyman || ""
    }
  }, {
    id: 1,
    sender: "You",
    text: "Hi, I just wanted to check if you have all the details for my booking?",
    timestamp: "11/09/2024 09:15",
    read: true
  }, {
    id: 2,
    sender: "Handyman",
    text: "Hello! Yes, I see your booking for the service. I’ll be there on time.",
    timestamp: "11/09/2024 09:16",
    read: true
  }, {
    id: 3,
    sender: "You",
    text: "Great! Let me know if you need any information from my side.",
    timestamp: "11/09/2024 09:17",
    read: true
  }, {
    id: 4,
    sender: "Handyman",
    text: "Thanks! I will bring all necessary tools. Looking forward to it.",
    timestamp: "11/09/2024 09:18",
    read: true
  }]);
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "You",
      text: input,
      timestamp: new Date().toLocaleString(),
      read: true
    }]);
    setInput("");
  };
  if (!booking) {
    // No booking data, go back.
    return <div className="flex flex-col items-center justify-center h-96">
        <p>No booking selected for chat.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>;
  }
  return <ClientDashboardLayout title={booking.handyman} subtitle="Chat">
      <div className="max-w-2xl mx-auto relative flex flex-col h-[80vh] border border-gray-200 rounded-xl overflow-hidden bg-[#fafdff] shadow">
        {/* Header with back arrow, name, call options and Rate Service button */}
        <div className="flex items-center bg-white px-4 py-3 border-b border-gray-100 justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black">
              <ArrowLeft size={20} />
            </button>
            <span className="font-semibold text-lg">{booking.handyman}</span>
            {/* Call options */}
            <button aria-label="Voice Call" className="rounded-full p-2 transition-colors bg-green-600 hover:bg-green-500 text-zinc-50">
              <PhoneCall className="text-gray-500" size={20} />
            </button>
            <button aria-label="Video Call" className="rounded-full p-2 transition-colors bg-green-600 hover:bg-green-500">
              <Video className="text-gray-500" size={20} />
            </button>
          </div>
          {/* Rate Service Button */}
          <Button variant="outline" className="font-medium text-yellow-600 border-yellow-400 bg-yellow-100 hover:bg-yellow-200">
            ★ Rate Service
          </Button>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#fafdff]">
          {/* Show the initial booking (service) details as a special message */}
          <div className="flex justify-start">
            <div className="bg-white rounded-lg shadow p-3 max-w-xs flex flex-col w-full">
              <div className="font-medium text-base mb-1">Order Information</div>
              <div className="flex items-center mb-2">
                <img src={serviceImage} alt="Service" className="w-14 h-14 rounded object-cover mr-3 border" />
                <div>
                  <div className="font-semibold">{booking.service}</div>
                  <div className="text-gray-500 text-xs">{booking.description}</div>
                </div>
              </div>
              <div className="text-xs pt-1 pb-1">
                <div><span className="font-semibold">Booking ID:</span> {booking.id}</div>
                <div><span className="font-semibold">Date:</span> {booking.date}</div>
                <div><span className="font-semibold">Time:</span> {booking.time}</div>
                <div><span className="font-semibold">Price:</span> {booking.price}</div>
              </div>
            </div>
          </div>
          {messages.filter(m => m.sender !== "ORDER_INFO").map(msg => <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end max-w-xs ${msg.sender === "You" ? "flex-row-reverse" : ""}`}>
                  <img src={msg.sender === "You" ? currentUser.avatar : handymanUser.avatar} alt={msg.sender} className="w-8 h-8 object-cover rounded-full ml-2" />
                  <div className={`rounded-xl px-4 py-2 ${msg.sender === "You" ? "bg-orange-100 text-gray-700" : "bg-white text-gray-900"} shadow-sm`}>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {msg.timestamp ? msg.timestamp : ""}
                      {msg.read && <span className="ml-2 text-green-600">Read</span>}
                    </div>
                  </div>
                </div>
              </div>)}
        </div>

        {/* Bottom bar and input */}
        <div className="bg-white border-t px-3 py-2 flex items-center gap-2">
          {/* Add emoji icon on the left */}
          <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors" tabIndex={-1} aria-label="Add emoji">
            <Smile className="text-gray-400" size={22} />
          </button>
          <form className="flex flex-1 items-center" onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}>
            <input type="text" placeholder="Type your message..." className="flex-1 border-none outline-none bg-transparent px-2 text-base" value={input} onChange={e => setInput(e.target.value)} />
            <Button type="submit" size="icon" className="bg-orange-500 hover:bg-orange-600 text-white ml-2 rounded-full">
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
    </ClientDashboardLayout>;
};
export default ClientChat;