import { inspect } from 'util'
import debug from 'debug'
import * as path from 'path'
import { execSync as exec } from 'child_process'

const rootdir = path.join(__dirname, '..')

export const STACK_NAME = 'S3PostMetadataStack'
export const UPLOAD_HANDLER_NAME = 'UploadHandler'

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

export const ENDPOINT_URL = 'http://localhost:4566'
const bucketRx = /(s3postmetadatastack-uploadbucket.+)$/

export function getUploadBucketName() {
  // NOTE: trying to use CloudFormation output is not working as the latter uid part of the bucket is not present in the
  // `cdk.out/*.template.json` file
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

export function getLambdaInfo(
  prefix: string = `${STACK_NAME}-${UPLOAD_HANDLER_NAME}`
) {
  const json = exec(
    `aws --endpoint-url=${ENDPOINT_URL} lambda list-functions`
  ).toString()
  const res = JSON.parse(json)
  for (const x of res.Functions) {
    if (x.FunctionName.startsWith(prefix))
      return { name: x.FunctionName, arn: x.FunctionArn }
  }
  return null
}
