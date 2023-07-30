import { category } from "../../utils";
import guide from "./guide";
import manageWelcome from "./manage-welcome";
import module from "./module";
import scheduledMessage from "./scheduled-message";
import setup from "./setup";

const _ = category('Staff Commands', [
    manageWelcome,
    module,
    scheduledMessage,
    setup,
    guide
], { emoji: '🌠', description: 'Guild Staff Commands' })

export default _;
