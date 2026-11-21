import { InitialStateType } from '@/store'

export type CommunicationType = keyof InitialStateType

export type CommunicationPayload = {
  type: CommunicationType
  data: any
}
