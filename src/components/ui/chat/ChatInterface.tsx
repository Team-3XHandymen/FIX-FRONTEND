import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { socketService, ChatMessage } from '../../../lib/socket';
import { ChatAPI, BookingsAPI } from '../../../lib/api';
import { Paperclip, Send, Image as ImageIcon, X, ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react';
import CallButton from '../call/CallButton';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChatInterfaceProps {
  bookingId: string;
  currentUserId: string;
  currentUserName: string;
  isOpen: boolean;
  userType: 'client' | 'provider';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  bookingId,
  currentUserId,
  currentUserName,
  isOpen,
  userType,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load booking details and messages when component mounts
  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingDetails();
      loadChatMessages();
      markMessagesAsRead();
    }
  }, [isOpen, bookingId]);

  // Setup WebSocket connection and listeners
  useEffect(() => {
    if (isOpen && bookingId) {
      // Join the booking room
      socketService.joinBookingRoom(bookingId);
      setIsConnected(socketService.getConnectionStatus());

      // Listen for incoming messages
      socketService.onChatMessage((message: ChatMessage) => {
        console.log('💬 Received WebSocket message:', message);
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => 
            msg.senderId === message.senderId && 
            msg.message === message.message && 
            Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
          );
          if (exists) {
            console.log('💬 Message already exists, skipping duplicate');
            return prev;
          }
          
          // If this is a message from the current user, don't add it again
          // (it was already added locally for instant feedback)
          if (message.senderId === currentUserId) {
            console.log('💬 Skipping own message from WebSocket');
            return prev;
          }
          
          console.log('💬 Adding new message to state, total messages:', prev.length + 1);
          return [...prev, message];
        });
      });

      // Listen for connection status changes
      const checkConnection = setInterval(() => {
        setIsConnected(socketService.getConnectionStatus());
      }, 2000);

      return () => {
        clearInterval(checkConnection);
        socketService.leaveBookingRoom(bookingId);
        socketService.removeAllListeners();
      };
    }
  }, [isOpen, bookingId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadBookingDetails = async () => {
    if (!user?.id) {
      console.error('❌ User not authenticated');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const headers = {
        'X-User-ID': user.id,
        'X-User-Type': userType,
      };
      
      console.log('🔍 Loading booking details with headers:', headers);
      console.log('🔍 API URL:', `${API_BASE_URL}/bookings/${bookingId}`);
      
      const response = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`, {
        headers,
        withCredentials: true,
      });
      
      if (response.data.success && response.data.data) {
        const bookingData = response.data.data;
        console.log('📋 Booking data received:', bookingData);
        setBooking(bookingData);
        
        // Load other user details based on user type
        if (userType === 'client') {
          // For client, display provider details
          setOtherUser({
            name: bookingData.providerName || 'Provider',
            profileImage: bookingData.providerProfileImage || '/placeholder-avatar.png'
          });
        } else {
          // For provider, display client details - try to get actual client name
          console.log('🔍 Client name from booking:', bookingData.clientName);
          let clientName = bookingData.clientName;
          
          // If clientName is missing or generic, try to fetch client details
          if (!clientName || clientName === 'Client') {
            try {
              const clientResponse = await axios.get(`${API_BASE_URL}/clients/${bookingData.clientId}`, {
                headers,
                withCredentials: true,
              });
              if (clientResponse.data.success && clientResponse.data.data) {
                clientName = clientResponse.data.data.name || clientResponse.data.data.username || 'Client';
                console.log('✅ Fetched client name:', clientName);
              }
            } catch (err) {
              console.error('❌ Failed to fetch client details:', err);
            }
          }
          
          setOtherUser({
            name: clientName || 'Client',
            profileImage: bookingData.clientProfileImage || '/placeholder-avatar.png'
          });
        }
      }
    } catch (error) {
      console.error('❌ Failed to load booking details:', error);
      // Continue without booking details
    }
  };

  const markMessagesAsRead = async () => {
    if (!user?.id) {
      console.error('❌ User not authenticated for mark as read');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const headers = {
        'X-User-ID': user.id,
        'X-User-Type': userType,
      };
      
      console.log('📖 Marking messages as read with headers:', headers);
      console.log('📖 Request body:', { userId: user.id, userType });
      
      await axios.post(`${API_BASE_URL}/chat/${bookingId}/mark-read`, {
        userId: user.id,
        userType: userType,
      }, {
        headers,
        withCredentials: true,
      });
      console.log('📖 Messages marked as read successfully');
    } catch (error) {
      console.error('❌ Failed to mark messages as read:', error);
    }
  };

  const loadChatMessages = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Loading chat messages for booking:', bookingId);
      const response = await ChatAPI.getChatMessages(bookingId);
      console.log('📥 Chat API response:', response);
      if (response.success && response.data.messages) {
        console.log('📥 Setting messages from API:', response.data.messages.length, 'messages');
        setMessages(response.data.messages);
      } else {
        console.log('📥 No messages found or API error');
      }
    } catch (error) {
      console.error('❌ Failed to load chat messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !isConnected) return;

    setIsUploading(true);

    try {
      let messageText = newMessage.trim();
      
      // If there's a file, upload it and mention it in the message
      if (selectedFile) {
        // For now, just mention the file in the message
        // In production, you'd upload to cloud storage and include the URL
        messageText = messageText || `📎 ${selectedFile.name}`;
      }

      const messageData = {
        bookingId,
        senderId: currentUserId,
        senderName: currentUserName,
        message: messageText,
      };

      // Create the message object with timestamp
      const newMessageObj = {
        ...messageData,
        timestamp: new Date(),
      };

      // Add message to local state immediately for instant feedback
      setMessages(prev => [...prev, newMessageObj]);

      // Try to send via WebSocket first
      const sent = socketService.sendMessage(messageData);
      
      if (!sent) {
        // Fallback to API if WebSocket fails
        try {
          await ChatAPI.sendMessage(messageData);
        } catch (error) {
          console.error('Failed to send message via API:', error);
          // Remove the message from local state if API fails
          setMessages(prev => prev.filter(msg => 
            !(msg.senderId === messageData.senderId && 
              msg.message === messageData.message && 
              Math.abs(new Date(msg.timestamp).getTime() - newMessageObj.timestamp.getTime()) < 1000)
          ));
          return;
        }
      }

      setNewMessage('');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] bg-gray-50 rounded-lg border border-gray-200">
      {/* Chat Header with Booking Details */}
      <div className="p-3 border-b border-gray-200 bg-white rounded-t-lg flex-shrink-0">
        {/* Back to Dashboard Button */}
        <div className="mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(userType === 'client' ? '/client/dashboard' : '/handyman/dashboard')}
            className="flex items-center gap-2 h-7 text-xs"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Dashboard
          </Button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium text-gray-900 text-sm">Chat Room</span>
          </div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Booking Details - Compact 2-Column Layout */}
        {booking && (
          <div className="p-3 bg-gray-50 rounded-lg">
            {/* Top row: Avatar, Name, Status badge */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-base font-semibold">
                {otherUser?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{otherUser?.name || 'User'}</div>
                <div className="text-xs text-gray-600">{userType === 'client' ? 'Service Provider' : 'Client'}</div>
              </div>
              <div className="flex items-center gap-2">
                {booking.status && (
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    booking.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status.toUpperCase()}
                  </div>
                )}
                {/* Voice Call Button */}
                <CallButton
                  bookingId={bookingId}
                  userType={userType}
                  otherPartyName={otherUser?.name}
                />
              </div>
            </div>

            {/* Details in 2 columns */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Job:</span>
                <span className="ml-1 font-medium text-gray-900">{booking.description || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Date:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'N/A'}
                </span>
              </div>
              {booking.fee && (booking.status === 'accepted' || booking.status === 'paid' || booking.status === 'done' || booking.status === 'completed') && (
                <div className="col-span-2">
                  <span className="text-gray-500">Fee:</span>
                  <span className="ml-1 font-bold text-green-600">${booking.fee}</span>
                </div>
              )}
              {booking.scheduledTime && (
                <div className="col-span-2">
                  <span className="text-gray-500">Time:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {new Date(booking.scheduledTime).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500 text-center">
              <div className="text-lg mb-2">💬</div>
              <div>No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const isImage = message.message.startsWith('📎');
            const isFromCurrentUser = message.senderId === currentUserId;
            
            return (
              <div
                key={index}
                className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isFromCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.senderName}
                  </div>
                  {isImage ? (
                    <div className="text-xs italic opacity-80">
                      {message.message}
                    </div>
                  ) : (
                    <div className="text-sm">{message.message}</div>
                  )}
                  <div className={`text-xs mt-1 ${
                    isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input with File Upload */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg flex-shrink-0">
        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
            <ImageIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700 flex-1 truncate">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          {/* File Upload Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected || isUploading}
            className="px-3"
            title="Upload image"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
            className="hidden"
          />

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected || isUploading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || !isConnected || isUploading}
            size="sm"
            className="px-4"
          >
            {isUploading ? 'Sending...' : <Send className="h-4 w-4" />}
          </Button>
        </div>
        {!isConnected && (
          <div className="text-xs text-red-500 mt-2">
            Connection lost. Trying to reconnect...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
