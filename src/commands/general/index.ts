import { category } from "../../utils";
import echo from "./echo";

const _ = category('General', [
    echo,
], { emoji: '🌠', description: 'General purpose commands' })

export default _;
