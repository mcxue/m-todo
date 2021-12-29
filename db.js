import os from 'os'
import path from 'path'
import fs from 'fs/promises'

const home = process.env.HOME || os.homedir()
const dbPath = path.join(home, '.todo')
const db = {
  async read(path = dbPath) {
    const buf = await fs.readFile(path, {
      flag: 'a+'
    })
    let string = buf.toString()
    if (!string) {
      return []
    } else {
      return JSON.parse(string)
    }
  },
  async write(list, path = dbPath) {
    await fs.writeFile(path, JSON.stringify(list) +'\n')
  }
}

export default db