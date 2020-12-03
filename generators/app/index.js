const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  writing () {
    // 指定模板目录
    const tmpl = this.templatePath('tpls')

    // 输出文件路径
    const output = this.destinationPath('.')

    // 模板数据上下文
    const context = { title: "最小版本的Vue" }

    // 调用父类 fs 模块的 copyTpl 方法
    this.fs.copyTpl(tmpl, output, context)
  }
}