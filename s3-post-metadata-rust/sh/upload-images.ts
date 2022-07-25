#!/usr/bin/env esr

import * as path from 'path'
import * as fs from 'fs'
import { strict as assert } from 'assert'
import { getUploadBucketName, logInfo, stringifyAllValues } from '../src/utils'
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

const assets = fs
  .readdirSync(imagesDir)
  .filter((x) => path.extname(x) === '.png')
  .sort()

const metas = fs
  .readdirSync(imagesDir)
  .filter((x) => path.extname(x) === '.json')
  .sort()

logInfo(
  `Uploading ${IMAGES} image(s) and metadata. Override amount by setting N, i.e. N=3 ./sh/upload-images.ts`
)
for (let i = 0; i < IMAGES; i++) {
  const meta = require(path.join(imagesDir, metas[i]))
  const babys3api = stringifyAllValues(meta)
  const metaJSON = JSON.stringify(babys3api)

  const asset = assets[i]
  const putAssetCmd = `
yarn aws s3api put-object \
  --bucket ${bucketName} \
  --key '${USER}|${TASK}|${asset}' \
  --metadata '${metaJSON}' \
  --body ${imagesDir}/${asset}`

  const res = exec(putAssetCmd)
  logInfo(dim(res.toString()))
}
