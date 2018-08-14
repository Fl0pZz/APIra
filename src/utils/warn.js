export function assert (condition, message) {
  if (condition) {
    throw new Error(`[APIra] ${message}`)
  }
}

export function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(`[APIra] ${message}`)
  }
}
