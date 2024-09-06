import type { Component } from "vue";
import { StatusNumber } from "@/admin/view/knowledgeBase/const";
import CircleXMarkIcon from "@/client/icons/circle-xmark.svg";
import CircleCheckIcon from "@/client/icons/circle-check.svg";
import ClockIcon from "@/client/icons/clock.svg";

export const getUploadStatusIcon = (
  status: StatusNumber,
  parsring: boolean = false,
): [Component, "fail" | "success" | "processing"] => {
  if (parsring) {
    switch (status) {
      case StatusNumber.parse_failed:
      case StatusNumber.saved_failed:
      case StatusNumber.upload_Failed:
        return [CircleXMarkIcon, "fail"];
      case StatusNumber.saved:
      case StatusNumber.parse_success:
      case StatusNumber.edited:
        return [CircleCheckIcon, "success"];
      case StatusNumber.waiting:
      case StatusNumber.uploading:
      case StatusNumber.parsing:
      case StatusNumber.uploaded:

      default:
        return [ClockIcon, "processing"];
    }
  }

  switch (status) {
    case StatusNumber.parse_failed:
    case StatusNumber.saved_failed:
    case StatusNumber.upload_Failed:
      return [CircleXMarkIcon, "fail"];
    case StatusNumber.saved:
      return [CircleCheckIcon, "success"];
    case StatusNumber.waiting:
    case StatusNumber.uploading:
    case StatusNumber.parsing:
    case StatusNumber.uploaded:
    case StatusNumber.parse_success:
    case StatusNumber.edited:
    default:
      return [ClockIcon, "processing"];
  }
};
