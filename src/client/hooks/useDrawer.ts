// 问答抽屉开关控制的统一钩子
import { computed } from "vue";
import store from "@/store";

export default function useDrawer() {
  //抽屉开关
  const showDrawer = computed(() => store.state.chat.showDrawer);
  //预览类型：pdf,atlas
  const drawerType = computed(() => store.state.chat.drawerType);
  //打开抽屉
  const open = (type: string) => {
    store.commit("chat/SET_SHOW_DRAWER", true);
    store.commit("chat/SET_DRAWER_TYPE", type);
  };

  //关闭抽屉
  const closeDrawer = () => {
    store.commit("chat/SET_SHOW_DRAWER", false);
    store.commit("chat/SET_DRAWER_TYPE", "");
  };
  return {
    showDrawer,
    drawerType,
    open,
    closeDrawer,
  };
}
