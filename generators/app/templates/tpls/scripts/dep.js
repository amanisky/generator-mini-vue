class Dep {
  constructor () {
    // 存储所有观察者
    this.subs = []
  }

  // 添加观察者
  addSub (sub) {
    // 如果 sub 存在，并且存在 update 方法
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  // 发送通知
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}