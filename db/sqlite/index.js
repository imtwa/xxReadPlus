/** 数据库实例名称 */
const dbName = 'xxRead'

/**
 * SQLite数据库核心操作类
 */
class SQLiteDB {
  /**
   * 打开数据库，如果不存在则创建
   * @returns {Promise} 返回打开数据库的结果
   */
  static async open() {
    const dbPath = plus.io.convertLocalFileSystemURL(
      `${plus.io.PUBLIC_DOWNLOADS}/${dbName}/${dbName}.db`
    )
    // /storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/www/4/xxRead/xxRead.db
    console.log(dbPath)

    return new Promise((resolve, reject) => {
      plus.sqlite.openDatabase({
        name: dbName,
        path: dbPath,
        success: resolve,
        fail: err => {
          console.error('打开数据库失败:', err)
          reject(err)
        }
      })
    })
  }

  /**
   * 执行SQL查询
   * @param {string} sql SQL语句
   * @returns {Promise<Array>} 查询结果
   */
  static async query(sql) {
    console.log('执行查询:', sql)
    return new Promise((resolve, reject) => {
      plus.sqlite.selectSql({
        name: dbName,
        sql,
        success: resolve,
        fail: err => {
          console.error('查询失败:', err)
          reject(err)
        }
      })
    })
  }

  /**
   * 执行SQL语句
   * @param {string} sql SQL语句
   * @returns {Promise} 执行结果
   */
  static async execute(sql) {
    console.log('执行SQL:', sql)
    return new Promise((resolve, reject) => {
      plus.sqlite.executeSql({
        name: dbName,
        sql,
        success: resolve,
        fail: err => {
          console.error('SQL执行失败:', err)
          reject(err)
        }
      })
    })
  }

  /**
   * 检查数据库是否已打开
   * @returns {boolean} 数据库打开状态
   */
  static isOpen() {
    return plus.sqlite.isOpenDatabase({
      name: dbName,
      path: `_doc/${dbName}.db`
    })
  }

  /**
   * 关闭数据库
   * @returns {Promise} 关闭结果
   */
  static async close() {
    return new Promise((resolve, reject) => {
      plus.sqlite.closeDatabase({
        name: dbName,
        success: resolve,
        fail: err => {
          console.error('关闭数据库失败:', err)
          reject(err)
        }
      })
    })
  }
}

export default SQLiteDB
