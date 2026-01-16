import { create } from 'zustand';
import { Board, List, Card } from '@/types';

interface BoardState {
    board: Board | null;
    setBoard: (board: Board) => void;
    updateListOrder: (listIds: string[]) => void;
    updateCardOrder: (listId: string, orderedCards: Card[]) => void;
    moveCard: (cardId: string, sourceListId: string, destListId: string, newIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    board: null,
    setBoard: (board) => set({ board }),

    updateListOrder: (listIds) => {
        set((state) => {
            if (!state.board) return state;
            const newLists = listIds.map((id, index) => {
                const list = state.board!.lists.find((l) => l.id === id)!;
                return { ...list, position: index };
            });
            return { board: { ...state.board, lists: newLists } };
        });
    },

    updateCardOrder: (listId, orderedCards) => {
        set((state) => {
            if (!state.board) return state;
            const newLists = state.board.lists.map((list) => {
                if (list.id === listId) {
                    const newCards = orderedCards.map((c, i) => ({ ...c, position: i }));
                    return { ...list, cards: newCards };
                }
                return list;
            });
            return { board: { ...state.board, lists: newLists } };
        });
    },

    moveCard: (cardId, sourceListId, destListId, newIndex) => {
        set((state) => {
            if (!state.board) return state;

            const sourceList = state.board.lists.find(l => l.id === sourceListId);
            const destList = state.board.lists.find(l => l.id === destListId);

            if (!sourceList || !destList) return state;

            const card = sourceList.cards.find(c => c.id === cardId);
            if (!card) return state;

            // Remove from source
            const newSourceCards = sourceList.cards.filter(c => c.id !== cardId);

            // Add to dest
            const newDestCards = [...destList.cards];
            if (sourceListId === destListId) {
                // Same list reorder logic handled by updateCardOrder usually, but if called here:
                newDestCards.splice(sourceList.cards.indexOf(card), 1);
            }

            // Update card listId
            const updatedCard = { ...card, listId: destListId };

            // Insert
            newDestCards.splice(newIndex, 0, updatedCard);

            // Re-index dest
            const reorderedDest = newDestCards.map((c, i) => ({ ...c, position: i }));

            const newLists = state.board.lists.map(l => {
                if (l.id === sourceListId) return { ...l, cards: newSourceCards }; // Note: if same list, this is overwritten by next line
                if (l.id === destListId) return { ...l, cards: reorderedDest };
                return l;
            });

            return { board: { ...state.board, lists: newLists } };
        });
    }
}));
