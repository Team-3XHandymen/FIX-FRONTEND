import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ClientDashboardLayout from '@/components/client/ClientDashboardLayout';
import ChatInterface from '@/components/ui/chat/ChatInterface';

const ClientChatRoom: React.FC = () => {
  const { bookingId = '' } = useParams();
  const { user } = useUser();

  return (
    <ClientDashboardLayout title="Chat" subtitle="Conversation">
      <ChatInterface
        bookingId={bookingId}
        currentUserId={user?.id || ''}
        currentUserName={user?.fullName || user?.username || 'Client'}
        isOpen={true}
        userType="client"
      />
    </ClientDashboardLayout>
  );
};

export default ClientChatRoom;


