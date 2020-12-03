class Compiler {
  constructor (vm) {
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }

  // 编译模板，元素节点和文本节点
  compile (el) {
    // 获取 el 中的所有子节点，并转换成数组
    const childNodes = Array.from(el.childNodes)

    // 循环处理每个节点
    childNodes.forEach(node => {
      // 以对象的形式打印节点
      // console.dir(node)

      // 如果是元素节点
      if (this.isElementNode(node)) {
        // 编译指令
        this.compileElement(node)
      }
      // 如果是文本节点
      else if (this.isTextNode(node)) {
        // 编译插值表达式
        this.compileText(node)
      }

      // 判断 node 节点，是否有子节点，如果有子节点，要递归调用 compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    // console.log(node.attributes)
    // 获取所有属性节点，并转换成数组
    const attrs = Array.from(node.attributes)
    attrs.forEach(attr => {
      // 获取属性名称
      let attrName = attr.name

      // 如果是属性是指令，即：v- 开头的属性
      if (this.isDirective(attrName)) {
        // 将 v-text 转换成 text
        attrName = attrName.substr(2)

        // 获取属性值
        let key = attr.value

        // 更新包含不同指令元素的值
        this.update(node, key, attrName)
      }
    })
  }

  // 更新包含不同指令元素的值
  update (node, key, attrName) {
    // 获取不同指令的处理的函数，避免使用 if 判断
    const updater = this[attrName + 'Updater']
    updater && updater.call(this, node, this.vm[key], key)
  }

  // 处理 v-text 指令
  textUpdater (node, value, key) {
    node.textContent = value

    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }

  // 处理 v-model 指令
  modelUpdater (node, value, key) {
    node.value = value

    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })

    // 双向绑定
    node.addEventListener('input', () => {
      // 赋最新的值，会触发响应式机制，从而自动更新视图
      this.vm[key] = node.value
    })
  }

  // 编译文本节点，处理插值表达式
  compileText (node) {
    // console.dir(node)
    // 匹配插值表达式，并获取其中的变量名，如：{{  msg }}
    // .+ 匹配多个字符，后面的 ? 表示：非贪婪模式，尽可能早的结束匹配
    // 小括号表示分组
    const reg = /\{\{(.+?)\}\}/
    // 获取文本节点内容
    const value = node.textContent
    if (reg.test(value)) {
      // 获取第一个小括号匹配到的内容，并去除首尾空格，即：msg
      const key = RegExp.$1.trim()
      // 重 vue 实例上获取对应的数据，替换插值表达式内容
      node.textContent = value.replace(reg, this.vm[key])

      // 创建 Watcher 对象，当数据变化时，更新视图
      new Watcher(this.vm, key, newValue => {
        node.textContent = value.replace(reg, newValue)
      })
    }
  }

  // 判断元素的属性是否式指令
  // vue 中指令都是以 v- 开头的
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }

  // 判断节点是否式文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }
}