import { defineGlobalState, persistMiddleware } from "@onoxm/react-tools";

const initialState = {
  language: "zh",
  asideShow: true,
  asideWidth: 240,
  asideMinWidth: 200,
};

export const useStore = defineGlobalState(initialState, [
  persistMiddleware({
    name: "chat-agent-store",
    properties: ["language", "asideShow", "asideWidth", "asideMinWidth"],
  }),
]);
