import router from "@/router";

export default async function reflectRouteTopicId(topicId: number) {
  await router.replace(`/writing/topic/${topicId.toString()}`);
}
