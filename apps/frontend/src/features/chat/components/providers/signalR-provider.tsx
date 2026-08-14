'use client';

import { aspApiUrl } from '@/constants';
import {
    HubConnection,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

interface SignalRContextValue {
    connection: HubConnection | null;
    isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextValue | undefined>(
    undefined
);

export default function SignalRProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${aspApiUrl!}/chat`, {
                withCredentials: true,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(LogLevel.Information)
            .build();

        newConnection.onreconnecting(() => {
            if (!cancelled) {
                setIsConnected(false);
            }
        });

        newConnection.onreconnected(() => {
            if (!cancelled) {
                setIsConnected(true);
            }
        });

        newConnection.onclose(() => {
            if (!cancelled) {
                setIsConnected(false);
            }
        });

        setConnection(newConnection);

        return () => {
            cancelled = true;

            setIsConnected(false);

            newConnection.stop().catch(() => { });
        };
    }, []);

    useEffect(() => {
        if (!connection) return;

        let cancelled = false;

        const startConnection = async () => {
            try {
                if (connection.state !== 'Disconnected') {
                    return;
                }

                await connection.start();

                if (!cancelled) {
                    setIsConnected(true);
                    console.log('SignalR connected');
                }
            } catch (error) {
                if (!cancelled) {
                    setIsConnected(false);

                    console.error(
                        'SignalR connection failed:',
                        error
                    );
                }
            }
        };

        startConnection();

        return () => {
            cancelled = true;
        };
    }, [connection]);

    
    useEffect(() => {
        const unlockAudio = () => {
            const a = new Audio("/sounds/notification.mp3");
            a.volume = 0;
            a.play().then(() => a.pause()).catch(() => { });
            document.removeEventListener("click", unlockAudio);
        };
        document.addEventListener("click", unlockAudio);
        return () => document.removeEventListener("click", unlockAudio);
    }, []);

    return (
        <SignalRContext.Provider
            value={{
                connection,
                isConnected,
            }}
        >
            {children}
        </SignalRContext.Provider>
    );
}

export function useSignalR() {
    const context = useContext(SignalRContext);

    if (!context) {
        throw new Error(
            'useSignalR لازم يتستخدم جوّه SignalRProvider'
        );
    }

    return context;
}