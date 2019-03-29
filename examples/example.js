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
    log(await storage.list())

    // Create container
    log(await storage.create(CONTAINER))

    // Create container connection
    const container = storage.container(CONTAINER)

    // List blobs in container
    log(await container.list())

    // Write text to blob
    log(await container.writeText(FILE, JSON.stringify({ text: 'The world is beautiful' })))

    // Read blob
    log(await container.readFile(FILE))

    // Delete blob
    log(await container.removeFile(FILE))

    // Delete container
    log(await storage.remove(CONTAINER))
  } catch (error) {
    console.log('ERROR:')
    log(error)
  }
})()
