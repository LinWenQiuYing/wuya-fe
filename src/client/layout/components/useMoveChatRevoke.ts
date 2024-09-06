import { tinykeys } from "tinykeys";
import { moveChat } from "@/client/api/history";
import { ElMessage } from "element-plus";
import useHistoryType from "@/client/layout/useHistoryType";
import useGetHistoryChat from "@/client/hooks/useGetHistoryChat";
import { Ref } from "vue";

function UseMoveChatRevoke(moveNode: Ref<Record<string, number> | null>) {
  const type = useHistoryType();
  const { getHistoryChats } = useGetHistoryChat();
  const moveChatRevoke = () => {
    tinykeys(window, {
      "$mod+Z": () => {
        if (moveNode.value) {
          moveChat(moveNode.value.id, moveNode.value.parent_id)
            .then(async () => {
              await getHistoryChats(type.value, 1, false);
              moveNode.value = null;
              ElMessage.success("撤回成功");
            })
            .catch(console.error);
        }
      },
    });
  };
  return {
    moveChatRevoke,
  };
}

export default UseMoveChatRevoke;
