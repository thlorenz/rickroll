import {
  Stack,
  StackProps,
  aws_lambda as lambda,
  DockerImage,
  App,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { UPLOAD_HANDLER_NAME } from './utils'
import * as path from 'path'

const TARGET = 'x86_64-unknown-linux-musl'
const CMD = `
rustup target add ${TARGET} && \
cargo build --release --target ${TARGET} && \
cp target/${TARGET}/release/upload /asset-output/bootstrap
`

// @ts-ignore
const fromPath = path.resolve(__dirname, '../lambda/upload/tmp/var.zip')

const docker = lambda.Code.fromAsset('lambda/upload', {
  bundling: {
    command: ['bash', '-c', CMD],
    image: DockerImage.fromRegistry('rust:1.62-slim'),
  },
})

export class S3PostMetadataStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new lambda.Function(this, UPLOAD_HANDLER_NAME, {
      code: docker,
      functionName: 'upload',
      handler: 'main',
      runtime: lambda.Runtime.PROVIDED_AL2,
    })
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
