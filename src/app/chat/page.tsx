import { ChatExperience } from "@/features/chat/components/chat-experience";

type ChatPageProps = {
  searchParams: Promise<{
    mode?: string;
    q?: string;
  }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const params = await searchParams;

  return (
    <ChatExperience
      initialQuestion={params.q ?? ""}
      initialQuestionMode={params.mode === "preset" ? "preset" : "dify"}
    />
  );
}
