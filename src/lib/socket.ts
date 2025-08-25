import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

export interface BookingStatusUpdate {
  bookingId: string;
  newStatus: string;
  userId: string;
  timestamp: Date;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  // Connect to WebSocket server
  connect() {
    if (this.socket && this.isConnected) {
      console.log('🔌 Already connected to WebSocket');
      return;
    }

    try {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket'],
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('🔌 Connected to WebSocket server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Disconnected from WebSocket server');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔌 WebSocket connection error:', error);
        this.isConnected = false;
      });

    } catch (error) {
      console.error('🔌 Failed to connect to WebSocket:', error);
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Disconnected from WebSocket server');
    }
  }

  // Join a specific booking room for chat
  joinBookingRoom(bookingId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn('🔌 WebSocket not connected, attempting to connect...');
      this.connect();
      // Wait a bit for connection to establish
      setTimeout(() => {
        if (this.socket && this.isConnected) {
          this.socket.emit('join_booking_room', bookingId);
        }
      }, 1000);
      return;
    }

    this.socket.emit('join_booking_room', bookingId);
    console.log(`📱 Joined booking room: ${bookingId}`);
  }

  // Leave a booking room
  leaveBookingRoom(bookingId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_booking_room', bookingId);
      console.log(`📱 Left booking room: ${bookingId}`);
    }
  }

  // Send a chat message
  sendMessage(data: {
    bookingId: string;
    senderId: string;
    senderName: string;
    message: string;
  }) {
    if (!this.socket || !this.isConnected) {
      console.error('🔌 WebSocket not connected');
      return false;
    }

    this.socket.emit('send_message', {
      ...data,
      timestamp: new Date(),
    });
    console.log(`💬 Message sent: ${data.message}`);
    return true;
  }

  // Send booking status update
  sendBookingStatusUpdate(data: {
    bookingId: string;
    newStatus: string;
    userId: string;
  }) {
    if (!this.socket || !this.isConnected) {
      console.error('🔌 WebSocket not connected');
      return false;
    }

    this.socket.emit('booking_status_update', {
      ...data,
      timestamp: new Date(),
    });
    console.log(`🔄 Status update sent: ${data.newStatus}`);
    return true;
  }

  // Listen for incoming chat messages
  onChatMessage(callback: (message: ChatMessage) => void) {
    if (!this.socket) {
      console.error('🔌 WebSocket not connected');
      return;
    }

    this.socket.on('receive_message', (message: ChatMessage) => {
      console.log('💬 Received message:', message);
      callback(message);
    });
  }

  // Listen for booking status changes
  onBookingStatusChange(callback: (update: BookingStatusUpdate) => void) {
    if (!this.socket) {
      console.error('🔌 WebSocket not connected');
      return;
    }

    this.socket.on('booking_status_changed', (update: BookingStatusUpdate) => {
      console.log('🔄 Received status update:', update);
      callback(update);
    });
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
      console.log('🔌 Removed all WebSocket listeners');
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create and export a singleton instance
export const socketService = new SocketService();

// Auto-connect when the service is imported
if (typeof window !== 'undefined') {
  socketService.connect();
}
