"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { ClipboardCopy, Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>(`/api/get-messages`);
        setMessages(response.data?.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
    }
  }, [session, fetchMessages]);

  if (!session?.user) {
    return null;
  }

  const { username } = session.user;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Copied!",
      description: "Profile URL has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen hero-pattern pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Your Anonymous Link</h1>
          <div className="flex flex-col md:flex-row gap-4 items-center bg-background/50 p-4 rounded-lg">
            <code className="text-sm flex-1 overflow-x-auto whitespace-nowrap">
              {profileUrl}
            </code>
            <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No messages yet. Share your link to start receiving messages!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}