const parseIterator = async (
  payload: AsyncIterable<Uint8Array>
): Promise<string> => {
  let uint8Array: string = ''

  for await (const byte of payload) {
    uint8Array += byte
  }

  return uint8Array
}

export { parseIterator }
