import { PrismaClient } from '@prisma/client'
import { Kafka } from "kafkajs";

const worker = new PrismaClient();
const TOPIC_NAME = "zap-task-events-2";

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

        console.log(pendingData);
       
        producer.send({
            topic: TOPIC_NAME,
            messages: pendingData.map(r => {
                return {
                    value: JSON.stringify({ 
                        taskRunId: r.taskRunId, 
                        stage: 0 
                    })
                }
            })
        })  

        await worker.taskRunOut.deleteMany({
            where: {
                id: {
                    in: pendingData.map(r => r.id)
                }
            }
        })

        await new Promise(r => setTimeout(r, 3000));

    }
}

main();