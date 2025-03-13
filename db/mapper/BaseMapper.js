import SQLiteDB from '../sqlite'

class BaseMapper {
  static tableName = ''

  /**
   * 创建表
   * @param {string} sql 建表SQL
   * @returns {Promise}
   */
  static async createTable(sql) {
    return SQLiteDB.execute(sql)
  }

  /**
   * 通用查询方法
   * @param {Object} where 查询条件
   * @returns {Promise<Array>}
   */
  static async findAll(where = {}) {
    const conditions = Object.entries(where)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ')

    const sql = `SELECT * FROM ${this.tableName} ${conditions ? 'WHERE ' + conditions : ''}`
    return SQLiteDB.query(sql)
  }

  /**
   * 通用插入方法
   * @param {Object} data 数据对象
   * @returns {Promise}
   */
  static async create(data) {
    const now = Date.now()
    data.created_at = now
    data.updated_at = now

    const fields = Object.keys(data)
    const values = Object.values(data)

    const sql = `
      INSERT INTO ${this.tableName} 
      (${fields.join(', ')}) 
      VALUES (${values.map(v => `'${v}'`).join(', ')})
    `
    return SQLiteDB.execute(sql)
  }

  /**
   * 批量插入数据
   * @param {Array<Object>} dataList 数据列表
   * @returns {Promise}
   */
  static async batchCreate(dataList) {
    if (!dataList || dataList.length === 0) {
      return Promise.reject('数据列表为空')
    }

    const now = Date.now()
    dataList = dataList.map(data => ({
      ...data,
      created_at: now,
      updated_at: now
    }))

    const fields = Object.keys(dataList[0])
    const values = dataList
      .map(
        item =>
          `(${fields
            .map(field =>
              typeof item[field] === 'object'
                ? `'${JSON.stringify(item[field])}'`
                : `'${item[field]}'`
            )
            .join(',')})`
      )
      .join(',')

    const sql = `INSERT OR IGNORE INTO ${this.tableName} (${fields.join(',')}) VALUES ${values}`
    return SQLiteDB.execute(sql)
  }

  /**
   * 更新数据
   * @param {Object} data 更新的数据
   * @param {Object} where 条件
   * @returns {Promise}
   */
  static async update(data, where) {
    data.updated_at = Date.now()

    const setStr = Object.entries(data)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(',')

    const whereStr = Object.entries(where)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ')

    const sql = `UPDATE ${this.tableName} SET ${setStr} WHERE ${whereStr}`
    return SQLiteDB.execute(sql)
  }

  /**
   * 删除数据
   * @param {Object} where 条件
   * @returns {Promise}
   */
  static async delete(where) {
    const whereStr = Object.entries(where)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ')

    const sql = `DELETE FROM ${this.tableName} WHERE ${whereStr}`
    return SQLiteDB.execute(sql)
  }

  /**
   * 获取表数据总条数
   * @returns {Promise<number>}
   */
  static async count() {
    const result = await SQLiteDB.query(`SELECT COUNT(*) as count FROM ${this.tableName}`)
    return result[0].count
  }

  /**
   * 分页查询
   * @param {number} pageNum 页码
   * @param {number} pageSize 每页条数
   * @param {string} orderBy 排序字段
   * @param {string} orderType 排序类型 (ASC/DESC)
   * @returns {Promise<Array>}
   */
  static async findByPage(pageNum = 1, pageSize = 10, orderBy = '', orderType = 'DESC') {
    let sql = `SELECT * FROM ${this.tableName}`

    if (orderBy) {
      sql += ` ORDER BY ${orderBy} ${orderType}`
    }

    const offset = (pageNum - 1) * pageSize
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`

    return SQLiteDB.query(sql)
  }

  /**
   * 创建索引
   * @param {string} indexName 索引名
   * @param {string} fieldName 字段名
   * @returns {Promise}
   */
  static async createIndex(indexName, fieldName) {
    return SQLiteDB.execute(
      `CREATE INDEX IF NOT EXISTS ${indexName} ON ${this.tableName} (${fieldName})`
    )
  }

  /**
   * 检查索引是否存在
   * @param {string} indexName 索引名
   * @returns {Promise<boolean>}
   */
  static async hasIndex(indexName) {
    const result = await SQLiteDB.query(
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='index' AND name='${indexName}' AND tbl_name='${this.tableName}'`
    )
    return result[0].count > 0
  }
}

export default BaseMapper
