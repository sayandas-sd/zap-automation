import { PrismaClient } from '@prisma/client'
const worker = new PrismaClient();

async function main() {
    while(1) {
        const pendingData = await worker.taskRunOut.findMany({
            
        })
    }
}

main();