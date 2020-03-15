<template>
  <div class="editor-wrapper">
    <div ref="editor"></div>
  </div>
</template>

<script>
import Editor from 'wangeditor'
import {URLS} from '@/fetch/url'
export default {
  name: 'editor',
  props: {
    content: { // 编辑器内容
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorCtx: null
    }
  },
  methods: {
    setEditorCtx () {
      this.editor.txt.html(this.content)
    },
    getEditorCtx () {
      return this.editorCtx
    },
    clearEditorCtx () {
      this.editor.txt.clear()
    }
  },
  mounted () {
    this.editor = new Editor(this.$refs.editor)
    // this.editor.customConfig.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0
    /** 配置菜单 */
    this.editor.customConfig.menu = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    // 图片上传服务器地址
    this.editor.customConfig.uploadImgServer = URLS.UPLOADSERVER
    // 自定义文件
    this.editor.customConfig.uploadFileName = 'url'
    // 图片头部信息
    // this.editor.customConfig.uploadImgHeaders = {
    //   'Accept': '*/*'
    // }
    this.editor.customConfig.uploadImgMaxLength = 5 /* 限制一次最多上传5张图片 */
    this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024 /* 将图片大小限制为3M默认为5M */
    // 自定义图片上传
    // this.editor.customConfig.customUploadImg = async (files, insert) => {
    //   // files 是 input 中选中的文件列表
    //   let formData = new FormData()
    //   formData.append('file', files[0])
    //   let data = await this.upload(formData)
    //   // upload 方法是后台提供的上传图片接口
    //   // insert 是编辑器自带的获取图片 url 后，插入到编辑器的方法  上传代码返回结果之后，将图片插入到编辑器中
    //   insert(data.imgUrl)
    // }
    // // 内容改变时，将内容赋值给变量
    this.editor.customConfig.onchange = (html) => {
      this.editorCtx = html
      this.$emit('update:content', this.editorCtx)
    }
    let self = this
    this.editor.customConfig.uploadImgHooks = {
      customInsert: function (insertImg, result, editor) {
        let url = result.url
        self.$emit('update:url', url)
        insertImg(url)
      }
      // fail: function (xhr, editor, result) {
      //   console.log('上传失败', result)
      // },
      // success: function (xhr, editor, result) {
      //   console.log('上传返回结果', result)
      // }
    }
    this.editor.create()
  },
  destroyed () {
    let self = this
    try {
      self.editor && self.editor.destroy()
    } catch (e) {
    }
  },
  watch: {
    content (newVal) {
      !newVal ? this.clearEditorCtx() : this.setEditorCtx(newVal)
    }
  }
}
</script>
