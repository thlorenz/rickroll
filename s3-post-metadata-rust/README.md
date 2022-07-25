## Setup

### Add Linux Musl Target and Set Linker

_[official AWS Rust lambda docs](https://docs.aws.amazon.com/sdk-for-rust/latest/dg/lambda.html)_

```sh
rustup target add x86_64-unknown-linux-musl
```

Add this inside the directory of the lambda function.

_./cargo/config.toml_

```toml
[target.x86_64-unknown-linux-musl]
linker = "ld.lld"
```

```sh
cargo build --release --target x86_64-unknown-linux-musl
```
