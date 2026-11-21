import { ChatOllama } from '@langchain/ollama'
import { ChatOpenAI } from '@langchain/openai'
import { AgentOptions } from '@types'

export const createModel = (option: Omit<AgentOptions, 'messages'>) => {
  return option.apiKey === ''
    ? createOllamaModel(option.model)
    : createOpenAIModel(option)
}

const createOllamaModel = (model: string) => {
  return new ChatOllama({
    model,
    temperature: 0.5
  })
}

const createOpenAIModel = ({
  model,
  url,
  apiKey
}: Omit<AgentOptions, 'messages'>) => {
  return new ChatOpenAI({
    model,
    apiKey,
    configuration: {
      baseURL: url
    },
    temperature: 0.5
  })
}
