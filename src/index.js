const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  StorageURL,
  AnonymousCredential
} = require('@azure/storage-blob')

module.exports = options => {
  if (!options) {
    throw Error('Missing required input: options')
  }
  if (!options.connectionString) {
    throw Error('Missing required input: options.connectionString')
  }
  const aborter = options.timeout && Number.isInteger(options.timeout)
    ? Aborter.timeout(options.timeout)
    : Aborter.none

  const pipeline = StorageURL.newPipeline(new AnonymousCredential())
  const serviceURL = new ServiceURL(options.connectionString, pipeline)
  let blobURL

  // Container operations
  function createContainer (name) {
    const containerURL = ContainerURL.fromServiceURL(serviceURL, name)
    return containerURL.create(aborter)
  }

  function deleteContainer (name) {
    const containerURL = ContainerURL.fromServiceURL(serviceURL, name)
    return containerURL.delete(aborter)
  }

  function listContainers () {
    return serviceURL.listContainersSegment(aborter)
  }

  // Blob operations
  function streamToString (readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = []
      readableStream.on('data', data => {
        chunks.push(data.toString())
      })
      readableStream.on('end', () => {
        resolve(chunks.join(''))
      })
      readableStream.on('error', reject)
    })
  }

  async function listBlob () {
    return blobURL.listBlobFlatSegment(aborter)
  }

  async function readBlob (filename) {
    if (!filename) {
      throw Error('Filename missing')
    }
    const blockBlobURL = BlockBlobURL.fromContainerURL(blobURL, filename)
    const downloadResponse = await blockBlobURL.download(aborter, 0)
    return streamToString(downloadResponse.readableStreamBody)
  }

  function writeTextBlob (filename, content) {
    if (!filename) {
      throw Error('Filename missing')
    }
    if (!content) {
      throw Error('Content missing')
    }
    if (typeof content !== 'string') {
      throw Error('Content needs to be string')
    }
    const blockBlobURL = BlockBlobURL.fromContainerURL(blobURL, filename)
    return blockBlobURL.upload(aborter, content, content.length)
  }

  function removeBlob (filename) {
    if (!filename) {
      throw Error('Filename missing')
    }
    const blockBlobURL = BlockBlobURL.fromContainerURL(blobURL, filename)
    return blockBlobURL.delete(aborter)
  }

  return {
    list: () => listContainers,
    create: name => createContainer(name),
    remove: name => deleteContainer(name),
    container: containerName => {
      if (!containerName) {
        throw Error('Missing required input: containerName')
      }
      blobURL = ContainerURL.fromServiceURL(serviceURL, containerName)
      return {
        list: () => listBlob,
        readFile: filename => readBlob(filename),
        removeFile: filename => removeBlob(filename),
        writeText: (filename, content) => writeTextBlob(filename, content)
      }
    }
  }
}
