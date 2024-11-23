import { PrismaClient } from '@prisma/client'
import { Kafka } from "kafkajs";

const worker = new PrismaClient();
const TOPIC_NAME = "task-events";

const kafka = new Kafka({
    clientId: 'outbox_worker',
    brokers: ['localhost:9092']
  })

async function main() {

    const producer = kafka.producer()
    await producer.connect()
    

    while(1) {
        const pendingData = await worker.taskRunOut.findMany({
            where:{},
            take: 10
        })

       
        producer.send({
            topic: TOPIC_NAME,
            messages: pendingData.map(r => ({
                    value: r.taskRunId
                }))
            
        })

    }
}

main();