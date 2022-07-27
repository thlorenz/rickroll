// This example requires the following input to succeed:
// { "name": "some name" }

use std::collections::HashMap;

use aws_lambda_events::event::s3::{S3Event, S3EventRecord};
use aws_types::SdkConfig;
use lambda_runtime::{handler_fn, Context, Error};
use log::LevelFilter;
use s3::Endpoint;
use aws_sdk_s3 as s3;
use simple_logger::SimpleLogger;

#[tokio::main]
async fn main() -> Result<(), Error> {
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

    let num_buckets = get_num_buckets(&client).await?;
    eprintln!("buckets: {}", num_buckets);

    let object_metadata = get_object_metadata(&client, &record).await?;
    eprintln!("Metadata: {:#?}", object_metadata);

    Ok(())
}

// -----------------
// Queries
// -----------------
async fn get_num_buckets(client: &aws_sdk_s3::Client) -> Result<usize, Error> {
    let res = client.list_buckets().send().await?;
    let buckets = res.buckets().unwrap_or_default();
    Ok(buckets.len())
}

async fn get_object_metadata(
    client: &aws_sdk_s3::Client,
    record: &S3EventRecord,
) -> Result<Option<HashMap<String, String>>, Error> {
    let res = client
        .head_object()
        .set_bucket(record.s3.bucket.name.as_ref().cloned())
        .set_key(record.s3.object.key.as_ref().cloned())
        .send()
        .await?;
    Ok(res.metadata().cloned())
}

// -----------------
// Setup Helpers
// -----------------
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
