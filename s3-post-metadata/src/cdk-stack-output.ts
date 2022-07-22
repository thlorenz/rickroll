import { CfnOutput, aws_lambda as lambda, aws_s3 as s3 } from 'aws-cdk-lib'
import { Construct } from 'constructs'

type Info = {
  uploadHandler: lambda.Function
  uploadBucket: s3.Bucket
}

export function outputCloudFormationInfo(scope: Construct, info: Info) {
  new CfnOutput(scope, 'UploadBucketName', {
    value: info.uploadBucket.bucketName,
    description: 'Name of S3 bucket to which assets are uploaded',
  })
  new CfnOutput(scope, 'FanoutHandlerFunction', {
    value: info.uploadHandler.functionName,
    description:
      'Name of the function handling the upload to S3, use this also to derive the loggroup',
  })
}
