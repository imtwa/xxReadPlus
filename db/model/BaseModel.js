class BaseModel {
  constructor(data = {}) {
    this.id = data.id || ''
    this.created_at = data.created_at || 0
    this.updated_at = data.updated_at || 0
  }

  toJSON() {
    return {
      id: this.id,
      created_at: this.created_at,
      updated_at: this.updated_at
    }
  }
}

export default BaseModel
