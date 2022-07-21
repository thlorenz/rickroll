import { inspect } from 'util'
import debug from 'debug'
import * as path from 'path'
import { promises as fs } from 'fs'
import { execSync as exec } from 'child_process'

const rootdir = path.join(__dirname, '..')
const shdir = path.join(rootdir, 'sh')
const envFile = path.join(shdir, '.env')

export const logErrorDebug = debug('cdk:error')
export const logInfoDebug = debug('cdk:info')
export const logDebug = debug('cdk:debug')
export const logTrace = debug('cdk:trace')

export const logError = logErrorDebug.enabled
  ? logErrorDebug
  : console.error.bind(console)

export const logInfo = logInfoDebug.enabled
  ? logInfoDebug
  : console.log.bind(console)

export function dumpInfo(obj: any, depth = 5) {
  logInfo(inspect(obj, { depth, colors: true }))
}

export function dumpDebug(obj: any, depth = 5) {
  logDebug(inspect(obj, { depth, colors: true }))
}

export function dumpTrace(obj: any, depth = 5) {
  logTrace(inspect(obj, { depth, colors: true }))
}

const bucketRx = /(s3fanoutstack-uploadbucket.+)$/

export function getBucketName() {
  // NOTE: that even when passing `--output json` does this output text which
  // is why we parse it out
  const lines = exec(`yarn aws s3 ls`, { cwd: rootdir }).toString().split('\n')

  for (const line of lines) {
    const match = line.match(bucketRx)
    if (match != null) {
      return match[0]
    }
  }

  return null
}

export function updateShellEnv(env: Map<string, string>) {
  console.log(env)
  let content = ''
  for (const [key, val] of env) {
    content += `${key}=${val}\n`
  }
  return fs.writeFile(envFile, content, 'utf8')
}
