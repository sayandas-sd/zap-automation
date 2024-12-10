import { Kafka } from "kafkajs";
import { PrismaClient } from '@prisma/client'

const TOPIC_NAME = "task-events-2";
const prisma = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox_consumer',
    brokers: ['localhost:9092']
  })

async function main() {

    const consumer = kafka.consumer({ 
      groupId: 'worker-main' 
    })

    await consumer.connect()

    const producer =  kafka.producer();
    await producer.connect();

    
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

          if(!message.value?.toString()){
            return;
          }
          
          const parsedValue = JSON.parse(message.value?.toString());
          const taskRunId = parsedValue.taskRunId;

          const stage = parsedValue.stage

          const taskDetails = await prisma.taskRun.findFirst({
            where: {
              id: taskRunId
            },
            include: {
              task: {
                include: {
                  action: {
                    include: {
                      type: true
                    }
                  }
                }
              }
            }
          })
          
          const presentAction = taskDetails?.task.action.find(x => x.sortingOrder === stage)

          if(!presentAction) {
            return;
          }

          if(presentAction.type.id === "sol") {
            console.log(`Sending out to solana`)
             
          }

          if(presentAction.type.id === "gml") {
            console.log(`Sending out to email`)
          }
          
          await new Promise(time => setTimeout(time, 1000));

          const taskId = message.value?.toString();
          const lastStage = (taskDetails?.task.action?.length || 1) - 1

          if(lastStage !==  stage) {
            producer.send({
              topic: TOPIC_NAME,
              messages: [{
                value: JSON.stringify({
                  stage: stage + 1,
                  taskRunId
                })
              }]
          })  
          }

          console.log("processing done");

          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString()
          }])
        },
      })
    
}

main()