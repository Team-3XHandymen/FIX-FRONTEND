
import { useState, useCallback, useEffect } from "react";
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { HandymanAPI } from "@/lib/api";
import { socketService } from "@/lib/socket";
import RequestDetailsDialog from "../RequestDetailsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle, Eye, MessageSquare, Clock, User } from "lucide-react";

interface Booking {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'paid' | 'done' | 'completed';
  description: string;
  fee: number | null;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  clientId: string;
  clientName: string;
  providerId: string;
  serviceId: string;
  providerName: string;
  serviceName: string;
  scheduledTime: string;
  createdAt: string;
}

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

interface ClientRequestsProps {
  onStatusChange?: () => void;
}

const ClientRequests = ({ onStatusChange }: ClientRequestsProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Booking | null>(null);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const fetchBookings = useCallback(async (showRefreshing = false) => {
    if (!user) return;

    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const clerkUserId = user.id;
      const response = await HandymanAPI.getProviderBookingsByClerkUserId(clerkUserId);
      if (response.success) {
        setBookings(response.data || []);
      } else {
        // Failed to fetch bookings
        setBookings([]);
      }
    } catch (error) {
      // Failed to fetch provider bookings
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const fetchRecentChats = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setMessagesLoading(true);
      const response = await HandymanAPI.getUserChats(user.id, 'handyman');
      if (response.success) {
        setRecentChats(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    } finally {
      setMessagesLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBookings();
    fetchRecentChats();
    
    // Set up WebSocket listener for real-time updates
    if (user) {
      // Listen for booking status changes
      socketService.onBookingStatusChange((update) => {
        console.log('Handyman dashboard - Status change detected via WebSocket:', update);
        // Refresh bookings when status changes
        fetchBookings(true);
        // Notify parent component
        if (onStatusChange) {
          onStatusChange();
        }
      });

      // Cleanup WebSocket listeners
      return () => {
        socketService.removeAllListeners();
      };
    }
  }, [fetchBookings, fetchRecentChats, user, onStatusChange]);

  // Categorize bookings into three sections according to new layout
  const categorizedBookings = useCallback(() => {
    const actionRequired: Booking[] = []; // Bookings that need handyman action (pending, paid)
    const ongoing: Booking[] = []; // Ongoing bookings (accepted, done)
    const recent: Booking[] = []; // Recent/completed bookings (rejected, completed)

    console.log('Handyman Dashboard - Processing bookings:', bookings.map(b => ({ id: b._id, status: b.status })));

    bookings.forEach((booking) => {
      switch (booking.status) {
        case 'pending':
        case 'paid':
          // These need handyman action (review/accept or mark work done)
          actionRequired.push(booking);
          break;
        case 'accepted':
        case 'done':
          // These are ongoing bookings (work in progress)
          ongoing.push(booking);
          break;
        case 'rejected':
        case 'completed':
          // These are recent/completed bookings
          recent.push(booking);
          break;
        default:
          // Add any other statuses to ongoing
          ongoing.push(booking);
          break;
      }
    });

    console.log('Handyman Dashboard - Categorized results:', {
      actionRequired: actionRequired.map(b => ({ id: b._id, status: b.status })),
      ongoing: ongoing.map(b => ({ id: b._id, status: b.status })),
      recent: recent.map(b => ({ id: b._id, status: b.status }))
    });

    return { actionRequired, ongoing, recent };
  }, [bookings]);

  const { actionRequired, ongoing, recent } = categorizedBookings();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'paid':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'done':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'PENDING';
      case 'accepted':
        return 'ACCEPTED';
      case 'rejected':
        return 'REJECTED';
      case 'paid':
        return 'PAID';
      case 'done':
        return 'WORK DONE';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  };

  const getActionButtonText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Review & Respond';
      case 'paid':
        return 'Mark Work Done';
      case 'done':
        return 'View Details';
      default:
        return 'View Details';
    }
  };

  const getActionButtonStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'paid':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'done':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const handleStatusChange = useCallback(() => {
    console.log('Status change detected, refreshing bookings...');
    fetchBookings();
    if (onStatusChange) {
      console.log('Calling parent onStatusChange callback...');
      onStatusChange();
    }
  }, [fetchBookings, onStatusChange]);

  const handleManualRefresh = useCallback(() => {
    fetchBookings(true);
  }, [fetchBookings]);

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
    navigate(`/handyman/chat/${bookingId}`, { state: { booking: bookingState } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Your Bookings</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          {refreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* No bookings message */}
      {actionRequired.length === 0 && ongoing.length === 0 && recent.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No client requests yet</h3>
          <p className="text-gray-500">When clients book your services, they will appear here for you to review and respond.</p>
        </div>
      )}

      {/* Top Section: Action Required/Ongoing Bookings side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Action Required Bookings OR Ongoing Bookings */}
        <div className="lg:col-span-1">
          {actionRequired.length > 0 ? (
            // Show Action Required when there are bookings needing action
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">Action Required</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">{actionRequired.length} booking(s) need your attention</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {actionRequired.map(booking => (
                  <div key={booking._id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                              {getStatusDisplayText(booking.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Client:</span>
                              <span className="ml-2 font-medium text-gray-900">{booking.clientName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Location:</span>
                              <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
                            </div>
                            {booking.fee && (
                              <div>
                                <span className="text-gray-500">Fee:</span>
                                <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          ID: {booking._id}
                        </div>
                        <Button
                          className={`${getActionButtonStyle(booking.status)} px-6 py-2`}
                          onClick={() => setSelectedRequest(booking)}
                        >
                          {getActionButtonText(booking.status)}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : ongoing.length > 0 ? (
            // Show Ongoing Bookings when there are no Action Required bookings
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">Ongoing Bookings</h3>
              </div>
              
              <div className="space-y-4">
                {ongoing.map(booking => (
                  <div key={booking._id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                              {getStatusDisplayText(booking.status)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Client:</span>
                              <span className="ml-2 font-medium text-gray-900">{booking.clientName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Location:</span>
                              <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
                            </div>
                            {booking.fee && (
                              <div>
                                <span className="text-gray-500">Fee:</span>
                                <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          ID: {booking._id}
                        </div>
                        <Button
                          variant="outline"
                          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => setSelectedRequest(booking)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show empty state when no bookings
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No active bookings</p>
              <p className="text-sm text-gray-400">Client requests will appear here when they book your services</p>
            </div>
          )}
        </div>

        {/* Right Column: Recent Messages */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading messages...</p>
                </div>
              ) : recentChats.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No recent messages</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Messages will appear here when clients start chatting with you
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
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
                              {chat.booking?.providerName || 'Client'}
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Section: Ongoing Bookings (only show if Action Required section is displayed) */}
      {actionRequired.length > 0 && ongoing.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Ongoing Bookings</h3>
          </div>
          
          <div className="space-y-4">
            {ongoing.map(booking => (
              <div key={booking._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                          {getStatusDisplayText(booking.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Client:</span>
                          <span className="ml-2 font-medium text-gray-900">{booking.clientName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Scheduled:</span>
                          <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
                        </div>
                        {booking.fee && (
                          <div>
                            <span className="text-gray-500">Fee:</span>
                            <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      ID: {booking._id}
                    </div>
                    <Button
                      variant="outline"
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedRequest(booking)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section: Recent Bookings (Rejected and Completed) */}
      {recent.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
          </div>
          
          <div className="space-y-4">
            {recent.map(booking => (
              <div key={booking._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">{booking.serviceName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(booking.status)}`}>
                          {getStatusDisplayText(booking.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Client:</span>
                          <span className="ml-2 font-medium text-gray-900">{booking.clientName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 font-medium text-gray-900">{booking.location.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Scheduled:</span>
                          <span className="ml-2 font-medium text-gray-900">{formatDateTime(booking.scheduledTime)}</span>
                        </div>
                        {booking.fee && (
                          <div>
                            <span className="text-gray-500">Fee:</span>
                            <span className="ml-2 font-bold text-green-600">${booking.fee}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      ID: {booking._id}
                    </div>
                    <Button
                      variant="outline"
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setSelectedRequest(booking)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Request Details Dialog */}
      {selectedRequest && (
        <RequestDetailsDialog
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
          request={selectedRequest}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default ClientRequests;
