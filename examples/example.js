(async () => {
  require('dotenv').config()
  const log = data => console.log(JSON.stringify(data, null, 2))
  const CONTAINER = 'testcontainer'
  const FILE = 'test.json'
  const storage = require('../src/index')({
    connectionString: process.env.BLOB_SERVICE_SAS_URL
  })
  try {
    // List containers
    log(await storage.listContainers())

    // Create container
    log(await storage.createContainer(CONTAINER))

    // Create container connection
    const container = storage.blob(CONTAINER)

    // List blobs in container
    log(await container.listBlob())

    // Write text to blob
    log(await container.writeTextBlob(FILE, JSON.stringify({ text: 'The world is beautiful' })))

    // Read blob
    log(await container.readBlob(FILE))

    // Delete blob
    log(await container.deleteBlob(FILE))

    // Delete container
    log(await storage.deleteContainer(CONTAINER))
  } catch (error) {
    log(error)
  }
})()
