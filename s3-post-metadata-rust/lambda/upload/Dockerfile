# Derived from: https://github.com/LukeMathWalker/cargo-chef#running-the-binary-in-alpine
FROM clux/muslrust:1.62.1 AS chef
USER root
RUN cargo install cargo-chef
WORKDIR /asset-input

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 

WORKDIR /asset-input
COPY --from=planner /asset-input/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl

# NOTE: that we left out the runner part here since we include a `cargo build`
# when we startup the container in order to ensure that our binary gets properly updated.
# See the parent project README for more info.
