#!/usr/bin/env esr

import { strict as assert } from 'assert'
import { getUploadBucketName, logInfo } from '../src/utils'
import { execSync as exec } from 'child_process'
import { dim } from 'ansi-colors'

const bucketName = getUploadBucketName()
assert(bucketName != null, 'could not find bucket name, did you run deploy?')

const cmd = `yarn aws s3 ls s3://${bucketName} --recursive`
const res = exec(cmd)
logInfo(dim(res.toString()))
