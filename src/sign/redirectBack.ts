import router from "@/router";
import { defaultRedirect } from "./reAuth";

export default async function redirectBack() {
  const route = router.currentRoute.value;
  const target = <string | undefined>route.query.redirect ?? defaultRedirect;
  await router.replace(decodeURIComponent(target));
}
