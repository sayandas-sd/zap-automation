import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-task-events";

const kafka = new Kafka({
    clientId: 'outbox_worker',
    brokers: ['localhost:9092']
  })



async function main() {

    while(1) {

    }
}

main();