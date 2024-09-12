
# ms-inset-loader

编译阶段在 sfc 模板指定位置插入自定义内容，适用于 webpack 构建的 vue 应用，常用于小程序需要全局引入组件的场景。（由于小程序没有开放根标签，没有办法在根标签下追加全局标签，所以要使用组件必须在当前页面引入组件标签）

常见的使用场景有：在每个页面上添加一个`<my-loading>`实现自定义加载中动画，给每个页面添加一个固定悬浮组件（用于回到顶部、联系客服等）

## 一、安装

```bash
npm install ms-inset-loader --save-dev
```

## 二、vue.config.js 注入 loader

```js
{
    module: {
        rules: [
          {
            test: /\.vue$/,
            use:{
                loader: "ms-inset-loader"
                // // 针对 Hbuilder 工具创建的 uni-app 项目
                // loader: path.resolve(__dirname,"./node_modules/ms-inset-loader")
                // // 直接下载 index.js 和 utils.js 放在项目的 src/loader/ms-inset-loader 目录下
                // loader: path.resolve(__dirname,"./src/loader/ms-inset-loader")
                // // 自定义 pages.json 文件路径
                // options: {
                //     pagesPath: path.resolve(__dirname,'./src/pages.json')
                // }
            }
          }
        ]
    },
}
```

## 三、pages.json 配置文件中添加 insetLoader 配置项

```js
{
    "insetLoader": {
        "config": {
            "loading": "<my-loading ref='loading'></my-loading>",
            "popup": "<my-popup ref='popup'></my-popup>"
        },
        // 全局配置
        "label": ["loading"],
        "rootEle": "view"
    },
    "pages": [
        {
            "path": "pages/tabbar/index/index",
            "style": {
                "navigationBarTitleText": "页面标题",
                // 单独配置，用法跟全局配置一致，优先级高于全局
                "label": ["loading", "popup"],
                "rootEle": "div"
            }
        },
    ]
}
```
###  配置说明

- `config` (默认: `{}`) 定义标签名称和插入内容的键值对
- `label`(默认: `[]`) 需要引入的标签，标签对应的内容在`config`配置
- `rootEle`(默认: `"view"`) 根元素的标签类型，支持正则，如匹配任意标签`.*`

`label`和`rootEle`支持在单独页面的style里配置，优先级高于全局配置

## 四、main.js 中注册全局组件

```js
import MyLoading from './components/my-loading.vue'
import MyPopup from './components/my-popup.vue'

Vue.component('my-loading', MyLoading);
Vue.component('my-popup', MyPopup);
```

## 其他

基于[vue-inset-loader](https://github.com/1977474741/vue-inset-loader)开发，做出了一些简单的调整，如修复了`script`没有内容时会出错的问题、支持带`lang`的`script`标签、默认标签类型从`div`改为了`view`等

- [《引用超级全局组件方案》原作者的文章，其下评论中提到如何兼容 app 端](https://ask.dcloud.net.cn/article/id-39345__page-4#reply)
