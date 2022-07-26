import * as cdk from 'aws-cdk-lib'
import { STACK_NAME } from '../src/utils'
import { initS3PostMetadataStack } from '../src/cdk-stack'

function initStack() {
  const app = new cdk.App()
  const { stack } = initS3PostMetadataStack(
    process.env.LOCAL_BUILD != null,
    app,
    STACK_NAME,
    {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }
  )

  return { app, stack }
}

initStack()
