import { Stack, StackProps, aws_s3 as s3 } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export class S3UnzipFanoutStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    new s3.Bucket(this, 'ZipfileBucket', { versioned: true })
  }
}
