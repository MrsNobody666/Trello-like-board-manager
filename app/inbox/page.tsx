import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createCard } from "@/actions/board";
import { revalidatePath } from "next/cache";

async function createInboxCard(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    if (!title) return;

    // 1. Find or Create Inbox Board
    let inboxBoard = await db.board.findFirst({
        where: { title: "Inbox" },
    });

    if (!inboxBoard) {
        let workspace = await db.workspace.findFirst();
        if (!workspace) {
            workspace = await db.workspace.create({
                data: {
                    name: "Default Workspace",
                    description: "Auto-created workspace",
                },
            });
        }

        inboxBoard = await db.board.create({
            data: {
                title: "Inbox",
                imageId: "inbox-bg",
                workspaceId: workspace.id,
            },
        });
    }

    // 2. Find or Create "To Do" List in Inbox
    let inboxList = await db.list.findFirst({
        where: {
            boardId: inboxBoard.id,
            title: "To Do"
        },
    });

    if (!inboxList) {
        inboxList = await db.list.create({
            data: {
                boardId: inboxBoard.id,
                title: "To Do",
                position: 1,
            } as any,
        });
    }

    // 3. Create Card
    const lastCard = await db.card.findFirst({
        where: { listId: inboxList.id },
        orderBy: { position: "desc" } as any,
        select: { position: true } as any,
    });
    const newOrder = lastCard ? (lastCard as any).position + 1 : 1;

    await db.card.create({
        data: {
            title,
            listId: inboxList.id,
            position: newOrder,
        } as any,
    });

    revalidatePath("/inbox");
}

export default async function InboxPage() {
    const inboxBoard = await db.board.findFirst({
        where: { title: "Inbox" },
        include: {
            lists: {
                where: { title: "To Do" },
                include: {
                    cards: {
                        orderBy: { createdAt: "desc" }
                    }
                }
            }
        }
    });

    const cards = inboxBoard?.lists[0]?.cards || [];

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">Inbox</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">Capture your thoughts and tasks instantly.</p>
            </header>

            {/* Quick Capture Input */}
            <div className="bg-white dark:bg-[#1e1e1e] p-2 rounded-xl shadow-lg border border-neutral-200 dark:border-white/10">
                <form action={createInboxCard} className="flex items-center gap-2">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/30">
                        <Plus className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                    </div>
                    <input
                        name="title"
                        className="flex-1 h-12 bg-transparent text-lg outline-none placeholder:text-neutral-400"
                        placeholder="Add a new task to your Inbox..."
                        autoComplete="off"
                    />
                    <button className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition">
                        Add
                    </button>
                </form>
            </div>

            {/* Inbox List */}
            <div className="space-y-4">
                <h2 className="font-semibold text-neutral-500 uppercase tracking-widest text-xs">Your Items ({cards.length})</h2>
                <div className="space-y-2">
                    {cards.length === 0 && (
                        <div className="text-center py-12 text-neutral-400 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-xl">
                            <p>Your inbox is empty. Amazing!</p>
                        </div>
                    )}
                    {cards.map(card => (
                        <div key={card.id} className="group flex items-center gap-4 p-4 bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-white/5 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="h-6 w-6 rounded-full border-2 border-neutral-300 dark:border-neutral-600 group-hover:border-sky-500 cursor-pointer flex items-center justify-center">
                                {/* Check circle */}
                            </div>
                            <span className="flex-1 font-medium text-lg">{card.title}</span>
                            <div className="opacity-0 group-hover:opacity-100 text-sm text-neutral-400">
                                {new Date(card.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
