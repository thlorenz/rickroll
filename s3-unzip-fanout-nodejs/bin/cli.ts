import * as cdk from 'aws-cdk-lib'
import { S3UnzipFanoutStack } from '../src/cdk-stack'

function initStack() {
  const app = new cdk.App()
  const stack = new S3UnzipFanoutStack(app, 'S3UnzipFanoutStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  })
  return { app, stack }
}

initStack()
