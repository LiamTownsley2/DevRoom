import { Event } from '../types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import messageCreate from './messageCreate'
import guildMemberAdd from './guildMemberAdd'

const events: Event<any>[] = [
    ready,
    messageCreate,
    guildMemberAdd,
    ...interactionCreate
]

export default events