#!/usr/bin/env esr

import * as path from 'path'
import * as fs from 'fs'
import { strict as assert } from 'assert'
import { getUploadBucketName, logInfo } from '../src/utils'
import { execSync as exec } from 'child_process'

import { dim } from 'ansi-colors'

const rootDir = path.join(__dirname, '..', '..')
const fixturesDir = path.join(rootDir, 'fixtures')
const imagesDir = path.join(fixturesDir, 'images')

const USER = process.env.USER ?? 'bob'
const TASK = process.env.TASK ?? Date.now().toString()
const IMAGES = process.env.N == null ? 2 : parseInt(process.env.N)

const bucketName = getUploadBucketName()
assert(bucketName != null, 'could not find bucket name, did you run deploy?')

const assets = fs.readdirSync(imagesDir)
logInfo(
  `Uploading ${IMAGES} image(s). Override amount by setting N, i.e. N=3 ./sh/upload-images.ts`
)
for (let i = 0; i < IMAGES; i++) {
  const asset = assets[i]
  const cmd = `yarn aws s3api put-object \
  --bucket ${bucketName} \
  --key /${USER}/${TASK}/${asset} \
  --body ${imagesDir}/${asset}`

  const res = exec(cmd)
  logInfo(dim(res.toString()))
}
