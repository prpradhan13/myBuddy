import Loader from "@/components/loaders/Loader";
import { useAuth } from "@/context/AuthProvider";
import { getUserDetails } from "@/utils/queries/userProfileQuery";
import { tokenProvider } from "@/utils/tokenProvider";
import { PropsWithChildren, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

const api_key = import.meta.env.VITE_STREAM_API_KEY;
const client = StreamChat.getInstance(api_key);

const ChatProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, isLoading } = getUserDetails(userId);
  const [isClientConnected, setIsClientConnected] = useState(false);

  useEffect(() => {
    if (!data?.id) return;

    const connect = async () => {
      try {
        const token = await tokenProvider();

        await client.connectUser(
          {
            id: data.id,
            name: data.username,
            image: data.avatar_url,
          },
          token
        );

        setIsClientConnected(true);
      } catch (error) {
        console.error("Error connecting to Stream Chat:", error);
      }
    };

    connect();

    return () => {
      client.disconnectUser();
      setIsClientConnected(false);
    };
  }, [data, data?.id]);

  if (isLoading || !isClientConnected) return <Loader />;

  if (!userId || !data) {
    return <Navigate to={"/notAuthLandingPage"} replace />;
  }

  return <Chat client={client} theme="str-chat__theme-dark">{children}</Chat>;
};

export default ChatProvider;
