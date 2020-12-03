class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    // 1、判断 data 是否是对象
    if (!data || typeof data !== 'object') {
      return
    }

    // 2、如果是对象，遍历 data 对象所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    // 如果 val 是对象，会把这个对象的成员也转换成响应式对象（即：getter / setter 形式）
    this.walk(val)
    const self = this
    // 创建 Dep 实例，负责收集依赖和发送通知
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 3、收集依赖
        // Dep 类是否有静态属性 target
        // Dep.target 存储着观察者
        Dep.target && dep.addSub(Dep.target)
        // 为什么要传递第三个参数 val？而不是返回 obj[key]？
        // 会造成堆栈溢出错误（死递归）（Uncaught RangeError: Maximum call stack size exceeded）
        // 因为在外部访问 vm.msg 时，Vue 类型中代理了一次，在 Vue 的构造函数中，又通过 observer 对象，代理了 this.$data，会造成循环代理
        // 所以，此处应直接返回值 val，val 是一个形参，函数执行完毕后会释放，为什么没释放？
        // 因为，此处 obj 参数其实是 this.$data 对象，在 Vue 的构造函数中，this.$data 引用了 get 方法，而 get 方法用到了 val 变量，就形成了闭包
        return val
      },
      set (newValue) {
        if (newValue !== val) {
          val = newValue
          // 如果设置的值是一个对象，得将其属性转换成响应式数据
          self.walk(newValue)
          // 4、发送通知
          dep.notify()
        }
      }
    })
  }
}