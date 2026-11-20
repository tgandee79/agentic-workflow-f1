// PostToolUse hook (Edit|Write|MultiEdit): runs Prettier on the file Claude just edited,
// so `verify` never reports format:<file>. Never blocks an edit: it always exits 0.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()
const file = JSON.parse(readFileSync(0, 'utf8')).tool_input?.file_path
const rel = file ? path.relative(root, path.resolve(root, file)) : ''

// Only files inside this repo. Prettier itself skips .prettierignore entries (*.md, the season JSON, ...)
// and file types it does not know (--ignore-unknown).
if (rel && !rel.startsWith('..') && !path.isAbsolute(rel)) {
  const prettier = path.join(root, 'node_modules/prettier/bin/prettier.cjs')
  const r = spawnSync(process.execPath, [prettier, '--write', '--ignore-unknown', '--log-level', 'warn', rel], {
    cwd: root,
    encoding: 'utf8',
  })
  if (r.status !== 0) process.stderr.write(`format hook: prettier failed on ${rel}\n${r.stderr}`)
}
process.exit(0)
