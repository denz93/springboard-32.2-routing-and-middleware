import fs from 'node:fs';

export class Database {
  /**
   * 
   * @param {string?} filename 
   */
  constructor(filename) {
    this.dataJSON = {}
    this.filename = filename
  }
  /**
   * 
   * @param {string?} filename 
   */
  init (filename) {
    this.filename = filename
    if (fs.existsSync(this.filename)) {
      this.load()
    } else {
      this.write({})
    }
  }
  load() {
    this.dataJSON = JSON.parse(fs.readFileSync(this.filename, {encoding: 'utf-8', flag: 'r'}))
  }

  write(data) {
    this.dataJSON = data
    fs.writeFileSync(this.filename, JSON.stringify(this.dataJSON, undefined, 0), {encoding: 'utf-8', flag: 'w'})
    return data
  }

  getData() {
    return this.dataJSON
  }
}

export const db = new Database()