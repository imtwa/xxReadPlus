import BaseModel from './BaseModel'

class SearchHistoryModel extends BaseModel {
  constructor(data = {}) {
    super(data)
    this.content = data.content || ''
    this.type = data.type || 'search' // 可以用来区分不同类型的历史记录
  }

  toJSON() {
    return {
      ...super.toJSON(),
      content: this.content,
      type: this.type
    }
  }
}

export default SearchHistoryModel
