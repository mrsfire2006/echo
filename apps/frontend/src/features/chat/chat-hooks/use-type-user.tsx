'use client'
import { useCallback, useEffect, useRef } from "react";
import { useSignalR } from "../components/providers/signalR-provider/signalR-provider";
 
export default function useTypeUser() {
    const { connection } = useSignalR();

    const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sentTyping = useCallback(async () => {
        if (!connection) return;

        try {
            await connection.invoke("SendTypingAsync");
        } catch (error) {
            console.error("Failed to send typing event:", error);
        }
    }, [connection]);

    const sentStopTyping = useCallback(async () => {
        if (!connection) return;

        try {
            await connection.invoke("SendStoppedTypingAsync");
        } catch (error) {
            console.error("Failed to send stop typing event:", error);
        }
    }, [connection]);

    const handleTyping = useCallback(() => {
        if (!typingIntervalRef.current) {
            sentTyping();

            typingIntervalRef.current = setInterval(() => {
                sentTyping();
            }, 2000);
        }
        if (stopTypingTimeoutRef.current) {
            clearTimeout(stopTypingTimeoutRef.current);
        }

        stopTypingTimeoutRef.current = setTimeout(() => {
            sentStopTyping();

            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }

            stopTypingTimeoutRef.current = null;
        }, 500);
    }, [sentTyping, sentStopTyping]);

    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }

            if (stopTypingTimeoutRef.current) {
                clearTimeout(stopTypingTimeoutRef.current);
            }
        };
    }, []);

    return {
        handleTyping,
    };
}