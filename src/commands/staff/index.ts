import { category } from "../../utils";
import manageWelcome from "./manage-welcome";
import module from "./module";
import scheduleMessage from "./schedule-message";
import setup from "./setup";

const _ = category('Staff Commands', [
    manageWelcome,
    module,
    scheduleMessage,
    setup
], { emoji: '🌠', description: 'Guild Staff Commands' })

export default _;
