# TaskMaster - Quick Reference

## 🎯 Navigation

| Location | URL | Purpose |
|----------|-----|---------|
| Dashboard | `/` | View all boards and recent tasks |
| Inbox | `/inbox` | Quick task capture |
| Planner | `/planner` | Calendar view of scheduled tasks |
| Board | `/board/[id]` | Kanban board view |

## ⌨️ Keyboard Shortcuts (Suggested)

### Global
- `I` - Go to Inbox
- `P` - Go to Planner
- `B` - Go to Boards

### Board View
- `N` - New card
- `L` - New list
- `Esc` - Close modal
- `Enter` - Submit form

## 🎨 Color Coding

### Labels
- **Red** (#ef4444) - Urgent
- **Blue** (#3b82f6) - Design
- **Green** (#10b981) - Feature
- **Yellow** (#f59e0b) - Bug

### Status Indicators
- **Purple** - Automation
- **Violet** - Planner/Today
- **Sky** - Inbox
- **Red** - Overdue

## 🤖 Automation Triggers

| Trigger | When It Fires |
|---------|---------------|
| `card_created` | New card added to board |
| `card_moved` | Card moved between lists |
| `card_completed` | Card marked as done |

## 🎯 Automation Actions

| Action | What It Does |
|--------|--------------|
| `add_checklist` | Creates checklist with items |
| `add_label` | Applies label to card |
| `set_due_date` | Sets card due date |
| `move_card` | Moves card to different list |

## 📋 Common Workflows

### Quick Task Capture
1. Go to Inbox (`/inbox`)
2. Type task
3. Press Enter
4. Task saved to Inbox board

### Create Detailed Task
1. Open board
2. Click "+ Add a card"
3. Enter title
4. Click card to open modal
5. Add description, labels, checklist, due date

### Schedule Task
1. Open card modal
2. Click "Due Date" in sidebar
3. Select date
4. Task appears in Planner

### Setup Automation
1. Open board
2. Click "Automation" button
3. View existing rules
4. Enable/disable as needed

## 🔍 Tips & Tricks

### Organizing
- Use labels for categories
- Use lists for workflow stages
- Use checklists for subtasks
- Use due dates for deadlines

### Productivity
- Start day in Inbox - capture everything
- Review Planner - see what's scheduled
- Work from Boards - execute tasks
- Check Automation - optimize workflows

### Automation Ideas
- Auto-add "Steps" checklist to new tasks
- Auto-label urgent items
- Auto-move completed cards
- Auto-set due dates based on title

## 🎨 UI Elements

### Board Header
- Board title (left)
- Automation button (right, purple)

### Card Modal
- Title & description (main area)
- Labels (colored badges)
- Due date (with calendar icon)
- Checklists (with progress bar)
- Actions sidebar (right)

### List Menu (...)
- Duplicate list
- Rename (inline)
- Delete list

## 📊 Data Management

### Export Data
```bash
# Backup database
cp prisma/dev.db prisma/backup.db
```

### Reset Database
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### View Data
```bash
npx prisma studio
# Opens GUI at http://localhost:5555
```

## 🚀 Performance Tips

- Keep boards under 50 lists
- Keep lists under 100 cards
- Archive completed cards regularly
- Disable unused automation rules

## 🐛 Troubleshooting

### TypeScript Errors
- Restart TS Server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Regenerate Prisma: `npx prisma generate`

### Database Issues
- Reset: `npx prisma db push --force-reset`
- Reseed: `npx prisma db seed`

### Dev Server Issues
- Clear `.next` folder
- Restart: `npm run dev`

---

**Need help?** Check the full README.md for detailed documentation.
