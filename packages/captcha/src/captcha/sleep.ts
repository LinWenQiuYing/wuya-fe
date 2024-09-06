export default async function sleep(time: `${number}s`) {
  const seconds = Number.parseFloat(time.replace(/s$/i, ""));
  return await new Promise<void>((resolve) => setTimeout(resolve, seconds));
}
