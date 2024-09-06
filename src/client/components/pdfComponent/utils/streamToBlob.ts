async function streamToBlob(stream: ReadableStream) {
  const chunks = [];
  const reader = stream.getReader();
  let result = await reader.read();
  while (!result.done) {
    chunks.push(result.value);
    result = await reader.read();
  }
  return new Blob(chunks, { type: "application/pdf" });
}

export default streamToBlob;
