import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Layout, CheckSquare, Clock, Zap } from "lucide-react";
import { format } from "date-fns";
import { BoardList } from "@/components/board/BoardList";

export default async function Home() {
  const boards = await db.board.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch recent tasks across all boards (simulating "My Tasks")
  const recentCards = await db.card.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
    include: {
      list: {
        select: {
          title: true,
          boardId: true,
        }
      },
      labels: {
        include: {
          label: true
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#121212] text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Navbar Placeholder (Functional BoardNavbar is inside [boardId]) */}
      <nav className="fixed top-0 w-full h-14 border-b border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md z-50 flex items-center px-6 justify-between">
        <div className="flex items-center gap-x-2 font-bold text-xl tracking-tight">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <Layout className="h-5 w-5" />
          </div>
          <span>Tasker AI</span>
        </div>
        <div className="flex items-center gap-x-4">
          <button className="text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white transition">Workspace</button>
          <Link href="/settings" className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:opacity-80 transition cursor-pointer" title="Settings"></Link>
        </div>
      </nav>

      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12 pb-20">

        {/* Welcome Section */}
        <section className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, User</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Here is what's happening in your workspace today.</p>
        </section>

        {/* Boards Grid */}
        <section>
          <BoardList initialBoards={boards} />
        </section>

        {/* Recent Tasks / My Tasks */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              Recent Tasks (All Boards)
            </h2>
            <div className="space-y-3">
              {recentCards.length === 0 && <p className="text-neutral-500">No tasks found.</p>}
              {recentCards.map(card => (
                <Link href={`/board/${card.list.boardId}?cardId=${card.id}`} key={card.id} className="block group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition shadow-sm hover:shadow-md">
                    <div className={`w-1 h-12 rounded-full ${card.dueDate ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white truncate">{card.title}</h4>
                        {card.labels.map(l => (
                          <span key={l.labelId} className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white hidden sm:inline-block" style={{ backgroundColor: l.label.color }}>
                            {l.label.title}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                        From list <span className="font-medium text-neutral-700 dark:text-neutral-300">{card.list.title}</span>
                        {card.dueDate && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-red-500"><Clock className="h-3 w-3" /> {format(new Date(card.dueDate), "MMM d")}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                      <ArrowRight className="h-5 w-5 text-neutral-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar / Integrations / Power Ups */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Power-Ups</h3>
                <p className="text-white/80 text-sm mb-4">Connect your favorite tools like Slack, GitHub, and more to supercharge your workflow.</p>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition">Explore Integrations</button>
              </div>
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            {/* Activity Stream Placeholder */}
            <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e] p-6">
              <h3 className="font-bold mb-4 text-neutral-900 dark:text-white">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0"></div>
                    <div className="text-sm">
                      <p className="text-neutral-900 dark:text-neutral-200"><span className="font-semibold">You</span> moved a card to <span className="font-semibold">Doing</span></p>
                      <p className="text-neutral-500 text-xs">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
