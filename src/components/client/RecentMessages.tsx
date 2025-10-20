import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { MessageSquare, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClientAPI } from '@/lib/api';

interface ChatMessage {
  senderName: string;
  message: string;
  timestamp: string;
}

interface RecentChat {
  bookingId: string;
  lastMessage: ChatMessage | null;
  lastMessageAt: string;
  booking: {
    serviceName: string;
    providerName: string;
    status: string;
    scheduledTime: string;
  } | null;
  unreadCount: number;
}

const RecentMessages: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await ClientAPI.getUserChats(user.id, 'client');
        if (response.success) {
          setRecentChats(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching recent chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentChats();
  }, [user?.id]);

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown';
    }
  };

  const handleChatClick = (chat: RecentChat) => {
    const bookingId = chat.bookingId;
    const bookingState = chat.booking ? {
      handyman: chat.booking.providerName,
      service: chat.booking.serviceName,
      status: chat.booking.status,
      time: new Date(chat.booking.scheduledTime || chat.lastMessageAt).toLocaleTimeString(),
      date: new Date(chat.booking.scheduledTime || chat.lastMessageAt).toLocaleDateString(),
      id: bookingId,
    } : undefined;
    navigate(`/client/chat/${bookingId}`, { state: { booking: bookingState } });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentChats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No recent messages</p>
            <p className="text-xs text-gray-400 mt-1">
              Messages will appear here when you start chatting with handymen
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentChats.slice(0, 5).map((chat) => (
          <div
            key={chat.bookingId}
            onClick={() => handleChatClick(chat)}
            className="p-4 bg-orange-50/80 border-2 border-orange-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-300 hover:bg-orange-100/60 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm truncate">
                    {chat.booking?.providerName || 'Unknown Handyman'}
                  </span>
                  {chat.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {chat.booking?.serviceName || 'Service Request'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatTime(chat.lastMessageAt)}
              </div>
            </div>
            
            {chat.lastMessage && (
              <div className="mt-2">
                <p className="text-sm text-gray-800 line-clamp-2">
                  <span className="font-medium">{chat.lastMessage.senderName}:</span>{' '}
                  {chat.lastMessage.message}
                </p>
              </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  chat.booking?.status === 'pending' ? 'border-yellow-200 text-yellow-700' :
                  chat.booking?.status === 'accepted' ? 'border-green-200 text-green-700' :
                  chat.booking?.status === 'rejected' ? 'border-red-200 text-red-700' :
                  'border-gray-200 text-gray-700'
                }`}
              >
                {chat.booking?.status?.toUpperCase() || 'UNKNOWN'}
              </Badge>
              <Button variant="secondary" size="sm" className="text-xs h-7 px-3">
                View Chat
              </Button>
            </div>
          </div>
        ))}
        
        {recentChats.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" className="text-xs">
              View All Messages ({recentChats.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMessages;
