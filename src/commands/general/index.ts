import { category } from "../../utils";
import leaderboard from "./leaderboard";
import stock from "./stock";

const _ = category('General', [
    stock,
    leaderboard
], { emoji: '🌠', description: 'General purpose commands' })

export default _;
