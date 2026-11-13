import { defineGlobalState } from "@onoxm/react-tools";

const initialState = {
  asideShow: true,
};

export const useStore = defineGlobalState(initialState);
