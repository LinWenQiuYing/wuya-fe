import { Module } from "vuex";
import { StoreState } from "@/store";

export type PdfState = {
  pdfUrl: string | null;
  loading: boolean;
};
export const Set_PdfUrl = "Set_PdfUrl";
export const Set_Loading = "Set_Loading";
const pdfPreview = {
  namespaced: true,
  state: {
    pdfUrl: null,
    loading: false,
  },
  mutations: {
    [Set_PdfUrl](state, payload: string) {
      state.pdfUrl = payload;
    },
    [Set_Loading](state, payload: boolean) {
      state.loading = payload;
    },
  },
} satisfies Module<PdfState, StoreState>;

export default pdfPreview;
