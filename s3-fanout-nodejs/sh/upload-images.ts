#!/usr/bin/env esr

import * as path from 'path'
import { strict as assert } from 'assert'
import { getBucketName, logInfo } from '../src/utils'
import { execSync as exec } from 'child_process'

import { dim } from 'ansi-colors'

const root = path.join(__dirname, '..', '..')
const fixtures = path.join(root, 'fixtures')
const images = path.join(fixtures, 'images')

const bucketName = getBucketName()
assert(bucketName != null, 'could not find bucket name, did you run deploy?')

const cmd = `yarn aws s3 cp --recursive ${images} s3://${bucketName}`

const res = exec(cmd)
logInfo(dim(res.toString()))
