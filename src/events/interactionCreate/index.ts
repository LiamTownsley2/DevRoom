import { Event } from '../../types'
import button from './button'
import command from './command'

const events: Event<any>[] = [
    command,
    button
]

export default events