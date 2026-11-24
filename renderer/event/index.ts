import { createEventEmitter } from 'ono-react-element'

const eventNames = ['change-theme'] as const

export const event = createEventEmitter(eventNames)
