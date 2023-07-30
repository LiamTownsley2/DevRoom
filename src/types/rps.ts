import { User } from 'discord.js';
import { ObjectId } from 'mongodb';

export interface RPSMove {
    author: User;
    opponent: User;
    author_move: string;
    message_id: string;
    opponent_move?: string;
    _id?: ObjectId;
}