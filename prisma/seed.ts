import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // clear db
    await db.automationLog.deleteMany();
    await db.automationRule.deleteMany();
    await db.customFieldValue.deleteMany();
    await db.customField.deleteMany();
    await db.attachment.deleteMany();
    await db.checklistItem.deleteMany();
    await db.checklist.deleteMany();
    await db.cardLabel.deleteMany();
    await db.cardMember.deleteMany();
    await db.workspaceMember.deleteMany();
    await db.label.deleteMany();
    await db.card.deleteMany();
    await db.list.deleteMany();
    await db.board.deleteMany();
    await db.workspace.deleteMany();
    await db.member.deleteMany();

    const workspace = await db.workspace.create({
        data: {
            name: "Elite Workspace",
            description: "The primary operational sector for high-priority projects.",
        }
    });

    const board = await db.board.create({
        data: {
            title: "Project Alpha",
            workspaceId: workspace.id,
            imageId: "unsplash-1",
            imageThumbUrl: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2938&auto=format&fit=crop", // placeholder
            imageFullUrl: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2938&auto=format&fit=crop",
            imageUserName: "Test User",
            imageLinkHTML: "http://unsplash.com",
        },
    });

    const listToDo = await db.list.create({
        data: {
            title: "To Do",
            position: 1,
            boardId: board.id,
        } as any,
    });

    const listInProgress = await db.list.create({
        data: {
            title: "In Progress",
            position: 2,
            boardId: board.id,
        } as any,
    });

    const listDone = await db.list.create({
        data: {
            title: "Done",
            position: 3,
            boardId: board.id,
        } as any,
    });

    const labelUrgent = await db.label.create({
        data: { title: "Urgent", color: "#ef4444", boardId: board.id }
    });

    const labelDesign = await db.label.create({
        data: { title: "Design", color: "#3b82f6", boardId: board.id }
    });

    const card1 = await db.card.create({
        data: {
            title: "Research Competitors",
            description: "Look at Trello, Asana, Monday.",
            position: 1,
            listId: listToDo.id,
        } as any,
    });

    await db.cardLabel.create({
        data: { cardId: card1.id, labelId: labelDesign.id }
    });

    const card2 = await db.card.create({
        data: {
            title: "Design System",
            position: 2,
            listId: listToDo.id,
        } as any,
    });

    // Checklist
    const checklist = await db.checklist.create({
        data: {
            title: "Requirements",
            cardId: card1.id,
        },
    });

    await db.checklistItem.create({
        data: { checklistId: checklist.id, title: "Login Flow", isChecked: true },
    });
    await db.checklistItem.create({
        data: { checklistId: checklist.id, title: "Dashboard", isChecked: false },
    });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
