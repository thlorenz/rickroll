# Grouping of Uploads

Below I quickly examined if there is a way to identify files that were uploaded together as is
done inside `./sh/upload-images.ts`. However I can't see a surefire way to identify that group.

For that [S3 Post
policy](https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html)
might be the solution instead.

## Full Folder Upload

### Uploading one Image At a Time

#### First Upload

```js
{
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'us-east-1',
  eventTime: '2022-07-21T22:14:31.498Z',
  eventName: 'ObjectCreated:Put',
  userIdentity: { principalId: 'AIDAJDPLRKLG7UEXAMPLE' },
  requestParameters: { sourceIPAddress: '127.0.0.1' },
  responseElements: {
    'x-amz-request-id': 'ecc73970',
    'x-amz-id-2': 'eftixk72aD6Ap51TnqcoF8eFidJG9Z/2'
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 's3eventtriggerslambda',
    bucket: {
      name: 's3fanoutstack-uploadbucketd2c1da78-bec343f4',
      ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
      arn: 'arn:aws:s3:::s3fanoutstack-uploadbucketd2c1da78-bec343f4'
    },
    object: {
      key: '01_80x80.png',
      size: 1563,
      eTag: '"0a7a240e3d835bb73f8485829fe2648b"',
      versionId: '6b79e2f4-37e0-47ba-8f57-f757a2a1e4ef',
      sequencer: '0055AED6DCD90281E5'
    }
  }
}
```

#### Second Upload

```js
{
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'us-east-1',
  eventTime: '2022-07-21T22:16:09.280Z',
  eventName: 'ObjectCreated:Put',
  userIdentity: { principalId: 'AIDAJDPLRKLG7UEXAMPLE' },
  requestParameters: { sourceIPAddress: '127.0.0.1' },
  responseElements: {
    'x-amz-request-id': 'e85e2c9c',
    'x-amz-id-2': 'eftixk72aD6Ap51TnqcoF8eFidJG9Z/2'
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 's3eventtriggerslambda',
    bucket: {
      name: 's3fanoutstack-uploadbucketd2c1da78-bec343f4',
      ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
      arn: 'arn:aws:s3:::s3fanoutstack-uploadbucketd2c1da78-bec343f4'
    },
    object: {
      key: '01_80x80.png',
      size: 1563,
      eTag: '"0a7a240e3d835bb73f8485829fe2648b"',
      versionId: '6903b8d6-3f76-4b29-bfbd-6aa2e8be84df',
      sequencer: '0055AED6DCD90281E5'
    }
  }
}
```

### Uploading Two Images Together

Outside from the `sourceIpAddress` there seems to be no way to know that they were uploaded
together, however that IP matches as well if assets are uploaded separately from the same
machine.

Same goes for `UserId`.

#### First Image

```js
{
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'us-east-1',
  eventTime: '2022-07-21T22:33:33.707Z',
  eventName: 'ObjectCreated:Put',
  userIdentity: { principalId: 'AIDAJDPLRKLG7UEXAMPLE' },
  requestParameters: { sourceIPAddress: '127.0.0.1' },
  responseElements: {
    'x-amz-request-id': 'a576b80b',
    'x-amz-id-2': 'eftixk72aD6Ap51TnqcoF8eFidJG9Z/2'
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 's3eventtriggerslambda',
    bucket: {
      name: 's3fanoutstack-uploadbucketd2c1da78-9ec866d5',
      ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
      arn: 'arn:aws:s3:::s3fanoutstack-uploadbucketd2c1da78-9ec866d5'
    },
    object: {
      key: '02_80x80.png',
      size: 2292,
      eTag: '"522848ff65f8686d76232f701cdf4892"',
      versionId: 'cf176968-6a3e-4fd5-96f7-6e4f325b8c36',
      sequencer: '0055AED6DCD90281E5'
    }
  }
}
```

#### Second Image

```js
{
  eventVersion: '2.1',
  eventSource: 'aws:s3',
  awsRegion: 'us-east-1',
  eventTime: '2022-07-21T22:33:33.701Z',
  eventName: 'ObjectCreated:Put',
  userIdentity: { principalId: 'AIDAJDPLRKLG7UEXAMPLE' },
  requestParameters: { sourceIPAddress: '127.0.0.1' },
  responseElements: {
    'x-amz-request-id': '85bfc92b',
    'x-amz-id-2': 'eftixk72aD6Ap51TnqcoF8eFidJG9Z/2'
  },
  s3: {
    s3SchemaVersion: '1.0',
    configurationId: 's3eventtriggerslambda',
    bucket: {
      name: 's3fanoutstack-uploadbucketd2c1da78-9ec866d5',
      ownerIdentity: { principalId: 'A3NL1KOZZKExample' },
      arn: 'arn:aws:s3:::s3fanoutstack-uploadbucketd2c1da78-9ec866d5'
    },
    object: {
      key: '01_80x80.png',
      size: 1563,
      eTag: '"0a7a240e3d835bb73f8485829fe2648b"',
      versionId: 'dd60eecd-a38a-41e5-9611-dcb9981d9639',
      sequencer: '0055AED6DCD90281E5'
    }
  }
}
```
