#!/usr/bin/env esr

// -----------------
// localstack does not support the feature that CDK uses in order to wire the
// S3 bucket to the upload lambda, see '../../src/cdk-stack.ts'
// Therefore we use the aws cli instead
// -----------------

import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { logInfo, getUploadBucketName, getLambdaInfo } from '../../src/utils'
import { execSync as exec } from 'child_process'
import { dim } from 'ansi-colors'
import { strict as assert } from 'assert'

const tmpdir = os.tmpdir()
const configPath = path.join(tmpdir, 's3-notif-config.json')

const bucketName = getUploadBucketName()
const lambdaInfo = getLambdaInfo('upload')

assert(
  bucketName != null,
  'cannot find the upload bucket, make sure to deploy first'
)
assert(
  lambdaInfo != null,
  'cannot find the upload lambda, make sure to deploy first'
)

const s3NotificationConfig = {
  LambdaFunctionConfigurations: [
    {
      Id: 's3eventtriggerslambda',
      LambdaFunctionArn: lambdaInfo.arn,
      Events: ['s3:ObjectCreated:*'],
    },
  ],
}
const configJSON = JSON.stringify(s3NotificationConfig, null, 2)
fs.writeFileSync(configPath, configJSON, 'utf8')

const cmd = `yarn aws\
 s3api put-bucket-notification-configuration --bucket ${bucketName}\
 --notification-configuration file://${configPath}`

const res = exec(cmd)
logInfo(dim(res.toString()))
