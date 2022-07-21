import {
  Stack,
  StackProps,
  App,
  aws_s3 as s3,
  aws_s3_notifications as s3n,
  aws_lambda as lambda,
  CfnOutput,
  RemovalPolicy,
} from 'aws-cdk-lib'
import * as path from 'path'
import { dumpTrace } from './utils'

export type S3FanoutStackConfig = {
  uploadBucketName: string
}

class S3FanoutStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
    dumpTrace(scope)

    // Create S3 bucket
    const bucket = new s3.Bucket(this, 'UploadBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
    dumpTrace(bucket)

    // Register FanoutHandler Lambda
    const fanoutHandler = new lambda.Function(this, 'FanoutHandler', {
      handler: 'main.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        path.resolve(__dirname, '../lambda/fanout/dist')
      ),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    })

    // Hook up S3 Triggers to FanoutHandler
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(fanoutHandler),
      { suffix: '.jpg' }
    )
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(fanoutHandler),
      { suffix: '.jpeg' }
    )
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(fanoutHandler),
      { suffix: '.png' }
    )
    // Grant Persmissions to lambda to read from the S3 bucket
    bucket.grantRead(fanoutHandler)

    // Dump Output to console
    new CfnOutput(this, 'FanoutHandlerFunction', {
      value: fanoutHandler.functionName,
    })
    new CfnOutput(this, 'FanoutHandlerFunctionLogs', {
      value: fanoutHandler.logGroup.logGroupName,
    })
  }
}

export function initS3FanoutStack(scope: App, id: string, props?: StackProps) {
  const stack = new S3FanoutStack(scope, id, props)
  return { stack }
}
