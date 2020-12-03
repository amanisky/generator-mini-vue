class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data 中成员的属性名称
    this.key = key
    this.cb = cb
    /**
     * 通过下面 3 步实现在创建 Watcher 对象时，将自身添加到 Dep 类型的 subs 数组中
     */

    // 1、将当前 watcher 对象记录到 Dep 的静态属性 target 中
    Dep.target = this

    // 2、vm[key] 会触发 Observer 类型中的 defineReactive 方法，在创建响应式数据的 get 方法中，会将自己添加到 Dep 的 subs 中
    this.oldValue = vm[key]

    // 3、防止重复添加
    Dep.target = null
  }

  // 更新方法，并传递最新的值得
  update () {
    const newValue = this.vm[this.key]
    if (newValue !== this.oldValue) {
      this.cb(newValue)
    }
  }
}