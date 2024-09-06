import { RateParams, ratePost, RateType } from "@/client/api/chat";
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

export const useRate = (commentOn: RateType, comment: string) => {
  const voteUp = ref<boolean>(false);
  const voteDown = ref<boolean>(false);
  const voteDownComment = ref<string | undefined>(comment);
  watch(
    () => commentOn,
    (value) => {
      voteUp.value = value === "praise";
      voteDown.value = value === "trample";
    },
    {
      immediate: true,
    },
  );
  const onVoteUp = async (record_id: number) => {
    const params: RateParams = { record_id };
    if (voteDown.value) voteDown.value = false;
    if (!voteUp.value) params.comment_on = "praise";
    await ratePost(params)
      .then(() => {
        voteUp.value = !voteUp.value;
        if (voteUp.value) ElMessage.success("感谢反馈！");
      })
      .catch(() => ElMessage.error("评论失败"));
  };
  const onVoteDown = async (record_id: number, comment?: string) => {
    const params: RateParams = { record_id };
    if (voteUp.value) voteUp.value = false;
    voteDownComment.value = comment;
    params.comment = comment;
    params.comment_on = "trample";
    await ratePost(params)
      .then(() => {
        if (!voteDown.value) voteDown.value = true;
        comment && ElMessage.success("感谢反馈，我们会持续改进！");
      })
      .catch(() => ElMessage.error("评论失败"));
  };
  return {
    voteUp,
    voteDown,
    voteDownComment,
    onVoteUp,
    onVoteDown,
  };
};
