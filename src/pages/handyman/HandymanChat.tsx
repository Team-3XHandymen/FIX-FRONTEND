
import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, PhoneCall, Video, Smile } from "lucide-react";
import HandymanDashboardLayout from "@/components/handyman/HandymanDashboardLayout";
import { Button } from "@/components/ui/button";

const serviceImage = "/lovable-uploads/dee4bc78-008e-48fe-9a6d-0a851f0e0b58.png";
const handymanUser = {
  name: "You",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
};
const clientUser = {
  name: "Client",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg"
};

const HandymanChat = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  // Mock messages for demo
  const [messages, setMessages] = useState([
    {
      id: "order-info",
      sender: "ORDER_INFO",
      order: {
        image: serviceImage,
        title: "Plumbing Repair",
        description: "Fix leaking kitchen sink",
        date: "Jan 23",
        time: "2:00 PM",
        price: "$125.00",
        bookingId: "1",
      }
    },
    {
      id: 1,
      sender: "Client",
      text: "Hi, I just wanted to check if you have all the details for my booking?",
      timestamp: "11/09/2024 09:15",
      read: true
    },
    {
      id: 2,
      sender: "You",
      text: "Hello! Yes, I see your booking for the service. I'll be there on time.",
      timestamp: "11/09/2024 09:16",
      read: true
    }
  ]);
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

  return (
    <HandymanDashboardLayout title="Chat">
      <div className="max-w-2xl mx-auto relative flex flex-col h-[80vh] border border-gray-200 rounded-xl overflow-hidden bg-[#fafdff] shadow">
        {/* Header */}
        <div className="flex items-center bg-white px-4 py-3 border-b border-gray-100 justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black">
              <ArrowLeft size={20} />
            </button>
            <span className="font-semibold text-lg">Client</span>
            <button aria-label="Voice Call" className="rounded-full p-2 transition-colors bg-green-600 hover:bg-green-500 text-zinc-50">
              <PhoneCall className="text-zinc-50" size={20} />
            </button>
            <button aria-label="Video Call" className="rounded-full p-2 transition-colors bg-green-600 hover:bg-green-500 text-zinc-50">
              <Video className="text-zinc-50" size={20} />
            </button>
          </div>
          <Button variant="outline" className="font-medium text-yellow-600 border-yellow-400 bg-yellow-100 hover:bg-yellow-200">
            ★ Rate Client
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Order info card */}
          {messages.map(msg => {
            if (msg.sender === "ORDER_INFO") {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-white rounded-lg shadow p-3 max-w-xs flex flex-col w-full">
                    <div className="font-medium text-base mb-1">Order Information</div>
                    <div className="flex items-center mb-2">
                      <img src={msg.order.image} alt="Service" className="w-14 h-14 rounded object-cover mr-3 border" />
                      <div>
                        <div className="font-semibold">{msg.order.title}</div>
                        <div className="text-gray-500 text-xs">{msg.order.description}</div>
                      </div>
                    </div>
                    <div className="text-xs pt-1 pb-1">
                      <div><span className="font-semibold">Booking ID:</span> {msg.order.bookingId}</div>
                      <div><span className="font-semibold">Date:</span> {msg.order.date}</div>
                      <div><span className="font-semibold">Time:</span> {msg.order.time}</div>
                      <div><span className="font-semibold">Price:</span> {msg.order.price}</div>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end max-w-xs ${msg.sender === "You" ? "flex-row-reverse" : ""}`}>
                  <img 
                    src={msg.sender === "You" ? handymanUser.avatar : clientUser.avatar} 
                    alt={msg.sender} 
                    className="w-8 h-8 object-cover rounded-full ml-2" 
                  />
                  <div className={`rounded-xl px-4 py-2 ${msg.sender === "You" ? "bg-orange-100 text-gray-700" : "bg-white text-gray-900"} shadow-sm`}>
                    <div className="text-sm">{msg.text}</div>
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {msg.timestamp}
                      {msg.read && <span className="ml-2 text-green-600">Read</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input area */}
        <div className="bg-white border-t px-3 py-2 flex items-center gap-2">
          <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition-colors" tabIndex={-1} aria-label="Add emoji">
            <Smile className="text-gray-400" size={22} />
          </button>
          <form className="flex flex-1 items-center" onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border-none outline-none bg-transparent px-2 text-base" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <Button type="submit" size="icon" className="bg-orange-500 hover:bg-orange-600 text-white ml-2 rounded-full">
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
    </HandymanDashboardLayout>
  );
};

export default HandymanChat;
