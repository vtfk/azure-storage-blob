(async () => {
  const log = data => console.log(JSON.stringify(data, null, 2))
  const BLOB_SERVICE_SAS_URL = '<BLOB_SERVICE_SAS_URL>'
  const CONTAINER = 'testcontainer'
  const FILE = 'test.json'
  const storage = require('../src/index')({
    connectionString: BLOB_SERVICE_SAS_URL
  })
  try {
    // List containers
    log(await storage.listContainers())

    // Create container
    log(await storage.createContainer(CONTAINER))

    // Create blob connection
    const blob = storage.blob(CONTAINER)

    // List blobs in container
    log(await blob.listBlob())

    // Write text to blob
    log(await blob.writeTextBlob(FILE, JSON.stringify({ text: 'The world is beautiful' })))

    // Read blob
    log(await blob.readBlob(FILE))

    // Delete blob
    log(await blob.deleteBlob(FILE))

    // Delete container
    log(await storage.deleteContainer(CONTAINER))
  } catch (error) {
    log(error)
  }
})()
