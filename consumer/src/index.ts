import { Kafka } from "kafkajs";

const TOPIC_NAME = "task-events-2";

const kafka = new Kafka({
    clientId: 'outbox_consumer',
    brokers: ['localhost:9092']
  })

async function main() {

    const consumer = kafka.consumer({ 
      groupId: 'worker-main' 
    })

    await consumer.connect()
    
   //consumer subscribe events
    await consumer.subscribe({ 
        topic: TOPIC_NAME, 
        fromBeginning: true 
    })

    
    await consumer.run({
      autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
        
          
          await new Promise(time => setTimeout(time, 5000));

          console.log("processing");

          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString()
          }])
        },
      })
    
}

main()