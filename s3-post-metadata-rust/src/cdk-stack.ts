import {
  Stack,
  StackProps,
  aws_lambda as lambda,
  DockerImage,
  App,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { UPLOAD_FUNCTION_NAME, UPLOAD_HANDLER_NAME } from './utils'
import * as path from 'path'

const TARGET = 'x86_64-unknown-linux-musl'
const ASSET_INPUT = '/asset-input'
const ASSET_OUTPUT = '/asset-output'

const lambdaUploadDir = path.resolve(__dirname, '../lambda/upload/')

function installLambdaBuildingInContainer(stack: Stack) {
  // NOTE: this is not how cargo-chef is supposed to work, the `cp` command is
  // all we should need, however I couldn't get the binary to get updated that
  // way, i.e. the caching doesn't get invalidated when a rust src file is
  // changed to trigger `cargo build`. Thus we add another build command here.
  //
  // The cache only is properly invalidated when Cargo.toml is updated which
  // makes that a way to update the built artifact that is part of the image.
  // This makes the build on container startup finish faster.
  //
  // At any rate this runs faster than without cargo chef since crates.io
  // updates are omitted, and the build is faster + afaik crates don't need to
  // get downloaded after the image has been created.

  // Use installLambdaFromLocalBuild for the fastest option.
  const cmd = `
cargo build --release --target x86_64-unknown-linux-musl && \
cp /asset-input//target/x86_64-unknown-linux-musl/release/upload /asset-output/bootstrap
`
  const docker = lambda.Code.fromAsset('lambda/upload', {
    bundling: {
      command: ['sh', '-c', cmd],
      image: DockerImage.fromBuild(lambdaUploadDir),
      workingDirectory: ASSET_INPUT,
      // Need this to work around directory not accessible issues
      // failed to create directory `/usr/local/cargo/registry/index/github.com-1ecc6299db9ec823`
      user: 'root:root',
      // volumes: [{ hostPath: lambdaUploadDir, containerPath: ASSET_INPUT }],
    },
  })
  new lambda.Function(stack, UPLOAD_HANDLER_NAME, {
    code: docker,
    functionName: UPLOAD_FUNCTION_NAME,
    handler: 'main',
    runtime: lambda.Runtime.PROVIDED_AL2,
  })
}

function installLambdaFromLocalBuild(stack: Stack) {
  const docker = lambda.Code.fromAsset('lambda/upload', {
    bundling: {
      command: [
        'sh',
        '-c',
        `cp target/${TARGET}/release/upload /${ASSET_OUTPUT}/bootstrap`,
      ],
      workingDirectory: ASSET_INPUT,
      image: DockerImage.fromRegistry('alpine'),
      volumes: [{ hostPath: lambdaUploadDir, containerPath: ASSET_INPUT }],
    },
  })
  new lambda.Function(stack, UPLOAD_HANDLER_NAME, {
    code: docker,
    functionName: UPLOAD_FUNCTION_NAME,
    handler: 'main',
    runtime: lambda.Runtime.PROVIDED_AL2,
  })
}

export class S3PostMetadataStack extends Stack {
  constructor(
    installLambda: (stack: Stack) => void,
    scope: Construct,
    id: string,
    props?: StackProps
  ) {
    super(scope, id, props)
    installLambda(this)
  }
}

export function initS3PostMetadataStack(
  fromLocalBuild: boolean,
  scope: App,
  id: string,
  props?: StackProps
) {
  const stack = new S3PostMetadataStack(
    fromLocalBuild
      ? installLambdaFromLocalBuild
      : installLambdaBuildingInContainer,
    scope,
    id,
    props
  )
  return { stack }
}
