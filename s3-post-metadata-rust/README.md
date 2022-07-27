## Setup and Deploy

First you need to decide if you want to cross-compile on your machine (see _Setup For Local
builds_) or build inside a container.

### Building artifact inside a Container

Simply run the below which will build the artifact inside a docker and then make it available
to _cdk_ to deploy. Since I couldn't get cache invalidation figured out 100% there is a bit more overhead
here since we re-build on container startup.

For more info see `./src/cdk-stack.ts` - `installLambdaBuildingInContainer`.

Run `yarn boot:docker` once and then the below everytime want to deploy a change.

```
yarn deploy:docker
```

### Building locally and deploying artifact

Run the below which will first cross-compile the artifact on your machine and mount the rust
folder as a volume into the container which then merely copies the artifact into the right
place.

This runs a lot faster, but requires the below setup on the dev's machine.

Run `yarn boot:local` once and then the below everytime want to deploy a change.

```
yarn deploy:local
```

NOTE: that when switching to build inside a container instead it is recommended to remove the
`lambda/upload/target` folder as otherwise it is copied into the container (adding it to
`.dockerignore` results in other issues with the cargo-chef docker build.

## Setup For Local builds

### Add Linux Musl Target and Set Linker

_[official AWS Rust lambda docs](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/lambda.html)_

```sh
rustup target add x86_64-unknown-linux-musl
```

Add this inside the directory of the lambda parent.

_./cargo/config.toml_

```toml
[target.x86_64-unknown-linux-musl]
linker = "ld.lld"
```

```sh
cargo build --release --target x86_64-unknown-linux-musl
```
