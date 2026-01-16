const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function seedAutomation() {
    try {
        console.log('🚀 Seeding automation rules...\n');

        // Get first board
        const boards = await db.board.findMany({ include: { lists: true } });

        if (boards.length === 0) {
            console.log('❌ No boards found. Please create a board first.');
            return;
        }

        const board = boards[0];
        console.log(`📋 Board: ${board.title}`);

        // Get lists
        const lists = board.lists;
        const toDoList = lists.find(l => l.title.toLowerCase().includes('to do')) || lists[0];

        console.log(`📝 Target list: ${toDoList.title}\n`);

        // Get labels
        const labels = await db.label.findMany({ where: { boardId: board.id } });

        // Rule 1: Auto-add checklist to new cards in "To Do"
        const rule1 = await db.automationRule.create({
            data: {
                boardId: board.id,
                name: 'Auto-add Steps Checklist',
                triggerType: 'card_created',
                triggerData: JSON.stringify({ listId: toDoList.id }),
                actions: JSON.stringify([
                    {
                        type: 'add_checklist',
                        data: {
                            title: 'Steps',
                            items: ['Define requirements', 'Break down tasks', 'Execute', 'Review']
                        }
                    }
                ]),
                enabled: true
            }
        });
        console.log(`✅ Created: ${rule1.name}`);

        // Rule 2: Auto-label cards with "urgent" in title
        if (labels.length > 0) {
            const rule2 = await db.automationRule.create({
                data: {
                    boardId: board.id,
                    name: 'Auto-label Urgent Cards',
                    triggerType: 'card_created',
                    triggerData: JSON.stringify({ titleContains: 'urgent' }),
                    actions: JSON.stringify([
                        {
                            type: 'add_label',
                            data: { labelId: labels[0].id }
                        }
                    ]),
                    enabled: true
                }
            });
            console.log(`✅ Created: ${rule2.name}`);
        }

        console.log('\n🎉 Automation rules seeded successfully!');
        console.log('\n📌 To test:');
        console.log(`   1. Go to board: ${board.title}`);
        console.log(`   2. Create a card in "${toDoList.title}" list`);
        console.log(`   3. Watch the "Steps" checklist auto-add!`);
        console.log(`   4. Create a card with "urgent" in the title`);
        console.log(`   5. Watch it auto-label!\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.$disconnect();
    }
}

seedAutomation();
