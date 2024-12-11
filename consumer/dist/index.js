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
const kafkajs_1 = require("kafkajs");
const client_1 = require("@prisma/client");
const TOPIC_NAME = "task-events-2";
const prisma = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox_consumer',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({
            groupId: 'worker-main'
        });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        //consumer subscribe events
        yield consumer.subscribe({
            topic: TOPIC_NAME,
            fromBeginning: true
        });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e, _f, _g, _h, _j, _k;
                console.log({
                    partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                if (!((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString())) {
                    return;
                }
                const parsedValue = JSON.parse((_d = message.value) === null || _d === void 0 ? void 0 : _d.toString());
                const taskRunId = parsedValue.taskRunId;
                const stage = parsedValue.stage;
                const taskDetails = yield prisma.taskRun.findFirst({
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
                });
                const presentAction = taskDetails === null || taskDetails === void 0 ? void 0 : taskDetails.task.action.find(x => x.sortingOrder === stage);
                if (!presentAction) {
                    return;
                }
                const taskRunMetadata = taskDetails === null || taskDetails === void 0 ? void 0 : taskDetails.metadata;
                if (presentAction.type.id === "sol") {
                    const amount = parse((_e = presentAction.metadata) === null || _e === void 0 ? void 0 : _e.amount, taskRunMetadata);
                    const address = parse((_f = presentAction.metadata) === null || _f === void 0 ? void 0 : _f.address, taskRunMetadata);
                    console.log(`Sending out SOL of ${amount} to address ${address}`);
                }
                if (presentAction.type.id === "gml") {
                    const body = parse((_g = presentAction.metadata) === null || _g === void 0 ? void 0 : _g.body, taskRunMetadata);
                    const to = parse((_h = presentAction.metadata) === null || _h === void 0 ? void 0 : _h.email, taskRunMetadata);
                    console.log(`Sending out email to ${to} body is ${body}`);
                }
                yield new Promise(time => setTimeout(time, 1000));
                const taskId = (_j = message.value) === null || _j === void 0 ? void 0 : _j.toString();
                const lastStage = (((_k = taskDetails === null || taskDetails === void 0 ? void 0 : taskDetails.task.action) === null || _k === void 0 ? void 0 : _k.length) || 1) - 1;
                if (lastStage !== stage) {
                    producer.send({
                        topic: TOPIC_NAME,
                        messages: [{
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    taskRunId
                                })
                            }]
                    });
                }
                console.log("processing done");
                yield consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }]);
            }),
        });
    });
}
main();
function parse(body, taskRunMetadata) {
    throw new Error("Function not implemented.");
}
