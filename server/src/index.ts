import { RiotHelper } from "./helpers/RiotHelper.js";

const rh = new RiotHelper();

const queues = await rh.getQueues();
console.log(queues);
