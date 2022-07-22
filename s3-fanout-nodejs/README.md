# S3 Upload and Fanout Pipeline

## Original Goal

This example reacts to a folder with multiple files uploaded to an S3 bucket.

When that happens a lambda function will fire off an event for each contained
file.

Another lambda function will be instantiated for each file in order to process it.

## Actual Implementation

Turns out that we receive an S3 event for each uploaded file (not for each folder like assumed
originally).

Thus the _fanout_ function is kinda doing the opposite it was intended to originally.

It groups an asset with its associated metadata via proper keys specified as part of
_put-object_. Those two files can then be passed on to another lambda to process (or the
_fanout_ lambda itself could do so).

## Quickstart

Just run the below in a separate terminal:

```
yarn up
```

### Bootstrap

In a separate terminal run:

```
yarn boot
```

### Generate CloudFormation Template

Optionally run this in order to have the CloudFormation templates, etc. generated to
`./cdk.out` without deploying anything:

```
yarn cdk synth
```

### Deploy

Run the below each time you make a change to the setup or code:

```
yarn deploy
```

_Optionally_ run the below the diff we're about to deploy _before_ executing the above:

```
yarn cdk diff
```

### Query App State

Then to have a look at our stack and the beautiful s3 bucket:

```
yarn cdk ls
yarn aws s3 ls
```

### Upload Some Images

```
./sh/upload-images.ts
```

This will upload multiple images and trigger the lambda upload handler for each.

### Destroying Resources

When done run the below:

```
yarn cdk destroy
yarn aws s3 ls
```

_the last command confirms that our bucket is now gone_

## LICENSE

MIT
