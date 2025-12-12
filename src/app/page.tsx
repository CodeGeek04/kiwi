import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ChatContainer } from "@/components/chat/chat-container";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <header className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥝</span>
            <span className="text-2xl font-bold text-gray-900">Kiwi</span>
          </div>
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal CRM Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Manage your leads, tasks, and notes through natural conversation.
            Just tell Kiwi what you need, and it will handle the rest.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Leads
              </h3>
              <p className="text-gray-600 text-sm">
                Add and manage leads with flexible attributes. Keep all your
                contacts organized.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manage Tasks
              </h3>
              <p className="text-gray-600 text-sm">
                Create tasks with deadlines. Never miss a follow-up or important
                meeting.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Take Notes
              </h3>
              <p className="text-gray-600 text-sm">
                Add notes to any lead. Keep track of conversations and important
                details.
              </p>
            </div>
          </div>

          <SignUpButton mode="modal">
            <button className="px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">
              Start for Free
            </button>
          </SignUpButton>
        </main>
      </div>
    );
  }

  return <ChatContainer />;
}
