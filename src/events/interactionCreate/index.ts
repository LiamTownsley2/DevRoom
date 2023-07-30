import { Event } from '../../types'
import autocomplete from './autocomplete'
import command from './command'

const events: Event<any>[] = [
    command,
    autocomplete
]

export default events