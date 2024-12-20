"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const worker = new client_1.PrismaClient();
const TOPIC_NAME = "zap-task-events-2";
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox_worker',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        while (1) {
            const pendingData = yield worker.taskRunOut.findMany({
                where: {},
                take: 10
            });
            console.log(pendingData);
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingData.map(r => {
                    return {
                        value: JSON.stringify({
                            taskRunId: r.taskRunId,
                            stage: 0
                        })
                    };
                })
            });
            yield worker.taskRunOut.deleteMany({
                where: {
                    id: {
                        in: pendingData.map(r => r.id)
                    }
                }
            });
            yield new Promise(r => setTimeout(r, 3000));
        }
    });
}
main();
