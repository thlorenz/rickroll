#!/usr/bin/env esr

import * as path from 'path'
import { strict as assert } from 'assert'
import { getUploadBucketName, logInfo } from '../src/utils'
import { execSync as exec } from 'child_process'

import { dim } from 'ansi-colors'

const root = path.join(__dirname, '..', '..')
const fixtures = path.join(root, 'fixtures')
const images = path.join(fixtures, 'images')

const bucketName = getUploadBucketName()
assert(bucketName != null, 'could not find bucket name, did you run deploy?')

const cmd = `yarn aws s3 cp ${images}/01_80x80.png s3://${bucketName}/`

const res = exec(cmd)
logInfo(dim(res.toString()))
