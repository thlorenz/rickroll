# S3 Unzip and Fanout Pipeline

This example reacts to a `zip` file uploaded to an S3 bucket.

When that happens a lambda function will _unzip_ it and fire off an event for each contained
file.

Another lambda function will be instantiated for each file in order to process it.

## Quickstart

Just run the below in a separate terminal:

```
yarn up
```

In a separate terminal run:

```
yarn cdk bootstrap
```

Optionally run this in order to have the CloudFormation templates, etc. generated to
`./cdk.out`:

```
yarn cdk synth
```

Run the below each time you make a change to the setup or code:

````
yarn cdk deploy
```

Then to have a look at our stack and the beautiful s3 bucket:

```
yarn sdk ls
yarn aws s3 ls
```

## LICENSE

MIT
