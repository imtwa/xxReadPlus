import SQLiteDB from '../sqlite/index'
import SearchHistoryMapper from '../mapper/SearchHistoryMapper'
import SearchHistoryModel from '../model/SearchHistoryModel'

class SearchHistoryService {
  /**
   * 初始化服务
   */
  static async init() {
    if (!SQLiteDB.isOpen()) {
      await SQLiteDB.open()
    }
    await SearchHistoryMapper.createTable()
  }

  /**
   * 添加历史记录（带查重）
   * @param {string} content 内容
   * @param {string} type 类型
   * @returns {Promise}
   */
  static async add(content, type = 'search') {
    try {
      await this.init()

      // 查重
      const exists = await SearchHistoryMapper.exists(content, type)
      if (exists) {
        return null
      }

      // 创建新记录
      const historyItem = new SearchHistoryModel({
        id: Date.now().toString(),
        content,
        type
      })

      return await SearchHistoryMapper.create(historyItem.toJSON())
    } catch (err) {
      console.error('添加历史记录失败:', err)
      throw err
    }
  }

  /**
   * 获取历史记录列表
   * @param {string} type 类型
   * @returns {Promise<Array>}
   */
  static async getList(type = 'search') {
    try {
      await this.init()
      const items = await SearchHistoryMapper.findAll({ type })
      console.log(items)
      return items.map(item => new SearchHistoryModel(item))
    } catch (err) {
      console.error('获取历史记录失败:', err)
      throw err
    }
  }

  /**
   * 清空指定类型的历史记录
   * @param {string} type 类型
   * @returns {Promise}
   */
  static async clearAll(type = 'search') {
    try {
      await this.init()
      return await SearchHistoryMapper.delete({ type })
    } catch (err) {
      console.error('清空历史记录失败:', err)
      throw err
    }
  }

  /**
   * 删除单条历史记录
   * @param {string} id 记录ID
   * @returns {Promise}
   */
  static async remove(id) {
    try {
      await this.init()
      return await SearchHistoryMapper.delete({ id })
    } catch (err) {
      console.error('删除历史记录失败:', err)
      throw err
    }
  }
}

export default SearchHistoryService
