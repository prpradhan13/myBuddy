import { useAuth } from "@/context/AuthProvider";
import { getInitialLetter } from "@/utils/helpingFunctions";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  ChannelList,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  ChannelHeader,
  useChatContext,
  ChannelPreviewUIComponentProps,
  DefaultStreamChatGenerics,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const options = { limit: 10 };

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setActiveChannel, channel: selectedChannel } = useChatContext();

  if (!user) {
    navigate("/notAuthLandingPage");
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar: Channel List */}
      <div
        className={`w-full sm:w-1/4 ${
          selectedChannel ? "hidden sm:block" : "block"
        }`}
      >
        <ChannelList
          filters={{ members: { $in: [user.id] } }}
          options={options}
          Preview={(props) => (
            <CustomListPreview {...props} setActiveChannel={setActiveChannel} />
          )}
        />
      </div>

      {/* Chat Window */}
      {selectedChannel && (
        <div className="w-full sm:w-3/4">
          <Channel>
            <Window>
              <div className="sm:hidden p-3 flex items-center">
                <Menu
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setActiveChannel(undefined)}
                />
              </div>
                <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </div>
      )}
    </div>
  );
};

// ✅ Custom Preview Component
const CustomListPreview: React.FC<
  ChannelPreviewUIComponentProps<DefaultStreamChatGenerics>
> = ({ channel, setActiveChannel }) => {
  const { user } = useAuth();
  const members = Object.values(channel.state.members || {});

  const channelImage =
    channel.data?.image ||
    members.find((member) => member.user?.id !== user?.id)?.user?.image;

  const channelName =
    channel.data?.name ||
    members
      .filter((member) => member.user?.id !== user?.id)
      .map((member) => member.user?.name)
      .join(", ") ||
    `Chat ${channel.id}`;

  return (
      <div
        className="p-3 cursor-pointer flex items-center gap-2"
        onClick={() => setActiveChannel && setActiveChannel(channel)}
      >
        {channelImage ? (
          <img
            className="rounded-full w-12 h-12 object-cover"
            src={channelImage}
            alt={channelName}
          />
        ) : (
          <div className="rounded-full w-12 h-12 bg-gradient-to-t from-[#242424] to-[#464646] flex justify-center items-center">
            {getInitialLetter(channelName)}
          </div>
        )}
        <p className="font-semibold capitalize">{channelName}</p>
      </div>
  );
};

export default ChatPage;
