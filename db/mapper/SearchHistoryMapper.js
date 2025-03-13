import BaseMapper from './BaseMapper'

class SearchHistoryMapper extends BaseMapper {
  static tableName = 'search_history'

  static async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at INTEGER,
        updated_at INTEGER
      )
    `
    return super.createTable(sql)
  }

  /**
   * 检查历史记录是否存在
   * @param {string} content 内容
   * @param {string} type 类型
   * @returns {Promise<boolean>}
   */
  static async exists(content, type = 'search') {
    const result = await this.findAll({
      content,
      type
    })
    return result.length > 0
  }

  /**
   * 清空指定类型的历史记录
   * @param {string} type 类型
   * @returns {Promise}
   */
  static async clearByType(type) {
    return this.delete({ type })
  }

  /**
   * 按类型获取历史记录
   * @param {string} type 类型
   * @returns {Promise<Array>}
   */
  static async findByType(type) {
    return this.findAll({ type })
  }
}

export default SearchHistoryMapper
