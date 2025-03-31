import Loader from "@/components/loaders/Loader";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";
import { Channel as StreamChannel } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const ChatChannel = () => {
    const { client } = useChatContext();
    const { cid } = useParams();
    const [loading, setLoading] = useState(true);
    const [channel, setChannel] = useState<StreamChannel | null>(null);
  
    useEffect(() => {
      if (!client || !cid) return;
  
      if (!client.userID) {
        console.warn("User is not connected yet. Waiting...");
        return;
      }
  
      const fetchChannel = async () => {
        try {
          const newChannel = client.channel("messaging", cid);
          await newChannel.watch();
          setChannel(newChannel);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching channel:", error);
        }
      };
  
      fetchChannel();
    }, [client, cid]);
  
    if (loading || !channel) return <Loader />;

  return (
    <div className="h-screen">
        <Channel channel={channel}>
            <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
            </Window>
            <Thread />
        </Channel>
    </div>
  );
};

export default ChatChannel;
