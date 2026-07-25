const storage = {
  getItem(key: string) {
    return Promise.resolve(window.localStorage.getItem(key))
  },
  setItem(key: string, value: string) {
    return Promise.resolve(window.localStorage.setItem(key, value))
  },
  removeItem(key: string) {
    return Promise.resolve(window.localStorage.removeItem(key))
  },
}

export default storage
