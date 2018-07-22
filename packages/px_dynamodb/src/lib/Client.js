const AWS = require('aws-sdk')
let http = require('http')

class Client {
  /**
     *
     * @param dbhost
     */
  constructor (dbhost) {
    AWS.config.update({ region: 'local' })
    const agent = new http.Agent({ maxSockets: 5 })
    this.ddbClient = new AWS.DynamoDB({
      endpoint: new AWS.Endpoint(dbhost),
      httpOptions: { agent: agent }
    }
    )
    this.ddbDocumentClient = new AWS.DynamoDB.DocumentClient({
      endpoint: new AWS.Endpoint(dbhost),
      httpOptions: { agent: agent }
    })
  }

  /**
     * Scan
     *
     * @param tableName
     * @return {Promise<any>}
     */
  async scan (tableName) {
    return new Promise((resolve, reject) => {
      this.ddbClient.scan({ TableName: tableName }, (error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }

  /**
     * ListTables
     *
     * @return {Promise<any>}
     */
  async listTables () {
    return new Promise((resolve, reject) => {
      this.ddbClient.listTables((error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }

  /**
     * DeleteItem
     *
     * @param document
     * @param hashKey
     * @param value
     * @return {Promise<any>}
     */
  async deleteItem (document, hashKey, value) {
    const tableName = document.constructor.name
    const params = {
      TableName: `${process.env.STAGE}-${tableName.toLowerCase()}`,
      Key: {
        [hashKey]: value
      }

    }
    return new Promise((resolve, reject) => {
      this.ddbDocumentClient.delete(params, (error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }

  /**
     * PutItem
     *
     * @param tableName
     * @param document
     * @return {Promise<any>}
     */
  async putItem (tableName, document) {
    const params = {
      Item: document,
      TableName: `${process.env.STAGE}-${tableName.toLowerCase()}`
    }
    return new Promise((resolve, reject) => {
      this.ddbDocumentClient.put(params, (error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }

  /**
     * CreateTable
     *
     * @param params
     * @return {Promise<any>}
     */
  async createTable (params) {
    return new Promise((resolve, reject) => {
      this.ddbClient.createTable(params, (error, data) => {
        if (error) reject(error)
        resolve(data)
      })
    })
  }
}

module.exports = { Client }
