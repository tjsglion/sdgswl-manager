vuex 的使用请参考文档 :  https://vuex.vuejs.org/zh-cn/

store中主要是定义 vuex 中需要用到的内容

types.js  定义事件名  用常量表示  请严格按这种方式来编写代码
                     方便后期维护及国际化


每一个页面中需要的 属性或方法 都以模块化的方式 编写
只需要在 modules 中添加对应的 页面的js  然后在 modules 下的 index.js 中引入你添加的js就可以了
原则上  添加的 js  最好和 .vue 页面名字相同


