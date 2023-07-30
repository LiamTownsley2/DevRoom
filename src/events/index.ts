import { Event } from '../types'
import ready from './ready'
import interactionCreate from './interactionCreate'
import messageCreate from './messageCreate'

const events: Event<any>[] = [
    ready,
    messageCreate,
    ...interactionCreate
]

export default events