// This example requires the following input to succeed:
// { "name": "some name" }

use aws_lambda_events::event::s3::{S3Event, S3EventRecord};
use aws_types::SdkConfig;
use lambda_runtime::{handler_fn, Context, Error};
use log::LevelFilter;
use s3::{Endpoint, Region};
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
    eprintln!("Got event");
    let record: &S3EventRecord = &event.records[0];
    eprintln!("Got record");
    // NOTE: the below crashes the function afaik due to trying to interact with the environment
    // let shared_config: SdkConfig = aws_config::from_env().load().await;
    // let client = s3_client(&shared_config);
    let endpoint_resolver = Endpoint::immutable(
        "http://localhost:4566/".parse().expect("valid URI"),
    );

    let mut config = SdkConfig::builder()
        .region(Region::new("us-east-1"))
        .endpoint_resolver(endpoint_resolver);
    config.set_timeout_config(None);
    config.set_retry_config(None);
    config.set_sleep_impl(None); // avoid aws_smithy_client warning
    let config = config.build();

    eprintln!("built config {:#?}", config);

    let client = aws_sdk_s3::Client::new(&config);
    eprintln!("Got client");
    let res = client.list_buckets().send().await?;
    eprintln!("Got res");
    let buckets = res.buckets().unwrap_or_default();
    let num_buckets = buckets.len();
    eprintln!("event {:#?}, buckets: {}", record, num_buckets);
    Ok(())
}

fn s3_local_client() -> aws_sdk_s3::Client {
    let s3_config_builder = aws_sdk_s3::config::Config::builder()
        .endpoint_resolver(Endpoint::immutable(
            "http://localhost:4566/".parse().expect("valid URI"),
        ));
    aws_sdk_s3::Client::from_conf(s3_config_builder.build())
}

/* THe below is querying the environment which seems to break inside lambda
fn use_localstack() -> bool {
    std::env::var("LOCALSTACK").unwrap_or_default() == "true"
}

fn localstack_endpoint() -> Endpoint {
    Endpoint::immutable(Uri::from_static("http://localhost:4566/"))
}

fn s3_client(conf: &SdkConfig) -> aws_sdk_s3::Client {
    let mut s3_config_builder = aws_sdk_s3::config::Builder::from(conf);
    if use_localstack() {
        s3_config_builder =
            s3_config_builder.endpoint_resolver(localstack_endpoint());
    }
    aws_sdk_s3::Client::from_conf(s3_config_builder.build())
}
*/

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
