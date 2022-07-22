import {
  Stack,
  StackProps,
  App,
  aws_s3 as s3,
  aws_lambda as lambda,
  RemovalPolicy,
} from 'aws-cdk-lib'
import * as path from 'path'
import { outputCloudFormationInfo } from './cdk-stack-output'
import { dumpTrace, UPLOAD_HANDLER_NAME } from './utils'

export type S3PostMetadataStackConfig = {
  uploadBucketName: string
}

class S3PostMetadataStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
    dumpTrace(scope)

    // Create S3 bucket
    const uploadBucket = new s3.Bucket(this, 'UploadBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
    dumpTrace(uploadBucket)

    // Register FanoutHandler Lambda
    const uploadHandler = new lambda.Function(this, UPLOAD_HANDLER_NAME, {
      handler: 'main.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.resolve(__dirname, '../lambda/upload/dist')
      ),
      environment: {
        BUCKET_NAME: uploadBucket.bucketName,
      },
    })

    // Grant Persmissions to lambda to read from the S3 bucket
    uploadBucket.grantRead(uploadHandler)
    outputCloudFormationInfo(this, { uploadHandler, uploadBucket })
  }
}

export function initS3PostMetadataStack(
  scope: App,
  id: string,
  props?: StackProps
) {
  const stack = new S3PostMetadataStack(scope, id, props)
  return { stack }
}
