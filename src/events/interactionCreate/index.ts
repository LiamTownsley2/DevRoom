import { Event } from '../../types'
import autocomplete from './autocomplete'
import button from './button'
import command from './command'

const events: Event<any>[] = [
    command,
    button,
    autocomplete
]

export default events