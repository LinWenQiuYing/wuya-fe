import store from "@/store";

const clearNewsId = () => {
  store.commit("documentQA/SET_NEWS_ID", "");
};

export default clearNewsId;
