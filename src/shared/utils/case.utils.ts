function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`)
}

function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())
}

export function objectToSnakeCase<T>(obj: T): T {
  if (obj === null || obj instanceof File || obj instanceof FormData) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => objectToSnakeCase(item)) as T
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[toSnakeCase(key)] = objectToSnakeCase(
        (obj as Record<string, unknown>)[key],
      )
    }
    return result as T
  }

  return obj
}

export function objectToCamelCase<T>(obj: T): T {
  if (obj === null || obj instanceof File || obj instanceof FormData) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => objectToCamelCase(item)) as T
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[toCamelCase(key)] = objectToCamelCase(
        (obj as Record<string, unknown>)[key],
      )
    }
    return result as T
  }

  return obj
}
