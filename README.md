# TaskMaster - Modern Productivity Suite

A full-featured Trello-like productivity application built with Next.js 14, featuring Inbox, Boards, Planner, and Automation.

![TaskMaster](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

### 📥 Inbox - Quick Capture
- Distraction-free task capture
- Auto-creates Inbox board
- Instant task creation

### 📊 Boards - Kanban View
- Drag & drop lists and cards
- Color-coded labels
- Due dates with visual indicators
- Checklists with per-item due dates
- Modern glassmorphism UI
- List actions: duplicate, rename, delete

### 📅 Planner - Calendar View
- Full month calendar grid
- Tasks displayed on due dates
- Overdue task highlighting
- Upcoming tasks list
- Click to open card details

### 🤖 Automation System
- No-code automation rules
- Trigger-based actions
- Auto-add checklists, labels, due dates
- Execution logging
- Enable/disable rules via UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push

# Seed sample data (optional)
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
trello-clone/
├── app/                    # Next.js App Router
│   ├── inbox/             # Inbox page
│   ├── planner/           # Calendar view
│   ├── board/[boardId]/   # Board view
│   └── page.tsx           # Dashboard
├── components/
│   ├── board/             # Board components
│   ├── modals/            # Modal dialogs
│   └── Sidebar.tsx        # Navigation
├── actions/               # Server actions
│   ├── board.ts           # Board/List/Card CRUD
│   ├── card.ts            # Card details
│   └── automation.ts      # Automation seeding
├── lib/
│   ├── automation.ts      # Automation engine
│   ├── db.ts              # Prisma client
│   └── utils.ts           # Utilities
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts            # Seed data
```

## 🎯 Usage Guide

### Creating Tasks

**Inbox:**
1. Navigate to Inbox
2. Type task in input field
3. Press Enter or click "Add"

**Boards:**
1. Open a board
2. Click "+ Add a card" in any list
3. Enter task details

### Managing Automation

1. Open any board
2. Click purple "Automation" button
3. View/enable/disable rules
4. Rules execute automatically on triggers

### Viewing Schedule

1. Navigate to Planner
2. See all tasks with due dates
3. Click any task to open details

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Prisma + SQLite
- **Styling:** Tailwind CSS
- **Drag & Drop:** @hello-pangea/dnd
- **Date Handling:** date-fns
- **State Management:** Zustand

## 📊 Database Schema

```
Board
├── Lists
│   └── Cards
│       ├── Labels (many-to-many)
│       └── Checklists
│           └── ChecklistItems
└── AutomationRules
```

## 🎨 Key Features

### Modern UI
- Dark mode support
- Glassmorphism effects
- Smooth animations
- Responsive design

### Automation Examples

**Rule:** When card created in "To Do"
**Action:** Add "Steps" checklist

**Rule:** When card moved to "Done"
**Action:** Mark due date complete

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

### Customization

**Colors:** Edit `tailwind.config.js`
**Database:** Change provider in `schema.prisma`

## 📝 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma db seed   # Seed sample data
```

## 🚧 Future Enhancements

- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Card covers (images)
- [ ] Comments & activity log
- [ ] Mobile app
- [ ] Email notifications
- [ ] Calendar integrations
- [ ] Advanced automation builder

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙏 Acknowledgments

Built with inspiration from Trello, Asana, and modern productivity tools.

---

**Made with ❤️ using Next.js and Prisma**
