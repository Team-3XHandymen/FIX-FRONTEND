import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../button';
import { Input } from '../input';
import { socketService, ChatMessage } from '../../../lib/socket';
import { ChatAPI } from '../../../lib/api';

interface ChatInterfaceProps {
  bookingId: string;
  currentUserId: string;
  currentUserName: string;
  isOpen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  bookingId,
  currentUserId,
  currentUserName,
  isOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing messages when component mounts
  useEffect(() => {
    if (isOpen && bookingId) {
      loadChatMessages();
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
    if (!newMessage.trim() || !isConnected) return;

    const messageData = {
      bookingId,
      senderId: currentUserId,
      senderName: currentUserName,
      message: newMessage.trim(),
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
    <div className="flex flex-col h-96 bg-gray-50 rounded-lg border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium text-gray-900">Chat</span>
        </div>
        <span className="text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.senderName}
                </div>
                <div className="text-sm">{message.message}</div>
                <div className={`text-xs mt-1 ${
                  message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
            className="px-4"
          >
            Send
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
