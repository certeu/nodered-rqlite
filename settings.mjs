import path from 'node:path'
import storageModule from './rqlite-storage.mjs'

const settings = {
  flowFile: 'flows.json',
  storageModule,
}

export default settings
