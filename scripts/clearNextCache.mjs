import { rm } from 'node:fs/promises'
import path from 'node:path'

async function clearNextCache() {
  const cachePath = path.join(process.cwd(), '.next', 'cache')

  try {
    await rm(cachePath, { recursive: true, force: true })
    console.log(`[cache] Cleared Next.js cache at: ${cachePath}`)
  } catch (error) {
    console.warn(`[cache] Failed to clear Next.js cache at: ${cachePath}`)
    console.warn(error)
  }
}

await clearNextCache()
