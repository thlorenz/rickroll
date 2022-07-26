FROM clux/muslrust:1.62.1 AS chef
USER root
RUN cargo install cargo-chef
WORKDIR /asset-input

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 
RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /asset-input
COPY --from=planner /asset-input/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl

# FROM alpine AS runtime
# COPY --from=builder /asset-input/target/x86_64-unknown-linux-musl/release/upload /asset-input/upload
