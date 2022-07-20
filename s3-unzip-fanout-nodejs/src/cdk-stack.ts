import {
  Stack,
  StackProps,
  App,
  aws_s3 as s3,
  RemovalPolicy,
} from 'aws-cdk-lib'
import { dumpTrace } from './utils'

export class S3UnzipFanoutStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
    dumpTrace(scope)

    const bucket = new s3.Bucket(this, 'ZipfileBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
    dumpTrace(bucket)
  }
}
