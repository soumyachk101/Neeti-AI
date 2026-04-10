import React, { createContext, useContext, useEffect, useCallback, useRef, useState } from 'react';
/* eslint-disable react-refresh/only-export-components */
import { supabase } from './supabase';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export interface WebSocketMessage {
    type: string;
    timestamp: string;
    data: Record<string, unknown>;
}

interface WebSocketContextType {
    isConnected: boolean;
    connectionFailed: boolean;
    sendMessage: (message: Record<string, unknown>) => void;
    onMessage: (listener: (msg: WebSocketMessage) => void) => () => void;
    reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ sessionId: number | null; children: React.ReactNode }> = ({ sessionId, children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const listenersRef = useRef<Set<(msg: WebSocketMessage) => void>>(new Set());
    const connectRef = useRef<(() => Promise<void>) | null>(null);

    const MAX_RECONNECT_ATTEMPTS = 5;
    const BASE_RECONNECT_DELAY = 1000;
    const MAX_RECONNECT_DELAY = 30000;

    const connect = useCallback(async () => {
        if (!sessionId) return;

        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token || '';

        const url = authToken
            ? `${WS_BASE_URL}/api/ws/session/${sessionId}?token=${authToken}`
            : `${WS_BASE_URL}/api/ws/session/${sessionId}`;

        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setConnectionFailed(false);
            reconnectAttemptsRef.current = 0;
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                listenersRef.current.forEach(listener => listener(message));
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            wsRef.current = null;

            if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                const delay = Math.min(
                    BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current),
                    MAX_RECONNECT_DELAY
                );
                reconnectAttemptsRef.current += 1;
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    const fn = connectRef.current;
                    if (fn) fn();
                }, delay);
            } else {
                setConnectionFailed(true);
            }
        };

        wsRef.current = ws;
    }, [sessionId]);

    useEffect(() => {
        connectRef.current = connect;
    }, [connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((message: Record<string, unknown>) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    const onMessage = useCallback((listener: (msg: WebSocketMessage) => void) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
    }, []);

    const reconnect = useCallback(() => {
        reconnectAttemptsRef.current = 0;
        setConnectionFailed(false);
        connect();
    }, [connect]);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return (
        <WebSocketContext.Provider value={{ isConnected, connectionFailed, sendMessage, onMessage, reconnect }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};

// Keep old hook for compatibility but make it use Context if possible
export function useWebSocket(sessionId: number | null) {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionFailed, setConnectionFailed] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const listenersRef = useRef<Set<(msg: WebSocketMessage) => void>>(new Set());
    const connectRef = useRef<(() => Promise<void>) | null>(null);

    const MAX_RECONNECT_ATTEMPTS = 5;
    const BASE_RECONNECT_DELAY = 1000;
    const MAX_RECONNECT_DELAY = 30000;

    const connect = useCallback(async () => {
        if (!sessionId) return;
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token || '';
        const url = authToken
            ? `${WS_BASE_URL}/api/ws/session/${sessionId}?token=${authToken}`
            : `${WS_BASE_URL}/api/ws/session/${sessionId}`;
        const ws = new WebSocket(url);
        ws.onopen = () => { setIsConnected(true); setConnectionFailed(false); reconnectAttemptsRef.current = 0; };
        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                listenersRef.current.forEach(l => l(message));
            } catch (e) { console.error(e); }
        };
        ws.onclose = () => {
            setIsConnected(false); wsRef.current = null;
            if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current), MAX_RECONNECT_DELAY);
                reconnectAttemptsRef.current += 1;
                reconnectTimeoutRef.current = window.setTimeout(() => {
                    const fn = connectRef.current;
                    if (fn) fn();
                }, delay);
            } else { setConnectionFailed(true); }
        };
        wsRef.current = ws;
    }, [sessionId]);

    useEffect(() => {
        connectRef.current = connect;
    }, [connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((message: Record<string, unknown>) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify(message));
    }, []);

    const onMessage = useCallback((listener: (msg: WebSocketMessage) => void) => {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
    }, []);

    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return { isConnected, sendMessage, onMessage, connectionFailed, reconnect: () => { reconnectAttemptsRef.current = 0; setConnectionFailed(false); connect(); } };
}

export function useLiveMonitoring(sessionId: number | null) {
    const [isConnected, setIsConnected] = useState(false);
    const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const pingIntervalRef = useRef<number | null>(null);

    const connect = useCallback(async () => {
        if (!sessionId) return;
        const { data: { session } } = await supabase.auth.getSession();
        const authToken = session?.access_token || '';
        const url = authToken ? `${WS_BASE_URL}/api/ws/live/${sessionId}?token=${authToken}` : `${WS_BASE_URL}/api/ws/live/${sessionId}`;
        const ws = new WebSocket(url);
        ws.onopen = () => { setIsConnected(true); pingIntervalRef.current = window.setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' })); }, 30000); };
        ws.onmessage = (event) => { try { const message = JSON.parse(event.data); if (message.type === 'metrics_update') setMetrics(message.data); } catch (e) { console.error(e); } };
        ws.onclose = () => { setIsConnected(false); if (pingIntervalRef.current) clearInterval(pingIntervalRef.current); };
        wsRef.current = ws;
    }, [sessionId]);

    const disconnect = useCallback(() => {
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
        setIsConnected(false);
    }, []);

    const requestMetrics = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify({ type: 'request_metrics' }));
    }, []);

    useEffect(() => { connect(); return () => disconnect(); }, [connect, disconnect]);
    return { isConnected, metrics, requestMetrics, flags: [] as string[] };
}



 
