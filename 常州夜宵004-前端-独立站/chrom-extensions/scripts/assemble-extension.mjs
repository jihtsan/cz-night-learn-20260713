import { cp, mkdir, readFile, rm, stat } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const extensionRoot = resolve(scriptDirectory, '..')
const siteBuild = resolve(extensionRoot, '../work-html/dist')
const extensionBuild = resolve(extensionRoot, 'dist')

if (!extensionBuild.startsWith(`${extensionRoot}${sep}`) || extensionBuild === extensionRoot) {
  throw new Error('Extension output path is outside the expected extension directory.')
}

async function requireFile(path, label) {
  const file = await stat(path).catch(() => null)
  if (!file?.isFile()) throw new Error(`${label} is missing: ${path}`)
}

await requireFile(resolve(siteBuild, 'index.html'), 'Site production build')
await requireFile(resolve(extensionRoot, 'manifest.json'), 'Extension manifest')

await rm(extensionBuild, { recursive: true, force: true })
await mkdir(extensionBuild, { recursive: true })
await cp(siteBuild, extensionBuild, { recursive: true })
await cp(resolve(extensionRoot, 'manifest.json'), resolve(extensionBuild, 'manifest.json'))

const manifest = JSON.parse(await readFile(resolve(extensionBuild, 'manifest.json'), 'utf8'))
if (manifest.manifest_version !== 3) throw new Error('The extension must use Manifest V3.')
if (manifest.chrome_url_overrides?.newtab !== 'index.html') {
  throw new Error('The extension must override Chrome new tabs with index.html.')
}

const indexHtml = await readFile(resolve(extensionBuild, 'index.html'), 'utf8')
if (/<script[^>]+src=["']https?:\/\//i.test(indexHtml)) {
  throw new Error('Remote executable scripts are not allowed in the extension package.')
}

const localAssets = [...indexHtml.matchAll(/(?:src|href)=["']\/([^"']+)["']/g)].map((match) => match[1])
await Promise.all(localAssets.map((asset) => requireFile(resolve(extensionBuild, asset), `Referenced asset ${asset}`)))

console.log(`Chrome extension assembled at ${extensionBuild}`)
