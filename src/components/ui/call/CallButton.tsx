import React, { useState, useEffect, useRef } from 'react';
import { Device as TwilioDevice } from '@twilio/voice-sdk';
import { Button } from '../button';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import { CallAPI } from '../../../lib/api';
import { useUser } from '@clerk/clerk-react';

// Using npm package @twilio/voice-sdk (no dynamic CDN load needed)

interface CallButtonProps {
  bookingId: string;
  userType: 'client' | 'provider';
  otherPartyName?: string;
}

const CallButton: React.FC<CallButtonProps> = ({ bookingId, userType, otherPartyName }) => {
  const { user } = useUser();
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const deviceRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const registeredRef = useRef<boolean>(false);
  const [twilioLoaded, setTwilioLoaded] = useState(false);

  // Mark Twilio as loaded (using npm module)
  useEffect(() => {
    setTwilioLoaded(true);
  }, []);

  // Request microphone permission first
  const requestMicrophonePermission = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      console.log('✅ Microphone permission granted');
      return stream;
    } catch (error: any) {
      console.error('❌ Microphone permission denied:', error);
      setCallError('Microphone permission is required for voice calls');
      return null;
    }
  };

  // Setup device and listen for incoming calls
  useEffect(() => {
    if (!twilioLoaded || !user?.id) return;

    const initializeTwilio = async () => {
      try {
        if (!user?.id) return;
        
        // Request microphone permission first
        const stream = await requestMicrophonePermission();
        if (!stream) {
          console.warn('⚠️ Microphone permission not granted - will request when call is initiated');
          return;
        }
        
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        
        // Get access token
        const tokenResponse = await fetch(`${API_BASE_URL}/calls/token?userType=${userType}`, {
          headers: {
            'X-User-ID': user.id,
            'X-User-Type': userType,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.message || `Failed to get token: ${tokenResponse.status}`);
        }
        
        const tokenData = await tokenResponse.json();
        if (!tokenData.success || !tokenData.data) {
          console.error('❌ Token response:', tokenData);
          const errorMsg = tokenData.message || 'Failed to get access token';
          if (errorMsg.includes('API Key') || errorMsg.includes('credentials')) {
            setCallError('Twilio API Key not configured. Check backend .env file. See TWILIO_API_KEY_SETUP.md');
          }
          throw new Error(errorMsg);
        }

        const { token, identity } = tokenData.data;
        console.log('✅ Received token, identity:', identity);
        console.log('🔍 Token preview:', token.substring(0, 50) + '...');

        // Initialize device with token (from npm module)
        const Device = TwilioDevice;
        
        // Stop the permission stream as Device will manage its own
        stream.getTracks().forEach(track => track.stop());
        
        // Initialize Device with token
        // The Device will handle getUserMedia internally when needed
        deviceRef.current = new Device(token, {
          codecPreferences: ['opus', 'pcmu'],
          logLevel: 1, // Enable debug logging
          // Allow the device to request microphone when connecting
          allowIncomingWhileBusy: true,
        });

        // Track device registration state (persist across handlers)
        registeredRef.current = false;

        // Setup event listeners (v2 uses 'registered')
        deviceRef.current.on('registered', () => {
          console.log('📞 Twilio device registered');
          registeredRef.current = true;
        });
        deviceRef.current.on('unregistered', () => {
          console.log('📴 Twilio device unregistered');
          registeredRef.current = false;
        });

        deviceRef.current.on('error', (error: any) => {
          console.error('❌ Twilio device error:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            name: error.name,
          });
          
          // Only show error if it's not about missing API keys (that's shown separately)
          if (error.code !== 31202 && error.code !== 20151) {
            setCallError(error.message || 'Call error occurred');
          } else {
            setCallError('Invalid Twilio credentials. Please check API Key settings in backend.');
          }
          setIsCalling(false);
          setIsInCall(false);
        });

        // Listen for incoming calls
        deviceRef.current.on('incoming', (connection: any) => {
          console.log('📞 Incoming call');
          setIsCalling(true);
          callRef.current = connection;

          connection.on('accept', () => {
            setIsCalling(false);
            setIsInCall(true);
          });

          connection.on('disconnect', () => {
            setIsCalling(false);
            setIsInCall(false);
            callRef.current = null;
          });

          connection.on('cancel', () => {
            setIsCalling(false);
            callRef.current = null;
          });

          // Auto-accept for testing (remove in production or add UI)
          // connection.accept();
        });

        // Listen for outgoing call events
        deviceRef.current.on('connect', (connection: any) => {
          console.log('📞 Call connected');
          setIsCalling(false);
          setIsInCall(true);
          callRef.current = connection;

          connection.on('disconnect', () => {
            setIsInCall(false);
            callRef.current = null;
          });
        });
        // Register the device with Twilio (required in v2)
        try {
          await deviceRef.current.register();
        } catch (e) {
          console.error('❌ Failed to register Twilio device:', e);
          setCallError('Failed to register calling service');
          return;
        }

      } catch (error: any) {
        console.error('❌ Failed to initialize Twilio:', error);
        setCallError(error.message || 'Failed to initialize calling');
      }
    };

    initializeTwilio();

    return () => {
      if (callRef.current) {
        callRef.current.disconnect();
      }
      if (deviceRef.current) {
        deviceRef.current.destroy();
      }
    };
  }, [twilioLoaded, user?.id, userType]);

  const handleCall = async () => {
    if (!user?.id || !bookingId || !twilioLoaded) {
      setCallError('Missing required information');
      return;
    }

    // Check if device is ready
    if (!deviceRef.current) {
      setCallError('Call service not initialized. Please refresh the page.');
      return;
    }

    try {
      setCallError(null);
      setIsCalling(true);

      // Wait for device to be registered if not already
      if (!registeredRef.current) {
        console.warn('⚠️ Device not registered yet');
        console.log('⏳ Waiting for device to register...');
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Device initialization timeout. Please refresh and try again.'));
          }, 10000);
          const onRegistered = () => {
            clearTimeout(timeout);
            console.log('✅ Device is now registered');
            deviceRef.current?.off?.('registered', onRegistered);
            deviceRef.current?.off?.('error', onErrorOnce);
            resolve();
          };
          const onErrorOnce = (err: any) => {
            clearTimeout(timeout);
            deviceRef.current?.off?.('registered', onRegistered);
            reject(err);
          };
          deviceRef.current?.on('registered', onRegistered);
          deviceRef.current?.once?.('error', onErrorOnce);
        });
      }
      
      console.log('✅ Device registered, proceeding with call...');

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      
      // Get contact info
      const contactResponse = await fetch(`${API_BASE_URL}/calls/contact/${bookingId}`, {
        headers: {
          'X-User-ID': user.id,
          'X-User-Type': userType,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!contactResponse.ok) {
        throw new Error(`Failed to get contact: ${contactResponse.status}`);
      }
      
      const contactData = await contactResponse.json();
      if (!contactData.success || !contactData.data) {
        throw new Error(contactData.message || 'Failed to get contact information');
      }

      const { otherPartyIdentity } = contactData.data;
      console.log('📞 Calling identity:', otherPartyIdentity);

      // Initiate call record in backend
      await fetch(`${API_BASE_URL}/calls/initiate`, {
        method: 'POST',
        headers: {
          'X-User-ID': user.id,
          'X-User-Type': userType,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
        credentials: 'include',
      });

      // Make the call using Twilio Device
      // Device.connect will automatically request getUserMedia if needed
      if (deviceRef.current) {
        console.log('📞 Connecting to:', otherPartyIdentity);
        const connection = deviceRef.current.connect({
          To: otherPartyIdentity,
        });

        callRef.current = connection;

        connection.on('disconnect', () => {
          console.log('📞 Call disconnected');
          setIsCalling(false);
          setIsInCall(false);
          callRef.current = null;
        });

        connection.on('error', (error: any) => {
          console.error('❌ Connection error:', error);
          setCallError(error.message || 'Call failed');
          setIsCalling(false);
        });
      } else {
        throw new Error('Device not initialized');
      }
    } catch (error: any) {
      console.error('❌ Failed to make call:', error);
      setCallError(error.message || 'Failed to initiate call');
      setIsCalling(false);
    }
  };

  const handleEndCall = () => {
    if (callRef.current) {
      callRef.current.disconnect();
      callRef.current = null;
      setIsInCall(false);
      setIsCalling(false);
    }
  };

  const handleToggleMute = () => {
    if (callRef.current) {
      if (isMuted) {
        callRef.current.mute(false);
        setIsMuted(false);
      } else {
        callRef.current.mute(true);
        setIsMuted(true);
      }
    }
  };

  if (!twilioLoaded) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="flex items-center gap-2"
      >
        <Phone className="h-4 w-4" />
        Loading...
      </Button>
    );
  }

  if (isInCall) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleMute}
          className="flex items-center gap-2"
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleEndCall}
          className="flex items-center gap-2"
        >
          <PhoneOff className="h-4 w-4" />
          End Call
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={handleCall}
        disabled={isCalling}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        <Phone className="h-4 w-4" />
        {isCalling ? 'Calling...' : `Call ${otherPartyName || 'User'}`}
      </Button>
      {callError && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {callError}
        </div>
      )}
    </div>
  );
};

export default CallButton;

