import { inspect } from 'util'
import debug from 'debug'

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
