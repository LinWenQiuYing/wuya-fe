import useDefaultAgentType from "@/client/views/settings/useDefaultAgentType";
import store from "@/store";
import { AideKey } from "@/client/const";

/**
 * 发送前处理agent类型
 */
export default async function preSendHandleAgent() {
  const { defaultAgentType, setDefaultAgentType } = useDefaultAgentType();
  const agent = store.state.agent.type;
  if (agent && !defaultAgentType.value.includes(agent)) {
    await setDefaultAgentType(defaultAgentType.value.concat(agent));
  }
  store.commit("agent/SET_TYPE", null);
  return agent ?? AideKey.NO_AGENT;
}
