import { Kafka } from "kafkajs";
import { PrismaClient } from '@prisma/client'
import { JsonObject } from "@prisma/client/runtime/library";

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

          const taskRunMetadata = taskDetails?.metadata;

          if(presentAction.type.id === "sol") {
           
            const amount = parse((presentAction.metadata as JsonObject)?.amount as string, taskRunMetadata);
            const address = parse((presentAction.metadata as JsonObject)?.address as string, taskRunMetadata);
            console.log(`Sending out SOL of ${amount} to address ${address}`);
                          
          }

          if(presentAction.type.id === "gml") {
            const body = parse((presentAction.metadata as JsonObject)?.body as string, taskRunMetadata);
            const to = parse((presentAction.metadata as JsonObject)?.email as string, taskRunMetadata);

             console.log(`Sending out email to ${to} body is ${body}`)
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

function parse(body: string | number | boolean | JsonObject | import("@prisma/client/runtime/library").JsonArray | null | undefined, taskRunMetadata: unknown) {
  throw new Error("Function not implemented.");
}
