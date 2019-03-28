# (WIP) azure-blob-storage

Convenience wrapper around [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob)

# Install

```bash
npm i --save @telemark/azure-storage-blob
```

# API

## Connection

Currently it only supports Shared Access Signature (SAS)

Go to https://portal.azure.com

Storage accounts -> <Your Storage account> -> Shared access signature

Generate a SAS with desired `start` and `end` time.

Copy and use `Blob service SAS URL` as `connectionString`

```js
const storage = require('@telemark/azure-blob-storage')({
  connectionString: '<BLOB_SERVICE_SAS_URL>'
})
```

## Container operations


### List containers in storage account

```js
const { containerItems } = await storage.listContainers()
```

### Create a container

```js
await storage.createContainer('containername')
```

### Delete a container

```js
await storage.deleteContainer('containername')
```

## Blob operations

First, connect to a desired container

```js
const container = storage.container('containername')
```

### List blobs in container

```js
const { segment: { blobItems } = await container.listBlob()
```

### Write text to blob

```js
await container.writeTextBlob('test.json', JSON.stringify({ text: 'One thought fills immensity.' }))
```

### Read blob

```js
const content = await container.readBlob('test.json')
```

### Delete blob

```js
await container.deleteBlob('test.json')
```

# Examples

See [examples/example.js](examples/example.js)

To run `example.js` create file `.env` in project root with following content

```
BLOB_SERVICE_SAS_URL=<OB_SERVICE_SAS_URL>
```

And run `npm run example`




# License

[MIT](LICENSE)
