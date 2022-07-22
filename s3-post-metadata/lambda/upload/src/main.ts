import * as aws from 'aws-sdk'
import { Context, S3Event } from 'aws-lambda'
import { strict as assert } from 'assert'
import { inspect } from 'util'

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

export async function handler(event: S3Event, _context: Context) {
  assert(event.Records.length === 1, 'expected one record exactly')
  const record = event.Records[0]

  const bucketName = record.s3.bucket.name
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))

  const params = {
    Bucket: bucketName,
    Key: key,
  }
  // This avoids retrieving the body of the object (which is expensive)
  const headers = await s3.headObject(params).promise()
  assert(
    headers.Metadata != null,
    `expected for headers ${headers} to include 'metadata' field with asset info`
  )
  dump(headers)

  // This gets all the above information including extra properties like th
  // buffered Body
  const file = await s3.getObject(params).promise()
  assert(
    file.Metadata != null,
    `expected for file info ${file} to include 'metadata' field with asset info`
  )

  dump(file)
}
