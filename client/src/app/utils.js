export function generateId(prefix = 'id') {
  // Browsers support `crypto.randomUUID()`; fall back for older environments.
  const c = globalThis.crypto
  if (c && typeof c.randomUUID === 'function') {
    return `${prefix}_${c.randomUUID()}`
  }
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`
}

export function toInputDateTimeValue(iso) {
  // Convert to local time without timezone suffix for `<input type="datetime-local" />`.
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`
}

export function fromInputDateTimeValue(value) {
  // `datetime-local` returns local-time; convert to ISO by constructing a Date in local timezone.
  const d = new Date(value)
  return d.toISOString()
}

