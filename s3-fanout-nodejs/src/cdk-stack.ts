import {
  Stack,
  StackProps,
  App,
  aws_s3 as s3,
  RemovalPolicy,
  aws_lambda as lambda,
} from 'aws-cdk-lib'
import { dumpTrace } from './utils'

export type S3FanoutStackConfig = {
  uploadBucketName: string
}

class S3FanoutStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
    dumpTrace(scope)

    const bucket = new s3.Bucket(this, 'UploadBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
    dumpTrace(bucket)

    const fanoutHandler = new lambda.Function(this, 'FanoutHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/fanout/dist'),
      handler: 'main.handler',
      environment: {
        UPLOAD_BUCKET: bucket.bucketName,
      },
    })
    bucket.grantRead(fanoutHandler)
  }
}

export function initS3FanoutStack(scope: App, id: string, props?: StackProps) {
  const stack = new S3FanoutStack(scope, id, props)
  return { stack }
}
