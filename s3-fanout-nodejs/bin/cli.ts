import * as cdk from 'aws-cdk-lib'
import { S3FanoutStack } from '../src/cdk-stack'

function initStack() {
  const app = new cdk.App()
  const stack = new S3FanoutStack(app, 'S3FanoutStack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
  })
  return { app, stack }
}

initStack()
