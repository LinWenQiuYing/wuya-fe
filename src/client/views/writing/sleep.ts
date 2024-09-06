const sleep = async (ms: number) => {
  const { promise, resolve } = Promise.withResolvers<void>();
  window.setTimeout(resolve, ms);
  return promise;
};

export default sleep;
