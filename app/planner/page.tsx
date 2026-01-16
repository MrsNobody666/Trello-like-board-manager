import { db } from "@/lib/db";
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    parse
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Layout, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function PlannerPage(props: {
    searchParams: Promise<{ month?: string; year?: string }>;
}) {
    const searchParams = await props.searchParams;
    // Determine the target date from search params or use today
    const now = new Date();
    const currentMonth = searchParams.month ? parseInt(searchParams.month) : now.getMonth();
    const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

    // Create the target date object (1st of the month)
    const targetDate = new Date(currentYear, currentMonth, 1);

    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Calculate prev/next month params
    const prevMonthDate = subMonths(targetDate, 1);
    const nextMonthDate = addMonths(targetDate, 1);

    const prevParams = `?month=${prevMonthDate.getMonth()}&year=${prevMonthDate.getFullYear()}`;
    const nextParams = `?month=${nextMonthDate.getMonth()}&year=${nextMonthDate.getFullYear()}`;
    const todayParams = `?month=${now.getMonth()}&year=${now.getFullYear()}`;

    // Fetch cards with due dates within the broad calendar range (Optimized)
    const cardsWithDates = await db.card.findMany({
        where: {
            dueDate: {
                gte: calendarStart,
                lte: calendarEnd,
            }
        },
        include: {
            list: {
                select: {
                    title: true,
                    boardId: true
                }
            },
            labels: {
                include: {
                    label: true
                }
            }
        },
        orderBy: {
            dueDate: 'asc'
        }
    });

    // Group cards by date
    const cardsByDate = new Map<string, typeof cardsWithDates>();
    cardsWithDates.forEach(card => {
        if (card.dueDate) {
            const dateKey = format(new Date(card.dueDate), 'yyyy-MM-dd');
            if (!cardsByDate.has(dateKey)) {
                cardsByDate.set(dateKey, []);
            }
            cardsByDate.get(dateKey)?.push(card);
        }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                        Planner
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                        Your workspace roadmap and deadlines.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/planner${todayParams}`}
                        className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-neutral-200 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-neutral-50 dark:hover:bg-white/5 transition shadow-sm active:scale-95"
                    >
                        Today
                    </Link>
                    <div className="flex items-center gap-4 bg-white dark:bg-[#1e1e1e] p-1.5 rounded-xl border border-neutral-200 dark:border-white/10 shadow-sm">
                        <Link
                            href={`/planner${prevParams}`}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-lg font-bold text-neutral-900 dark:text-white leading-none">
                                {format(targetDate, 'MMMM')}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter mt-1">
                                {format(targetDate, 'yyyy')}
                            </span>
                        </div>
                        <Link
                            href={`/planner${nextParams}`}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Calendar Grid */}
            <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-white/10 bg-neutral-50/30 dark:bg-neutral-900/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-4 text-center font-bold text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {days.map((day, idx) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayCards = cardsByDate.get(dateKey) || [];
                        const isCurrentMonth = isSameMonth(day, targetDate);
                        const isTodayDate = isToday(day);

                        return (
                            <div
                                key={idx}
                                className={`min-h-[150px] border-r border-b border-neutral-200 dark:border-white/10 p-3 transition-colors ${!isCurrentMonth ? 'bg-neutral-50/50 dark:bg-neutral-900/20 opacity-30' : 'hover:bg-neutral-50/30 dark:hover:bg-white/5'
                                    } ${isTodayDate ? 'bg-violet-50/30 dark:bg-violet-900/10' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-sm font-bold flex items-center justify-center rounded-xl w-8 h-8 transition-all ${isTodayDate
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 ring-4 ring-white dark:ring-[#1e1e1e]'
                                        : !isCurrentMonth ? 'text-neutral-300' : 'text-neutral-900 dark:text-white'
                                        }`}>
                                        {format(day, 'd')}
                                    </span>
                                    {dayCards.length > 0 && isCurrentMonth && (
                                        <div className="flex -space-x-1.5">
                                            {dayCards.slice(0, 3).map((card, i) => (
                                                <div
                                                    key={card.id}
                                                    className="w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1e1e]"
                                                    style={{ backgroundColor: card.labels[0]?.label.color || '#8b5cf6' }}
                                                />
                                            ))}
                                            {dayCards.length > 3 && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 border-2 border-white dark:border-[#1e1e1e]" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {dayCards.slice(0, 3).map(card => (
                                        <Link
                                            href={`/board/${card.list.boardId}?cardId=${card.id}`}
                                            key={card.id}
                                            className="block group"
                                            title={card.title}
                                        >
                                            <div className="text-[11px] p-2 rounded-xl bg-white dark:bg-[#2a2e32] border border-neutral-200 dark:border-white/5 hover:border-violet-500/50 dark:hover:border-violet-500/50 transition shadow-sm hover:shadow-md truncate">
                                                {card.labels.length > 0 && (
                                                    <div className="h-1 w-full rounded-full mb-1 opacity-50" style={{ backgroundColor: card.labels[0].label.color }} />
                                                )}
                                                <div className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                                    {card.title}
                                                </div>
                                                <div className="text-[9px] text-neutral-400 mt-1 truncate uppercase font-extrabold tracking-tighter flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-neutral-300" />
                                                    {card.list.title}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    {dayCards.length > 3 && (
                                        <div className="text-[10px] text-violet-600 dark:text-violet-400 font-extrabold px-1 tracking-tighter uppercase">
                                            +{dayCards.length - 3} others
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tasks Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl border border-neutral-200 dark:border-white/10 p-8 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <CalendarIcon className="h-6 w-6 text-violet-500" />
                        Upcoming Deadlines
                    </h3>
                    <div className="space-y-4">
                        {cardsWithDates.filter(c => new Date(c.dueDate!) >= now).slice(0, 5).map(card => (
                            <Link
                                href={`/board/${card.list.boardId}?cardId=${card.id}`}
                                key={card.id}
                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/10 group"
                            >
                                <div className="text-center w-14 py-2 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50 shadow-sm transition-transform group-hover:scale-105">
                                    <div className="text-[10px] uppercase font-black">{format(new Date(card.dueDate!), 'MMM')}</div>
                                    <div className="text-xl font-black leading-none">{format(new Date(card.dueDate!), 'd')}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-neutral-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{card.title}</h4>
                                    <p className="text-xs text-neutral-500 flex items-center gap-1 font-medium italic mt-1">
                                        Board: <span className="text-neutral-700 dark:text-neutral-300 not-italic font-bold">{card.list.title}</span>
                                    </p>
                                </div>
                                <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    <ChevronRight className="h-4 w-4 text-violet-500" />
                                </div>
                            </Link>
                        ))}
                        {cardsWithDates.filter(c => new Date(c.dueDate!) >= now).length === 0 && (
                            <div className="text-center py-12 text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/5">
                                <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-xs">Clear schedule!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl border border-neutral-200 dark:border-white/10 p-8 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-red-600 dark:text-red-400">
                        <Clock className="h-6 w-6" />
                        Overdue Tasks
                    </h3>
                    <div className="space-y-4">
                        {cardsWithDates.filter(c => new Date(c.dueDate!) < now).slice(0, 5).map(card => (
                            <Link
                                href={`/board/${card.list.boardId}?cardId=${card.id}`}
                                key={card.id}
                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900/30 group"
                            >
                                <div className="text-center w-14 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 shadow-sm transition-transform group-hover:scale-105">
                                    <div className="text-[10px] uppercase font-black">{format(new Date(card.dueDate!), 'MMM')}</div>
                                    <div className="text-xl font-black leading-none">{format(new Date(card.dueDate!), 'd')}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-neutral-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{card.title}</h4>
                                    <p className="text-xs text-red-500/70 font-bold uppercase tracking-tighter mt-1 flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Overdue
                                    </p>
                                </div>
                                <div className="p-2 rounded-full bg-red-50 dark:bg-red-900/10 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                    <ChevronRight className="h-4 w-4 text-red-500" />
                                </div>
                            </Link>
                        ))}
                        {cardsWithDates.filter(c => new Date(c.dueDate!) < now).length === 0 && (
                            <div className="text-center py-12 text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-white/5">
                                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-xs">All caught up!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
