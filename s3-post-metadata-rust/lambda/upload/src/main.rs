// This example requires the following input to succeed:
// { "name": "some name" }

use aws_lambda_events::event::s3::{S3Event, S3EventRecord};
use aws_types::SdkConfig;
use lambda_runtime::{handler_fn, Context, Error};
use log::LevelFilter;
use s3::Endpoint;
use serde::{Deserialize, Serialize};
use aws_sdk_s3 as s3;
use simple_logger::SimpleLogger;

/// This is also a made-up example. Requests come into the runtime as unicode
/// strings in json format, which can map to any structure that implements `serde::Deserialize`
/// The runtime pays no attention to the contents of the request payload.
#[derive(Deserialize)]
struct Request {
    name: String,
}

/// This is a made-up example of what a response structure may look like.
/// There is no restriction on what it can be. The runtime requires responses
/// to be serialized into json. The runtime pays no attention
/// to the contents of the response payload.
#[derive(Serialize)]
struct Response {
    req_id: String,
    msg: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // required to enable CloudWatch error logging by the runtime
    // can be replaced with any other method of initializing `log`
    SimpleLogger::new()
        .with_level(LevelFilter::Info)
        .init()
        .unwrap();

    let func = handler_fn(s3_event_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn s3_event_handler(
    event: S3Event,
    _ctx: Context,
) -> Result<(), Error> {
    let record: &S3EventRecord = &event.records[0];
    let conf = aws_config::from_env().load().await;
    let client = s3_client(&conf);
    let res = client.list_buckets().send().await?;
    eprintln!("Got res");
    let buckets = res.buckets().unwrap_or_default();
    let num_buckets = buckets.len();
    eprintln!("event {:#?}, buckets: {}", record, num_buckets);
    Ok(())
}

fn s3_client(conf: &SdkConfig) -> aws_sdk_s3::Client {
    let s3_config_builder = aws_sdk_s3::config::Builder::from(conf);
    match std::env::var("LOCALSTACK_HOSTNAME") {
        Ok(hostname) => {
            let ep = Endpoint::immutable(
                format!("http://{}:4566/", hostname)
                    .parse()
                    .expect("valid URI"),
            );
            aws_sdk_s3::Client::from_conf(
                s3_config_builder.endpoint_resolver(ep).build(),
            )
        }
        _ => aws_sdk_s3::Client::from_conf(s3_config_builder.build()),
    }
}

#[allow(unused)]
pub(crate) async fn my_handler(
    event: Request,
    ctx: Context,
) -> Result<Response, Error> {
    // extract some useful info from the request
    let name = event.name;

    // prepare the response
    let resp = Response {
        req_id: ctx.request_id,
        msg: format!("Hello you {}!", name),
    };

    // return `Response` (it will be serialized to JSON automatically by the runtime)
    Ok(resp)
}
