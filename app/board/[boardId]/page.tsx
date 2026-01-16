import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BoardClient } from "@/components/board/BoardClient";
import { Board } from "@/types";
import { CardModal } from "@/components/modals/CardModal";
import { BoardNavbar } from "@/components/board/BoardNavbar";

interface BoardPageProps {
    params: Promise<{
        boardId: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BoardPage(props: BoardPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const boardData = await (db as any).board.findUnique({
        where: {
            id: params.boardId,
        },
        include: {
            lists: {
                orderBy: {
                    position: "asc",
                },
                include: {
                    cards: {
                        orderBy: {
                            position: "asc",
                        },
                        include: {
                            labels: {
                                include: { label: true }
                            },
                            checklists: {
                                include: { items: true }
                            }
                        },
                    },
                },
            },
        },
    });

    if (!boardData) {
        notFound();
    }

    const board = boardData as unknown as Board;

    // Fetch automation rules
    // @ts-ignore - Prisma client has automationRule, but IDE hasn't refreshed types yet
    const automationRules = await db.automationRule.findMany({
        where: { boardId: params.boardId },
        orderBy: { createdAt: "desc" },
    });

    let activeCard = null;
    const cardId = searchParams?.cardId;

    if (typeof cardId === 'string') {
        activeCard = await db.card.findUnique({
            where: { id: cardId },
            include: {
                labels: { include: { label: true } },
                checklists: { include: { items: { orderBy: { createdAt: 'asc' } } } },
                comments: { orderBy: { createdAt: 'desc' } },
                activities: { orderBy: { createdAt: 'desc' }, take: 20 }
            }
        });
    }

    const allLabels = await db.label.findMany();

    return (
        <div className="h-full w-full flex flex-col relative bg-[#1d4ed8]/20 bg-[url('https://images.unsplash.com/photo-1627916607164-7b52244ea38b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            <BoardNavbar board={board} automationRules={automationRules} />

            <div className="flex-1 overflow-x-auto relative z-10">
                <BoardClient initialBoard={board} />
            </div>

            {activeCard && (
                <CardModal
                    card={activeCard as unknown as any}
                    boardId={board.id}
                    allLabels={allLabels}
                />
            )}
        </div>
    );
}
