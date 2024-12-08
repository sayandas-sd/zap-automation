import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    
    await prisma.availableTrigger.create({
        data: {
            id: "Trigger_1",
            name: "Webhook",
            image: "https://cyclr.com/wp-content/uploads/2022/03/ext-493.png"
        },
    })

    await prisma.availableAction.create({
        data: {
            id: "sol",
            name: "solana",
            image: "https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png"
        }
    })

    await prisma.availableAction.create({
        data:{
            id: "gml",
            name: "email",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0J3R6Uwnqkbf2ixL1Qb_oavnvO5d_CR6Cmw&s"
        }
       
    })
}

main();