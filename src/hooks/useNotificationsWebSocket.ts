import { useEffect, useState, useRef } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";

export interface NotificationMessage {
  id: string;
  subject: string;
  text: string;
  timestamp: string;
}

export function useNotificationsWebSocket(): NotificationMessage[] {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const brokerURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if (!brokerURL) {
      console.error(
        "NEXT_PUBLIC_WEBSOCKET_URL is not defined in environment variables"
      );
      return;
    }

    // Create and configure the STOMP client
    const client = new Client({
      brokerURL,
      reconnectDelay: 5000, // Automatically reconnect after 5 seconds if connection fails
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // Subscribe to the "/topic/alerts" topic for realtime alert messages
        subscriptionRef.current = client.subscribe(
          "/topic/alerts",
          (message: IMessage) => {
            try {
              const body: NotificationMessage = JSON.parse(message.body);
              setNotifications((prev) => [...prev, body]);
            } catch (err) {
              console.error("Error parsing notification message:", err);
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
        console.error("Additional details:", frame.body);
      },
    });

    // Activate the client to establish the connection
    client.activate();
    stompClientRef.current = client;

    // Clean up: unsubscribe and deactivate the client when component unmounts
    return () => {
      subscriptionRef.current?.unsubscribe();
      stompClientRef.current?.deactivate();
    };
  }, []);

  return notifications;
}
