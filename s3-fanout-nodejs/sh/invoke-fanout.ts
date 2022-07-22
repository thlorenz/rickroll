#!/usr/bin/env esr

import { logInfo, getLambdaInfo } from '../src/utils'
import { dim } from 'ansi-colors'
import { execSync as exec } from 'child_process'
import { strict as assert } from 'assert'

const lambdaInfo = getLambdaInfo('S3FanoutStack-FanoutHandler')
assert(
  lambdaInfo != null,
  'cannot find the upload lambda, make sure to deploy first'
)

const cmd = `yarn aws lambda invoke --function-name ${lambdaInfo.name}  response.json`
const res = exec(cmd)
logInfo(dim(res.toString()))
