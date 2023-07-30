import { category } from "../../utils";
import echo from "./echo";
import leaderboard from "./leaderboard";
import stock from "./stock";

const _ = category('General', [
    echo,
    stock,
    leaderboard
], { emoji: '🌠', description: 'General purpose commands' })

export default _;
