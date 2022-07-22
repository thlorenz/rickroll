import {
  Stack,
  StackProps,
  App,
  aws_iam as iam,
  aws_s3 as s3,
  aws_lambda as lambda,
  RemovalPolicy,
} from 'aws-cdk-lib'
import * as path from 'path'
import { outputCloudFormationInfo } from './cdk-stack-output'
import { dumpTrace } from './utils'

export type S3FanoutStackConfig = {
  uploadBucketName: string
}

class S3FanoutStack extends Stack {
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
    const fanoutHandler = new lambda.Function(this, 'FanoutHandler', {
      handler: 'main.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.resolve(__dirname, '../lambda/fanout/dist')
      ),
      environment: {
        BUCKET_NAME: uploadBucket.bucketName,
      },
    })

    // Hook up S3 Triggers to FanoutHandler doesn't work directly this way since localstack
    // doesn't support S3BucketNotifications
    // Therefore we attach the trigger via the `aws s3api` command until we figure out how
    // to do this via the CDK API
    /*
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(fanoutHandler)
    )
    */

    // Grant Persmissions to lambda to read from the S3 bucket
    uploadBucket.grantRead(fanoutHandler)
    outputCloudFormationInfo(this, { fanoutHandler, uploadBucket })
  }
}

export function initS3FanoutStack(scope: App, id: string, props?: StackProps) {
  const stack = new S3FanoutStack(scope, id, props)
  return { stack }
}
