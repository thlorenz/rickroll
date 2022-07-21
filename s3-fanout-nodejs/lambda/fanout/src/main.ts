import * as aws from 'aws-sdk'
import { S3Event } from 'aws-lambda'
import { strict as assert } from 'assert'
import { GetObjectRequest } from 'aws-sdk/clients/s3'

// @ts-ignore
const s3 = new aws.S3({
  apiVersion: '2006-03-01',
  // the below is only needed for localstack
  endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
  s3ForcePathStyle: true,
})

export async function handler(event: S3Event) {
  assert(event.Records.length === 1, 'expected one record exactly')
  const record = event.Records[0]
  const bucketName = record.s3.bucket.name
  const key = record.s3.object.key
  const objectReq: GetObjectRequest = {
    Bucket: bucketName,
    Key: key,
  }
  const bucket = s3.getObject(objectReq)
  console.log(bucketName)
}
