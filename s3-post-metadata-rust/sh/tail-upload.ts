#!/usr/bin/env esr

import { logInfo, getLambdaInfo } from '../src/utils'
import { dim } from 'ansi-colors'
import { strict as assert } from 'assert'
import { spawn } from 'child_process'

const lambdaInfo = getLambdaInfo()

assert(
  lambdaInfo != null,
  'cannot find the upload lambda, make sure to deploy first'
)

const cmd = `yarn aws logs tail /aws/lambda/${lambdaInfo.name} --follow`

logInfo(dim(cmd))

const parts = cmd.split(/\s+/)
spawn(parts[0], parts.slice(1), {
  stdio: 'inherit',
  detached: false,
})
