import * as aws from 'aws-sdk'
import * as path from 'path'
import { Context, S3Event } from 'aws-lambda'
import { strict as assert } from 'assert'
import { ListObjectsV2Request } from 'aws-sdk/clients/s3'
import { inspect } from 'util'

const KEY_SEP = '|'

const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  // the below is only needed for localstack
  endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
  s3ForcePathStyle: true,
})

// @ts-ignore used sometimes
function dump(obj: any, depth = 5) {
  console.log(inspect(obj, { depth, colors: true }))
}

function trimExt(p: string) {
  const ext = path.extname(p)
  return p.slice(0, -ext.length)
}

export async function handler(event: S3Event, _context: Context) {
  assert(event.Records.length === 1, 'expected one record exactly')
  const record = event.Records[0]

  const bucketName = record.s3.bucket.name
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))

  // Separate key into it's parts
  const parts = key.split(KEY_SEP)
  assert(
    parts.length === 3,
    `prefix + filename should be three parts separated by ${KEY_SEP}, but ${key} isn't`
  )

  // Create a proper prefix that will match all files with same user|timestamp and filename (without extension)
  const file = parts.pop()!
  const prefix = [...parts, trimExt(file)].join(KEY_SEP)
  const listObjectReq: ListObjectsV2Request = {
    Bucket: bucketName,
    Prefix: prefix,
  }

  // Retrieve matching objects
  const items = await s3.listObjectsV2(listObjectReq).promise()
  assert(
    items.Contents != null,
    `expected Contents when listing objects for prefix ${prefix}`
  )

  const files = items.Contents
  assert(files.length > 0, `Unable to find files for prefix: ${prefix}`)

  // Wait or process depending if this event is for the first of the two
  // required files or for the second
  if (files.length < 2) {
    console.log('not all needed files uploaded yet, gonna wait for one more')
  } else {
    console.log(`Ready to process ${files.map((x) => x.Key).join(' and ')}.`)
  }
}
