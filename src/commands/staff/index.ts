import { category } from "../../utils";
import manageWelcome from "./manage-welcome";
import module from "./module";
import scheduleMessage from "./schedule-message";

const _ = category('Staff Commands', [
    manageWelcome,
    module,
    scheduleMessage
], { emoji: '🌠', description: 'Guild Staff Commands' })

export default _;
