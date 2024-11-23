import { PrismaClient } from '@prisma/client'
import { Kafka } from "kafkajs";

const worker = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox_worker',
    brokers: ['localhost:9092']
  })

async function main() {

    const producer = kafka.producer()
    await producer.connect()
    const consumer = kafka.consumer({ groupId: 'test-group' })

    while(1) {
        const pendingData = await worker.taskRunOut.findMany({
            where:{},
            take: 10
        })

        pendingData.forEach(r => {

        })
    }
}

main();