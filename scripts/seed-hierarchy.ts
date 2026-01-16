import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("🚀 Starting Elite Hierarchy Seeding...");

    // 1. Create Elite Workspace
    const workspace = await db.workspace.upsert({
        where: { id: "default-elite-workspace" },
        update: {},
        create: {
            id: "default-elite-workspace",
            name: "Elite Workspace",
            description: "The primary workspace for high-level operations.",
        }
    });
    console.log(`✅ Workspace created: ${workspace.name}`);

    // 2. Create Members
    const member1 = await db.member.upsert({
        where: { email: "naman@elite.com" },
        update: {},
        create: {
            name: "Naman",
            email: "naman@elite.com",
            avatarUrl: "https://github.com/nutlope.png",
        }
    });

    const member2 = await db.member.upsert({
        where: { email: "alex@elite.com" },
        update: {},
        create: {
            name: "Alex",
            email: "alex@elite.com",
            avatarUrl: "https://avatar.vercel.sh/alex",
        }
    });
    console.log("✅ Members created.");

    // 3. Link Member to Workspace
    await db.workspaceMember.upsert({
        where: {
            workspaceId_memberId: {
                workspaceId: workspace.id,
                memberId: member1.id
            }
        },
        update: {},
        create: {
            workspaceId: workspace.id,
            memberId: member1.id,
        }
    });

    // 4. Create an Elite Board if none exist
    const boards = await db.board.findMany();
    if (boards.length === 0) {
        const board = await db.board.create({
            data: {
                title: "Production Development",
                workspaceId: workspace.id,
                imageId: "elite-bg",
                imageFullUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964",
                lists: {
                    create: [
                        { title: "Backlog", position: 1 },
                        { title: "To Do", position: 2 },
                        { title: "In Progress", position: 3 },
                        { title: "Done", position: 4 },
                    ] as any
                }
            }
        });
        console.log(`✅ Board created: ${board.title}`);
    } else {
        // Migration: Link existing boards to workspace
        for (const b of boards) {
            if (!b.workspaceId) {
                await db.board.update({
                    where: { id: b.id },
                    data: { workspaceId: workspace.id }
                });
            }
        }
        console.log("✅ Existing boards linked to workspace.");
    }

    console.log("💎 Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
