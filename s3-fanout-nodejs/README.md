# S3 Upload and Fanout Pipeline

This example reacts to a folder with multiple files uploaded to an S3 bucket.

When that happens a lambda function will fire off an event for each contained
file.

Another lambda function will be instantiated for each file in order to process it.

## Quickstart

Just run the below in a separate terminal:

```
yarn up
```

### Bootstrap

In a separate terminal run:

```
yarn cdk bootstrap
```

### Generate CloudFormation Template

Optionally run this in order to have the CloudFormation templates, etc. generated to
`./cdk.out`:

```
yarn cdk synth
```

### Deploy

Run the below each time you make a change to the setup or code:

````
yarn cdk deploy
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

### Destroying Resources

When done run the below:

```
yarn cdk destroy
yarn aws s3 ls
```

_the last command confirms that our bucket is now gone_

## LICENSE

MIT
