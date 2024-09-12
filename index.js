// 原作者 1977474741 https://github.com/1977474741/vue-inset-loader
// 修改版 Moushudyx
const { parseComponent } = require("vue-template-compiler")
const { generateHtmlCode, generateLabelCode, generateStyleCode, getPagesMap, initPages, getRoute } = require("./utils")

const loaderName = "[ms-inset-loader]"
/** 是否初始化过 */
let _init = false
/** 是否需要做处理 */
let needHandle = false
/** 路由和配置的映射关系 */
let pagesMap = {}

function init(that) {
  _init = true
  const isMp = process.env.UNI_PLATFORM.startsWith("mp")
  // 非小程序环境不予处理
  if (!isMp) {
    console.log(loaderName, "非小程序环境")
    return (needHandle = false)
  }
  // 初始化时解析 pages.json 配置文件，并判断是否为有效配置
  // H5 环境或无效配置不予处理
  needHandle = initPages(that)
  console.log(loaderName, `初始化结果: needHandle: ${needHandle}`)
  console.log(loaderName, `needHandle: ${needHandle}`)
  console.log(loaderName, `pagesMap:\n`, pagesMap)
  // 转换为路由和配置的映射对象
  if (needHandle) pagesMap = getPagesMap()
}

module.exports = function (content) {
  if (!_init) init(this)

  // 配置无效不予处理
  if (!needHandle) return content

  // 获取当前文件的小程序路由
  const route = getRoute(this.resourcePath)
  // 根据路由并找到对应配置
  const curPage = pagesMap[route]
  if (curPage) {
    // 解析sfc
    const compiler = parseComponent(content)
    // 生成标签代码
    const labelCode = generateLabelCode(curPage.label)
    // 匹配标签位置
    const insertReg = new RegExp(`(</${curPage.ele}>$)`)
    // 在匹配的标签之前插入额外标签代码
    const templateCode = generateHtmlCode(compiler.template.content, labelCode, insertReg)
    // 重组 style 标签及内容
    const style = generateStyleCode(compiler.styles || [])
    content = `<template>
  ${templateCode}
</template>
<script${compiler.script?.lang ? ` lang="${compiler.script.lang}"` : ""}>
  ${compiler.script?.content || ""}
</script>
${style}
`
  }
  return content
}
