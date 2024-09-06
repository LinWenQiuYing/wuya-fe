import store from "..";
import { PhoneOrEmail, Set_CountdownExpiredMap } from "../modules/countdown";

type Millisecond = number;

const setCountdown = (phoneOrEmail: PhoneOrEmail) => {
  store.commit(`countdown/${Set_CountdownExpiredMap}`, phoneOrEmail);
};

const getCountdown = (phoneOrEmail: PhoneOrEmail): Millisecond => {
  const map = store.state.countdown.countdownExpiredMap;
  const now = Math.floor(Date.now() / 1000);
  if ((map[phoneOrEmail] ?? 0) < now) {
    setCountdown(phoneOrEmail);
  }
  return map[phoneOrEmail] * 1000;
};

export default getCountdown;
