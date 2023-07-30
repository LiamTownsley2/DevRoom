import { category } from "../../utils";
import echo from "./echo";
import stock from "./stock";

const _ = category('General', [
    echo,
    stock
], { emoji: '🌠', description: 'General purpose commands' })

export default _;
