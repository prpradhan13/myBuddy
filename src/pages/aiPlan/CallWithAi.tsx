/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/context/AuthProvider";
import { UserProfileType } from "@/types/userType";
import { vapi } from "@/utils/lib/vapi";
import { useCanCreatePlan } from "@/utils/queries/aiPlanQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, Lock, Phone, PhoneMissed, User } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallWithAi = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [messages, setMessages] = useState<unknown[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useAuth();
  const { data: canUserCreatePlan, isLoading: canUserCreatePlanLoading } =
    useCanCreatePlan();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const userId = user?.id;
  const userDetailsFromCache = queryClient.getQueryData<UserProfileType>([
    `user_profile_${userId}`,
  ]);

  useEffect(() => {
    const originalError = console.error;
    console.error = function (msg, ...args) {
      if (
        (msg && msg.includes("Meeting has ended")) ||
        (args[0] && args[0].toString().includes("Meeting has ended"))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return;
      }

      return originalError.call(console, msg, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navgate user home page after call end
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        navigate(-1);
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, navigate]);

  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call Started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const handleCallEnd = () => {
      console.log("Call Ended");
      setCallActive(false);
      setConnecting(false);
      setIsAiSpeaking(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => {
      console.log("AI Started speaking");
      setIsAiSpeaking(true);
    };
    const handleSpeechEnd = () => {
      console.log("AI Stop speaking");
      setIsAiSpeaking(false);
    };
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const handleError = (error: unknown) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        await vapi.start(import.meta.env.VITE_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: userDetailsFromCache?.full_name || "There",
            user_id: userDetailsFromCache?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return (
    <div className="bg-MainBackgroundColor h-screen w-full p-4 flex flex-col items-center">
      <div className="flex h-[30%] w-full gap-3">
        <div className="bg-SecondaryBackgroundColor rounded-xl w-1/2 flex flex-col justify-center items-center">
          <div className="bg-SecondaryBackgroundColor rounded-xl w-1/2 flex flex-col justify-center items-center relative">
            <div className="bg-white rounded-full p-5">
              <Bot size={32} color="black" />
            </div>
            <h1 className="text-white mt-4 text-xl font-semibold">Buddy</h1>

            <div className="py-2 px-4 mt-2 rounded-full border border-white">
              <p className="text-white">
                {connecting
                  ? "Waiting..."
                  : isAiSpeaking
                  ? "Speaking..."
                  : callActive
                  ? "Listening..."
                  : "Ready"}
              </p>
            </div>

            {(isAiSpeaking || callActive) && (
              <span
                className={`absolute top-3 right-3 h-3 w-3 rounded-full animate-pulse ${
                  isAiSpeaking ? "bg-red-400" : "bg-green-400"
                }`}
              ></span>
            )}
          </div>
        </div>

        <div className="bg-SecondaryBackgroundColor rounded-xl w-1/2 flex flex-col justify-center items-center">
          <div className="bg-white rounded-full p-5">
            <User size={32} color="black" />
          </div>

          <h1 className="text-white mt-4 text-xl font-semibold">You</h1>
          <div className="py-2 px-4 mt-2 rounded-full border border-white">
            <p className="text-white">{connecting ? "Waiting..." : "Ready"}</p>
          </div>
        </div>
      </div>

      {canUserCreatePlanLoading ? (
        <button className="px-4 py-2 rounded-full mt-4 bg-white flex items-center gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-medium">Please Wait</span>
        </button>
      ) : !canUserCreatePlan ? (
        <button className="px-4 py-2 rounded-full mt-4 bg-white flex items-center gap-2">
          <Lock size={20} />
          <span className="font-medium">Locked</span>
        </button>
      ) : (
        <button
          onClick={toggleCall}
          disabled={connecting || callEnded}
          className={`px-4 py-2 rounded-full font-medium mt-4 ${
            callActive ? "bg-red-500" : callEnded ? "bg-green-500" : "bg-white"
          }`}
        >
          {callActive ? (
            <span className="flex items-center gap-2">
              <PhoneMissed size={20} />
              End Call
            </span>
          ) : connecting ? (
            <span className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Connecting...
            </span>
          ) : callEnded ? (
            "View Profile"
          ) : (
            <span className="flex items-center gap-2">
              <Phone size={20} />
              Start Call
            </span>
          )}
        </button>
      )}

      {!canUserCreatePlan && (
        <p className="text-SecondaryTextColor max-w-sm text-center mt-4">
          You’ve reached your limit of 3 plans. Please delete one to create a
          new plan.
        </p>
      )}

      {messages.length > 0 && (
        <div
          ref={messageContainerRef}
          className="w-full max-h-[50vh] mt-2 bg-SecondaryBackgroundColor backdrop-blur-sm rounded-xl p-2 overflow-y-auto transition-all duration-300 scroll-smooth"
        >
          <div className="space-y-3">
            {messages.map((msg: any, index: number) => (
              <div key={index} className="">
                <div className="font-semibold text-xs text-muted-foreground mb-1">
                  {msg.role === "assistant" ? "Buddy AI" : "You"}
                </div>
                <p className="text-white">{msg.content}</p>
              </div>
            ))}

            {callEnded && (
              <div className="">
                <div className="font-semibold text-xs text-muted-foreground mb-1">
                  System:
                </div>
                <p className="text-white">
                  Your fitness program has been created!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallWithAi;
