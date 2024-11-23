import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-task-events";

const kafka = new Kafka({
    clientId: 'outbox_worker',
    brokers: ['localhost:9092']
  })



async function main() {
    const consumer = kafka.consumer({ groupId: 'worker-main' })
    await consumer.connect()
    
   
    await consumer.subscribe({ 
        topic: 'zap-task-events', 
        fromBeginning: true 
    })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
        
          
          await new Promise(r => setTimeout(r, 1000));

        },
      })
    
}

main();