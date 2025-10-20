import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import HandymanDashboardLayout from '@/components/handyman/HandymanDashboardLayout';
import ChatInterface from '@/components/ui/chat/ChatInterface';

const HandymanChatRoom: React.FC = () => {
  const { bookingId = '' } = useParams();
  const { user } = useUser();

  return (
    <HandymanDashboardLayout title="Chat">
      <ChatInterface
        bookingId={bookingId}
        currentUserId={user?.id || ''}
        currentUserName={user?.fullName || user?.username || 'Handyman'}
        isOpen={true}
      />
    </HandymanDashboardLayout>
  );
};

export default HandymanChatRoom;


