<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="新闻标题" prop="title">
            <Input v-model="formValidate.title" placeholder="新闻标题不能为空" />
        </FormItem>
        <FormItem label="发布时间" prop="date">
            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" v-model="formValidate.date" placeholder="选择发布时间" style="width: 250px"></DatePicker>
        </FormItem>
        <FormItem label="发布者" prop="publisher">
            <Input v-model="formValidate.publisher" placeholder="发布者"/>
        </FormItem>
        <FormItem label="新闻类型" prop="type">
            <!-- 1. 集团新闻 2. 媒体报道 3. 通知公告 -->
            <Select v-model="formValidate.type" placeholder="选择新闻类型">
                <Option value="1">集团新闻</Option>
                <Option value="2">行业动态</Option>
                <!-- <Option value="3">通知公告</Option> -->
            </Select>
        </FormItem>
        <FormItem label="浏览次数" prop="count">
            <InputNumber :min="0" v-model="formValidate.count"/>
        </FormItem>
        <FormItem label="是否置顶">
            <Select v-model="formValidate.isPush">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
            </Select>
        </FormItem>

        <FormItem label="新闻摘要" prop="newsAbstract">
            <Input type="textarea" v-model="formValidate.newsAbstract" placeholder="新闻摘要，最多300字" />
        </FormItem>
        <FormItem label="新闻内容" prop="content" >
          <Row style="position: relative; z-index: 1;">
            <Col span="24">
              <editor :content.sync="formValidate.content" :url.sync="formValidate.url"/>
            </Col>
          </Row>
           <!-- <Input v-model="formValidate.content" placeholder="新闻内容不能为空" /> -->
        </FormItem>

         <FormItem label="置顶图片">
          <!-- <Upload :action="uploadServer" type="drag" accept="image/*" name="url" >
              <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload> -->
          <div class="demo-upload-list" v-if="formValidate.url">
            <img :src="formValidate.url">
          </div>
          <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :max-size="2048*10"
              type="drag"
              :action="uploadServer"
              accept="image/*"
              name="url"
              style="display: inline-block;width:58px; vertical-align: top;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="camera" size="20"></Icon>
              </div>
          </Upload>
        </FormItem>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>
<script>
// 导入富文本编辑器
// import Editor from 'wangeditor'
import editor from '@/components/editor/editor'
import {URLS} from '@/fetch/url'

export default {
  name: 'addOrEditNews',
  props: {
    editNews: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  // components: {Editor},
  components: {editor},
  data () {
    return {
      editor: '',
      formValidate: {
        title: '',
        date: '',
        type: 1,
        count: 1,
        isPush: '',
        publisher: '',
        newsAbstract: '', // 新闻摘要
        content: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '新闻标题不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, type: 'date', message: '新闻发布日期不能为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '新闻类型不为能空', trigger: 'change' }
        ],
        newsAbstract: [
          { required: true, message: '新闻摘要不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '新闻内容不能为空', trigger: 'blur' }
        ]
      },
      uploadServer: URLS.UPLOADSERVER
    }
  },
  methods: {
    handleSubmit (name) {
      let self = this
      this.$refs[name].validate((valid) => {
        // console.log(this.formValidate)
        if (valid) {
          this.$emit('addNews', Object.assign({}, self.editNews, self.formValidate, {isPush: !!(+self.formValidate.isPush), count: self.formValidate.count || 1}))
        } else {
          this.$Message.error('保存失败...')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleSuccess (res, file) {
      this.$set(this.formValidate, 'url', res.url)
      // this.formValidate.url = res.url
      // console.log(this.formValidate)
    }
  },
  mounted () {
    let {title, date, type, count, isPush, publisher, newsAbstract, content, url} = this.editNews
    this.formValidate.title = title
    this.formValidate.date = date
    this.formValidate.type = type
    this.formValidate.count = count
    this.formValidate.url = url
    this.formValidate.isPush = +(!!isPush) + ''
    this.formValidate.publisher = publisher
    this.formValidate.newsAbstract = newsAbstract // 新闻摘要
    this.formValidate.content = content
  },
  watch: {
    editNews (newVal, oldVal) {
      this.handleReset('formValidate')
      this.formValidate.title = newVal.title
      if (!newVal.date) this.formValidate.date = null
      else this.formValidate.date = new Date(newVal.date)
      this.formValidate.type = '' + newVal.type
      this.formValidate.count = newVal.count
      this.formValidate.url = newVal.url
      this.formValidate.isPush = +(!!newVal.isPush) + ''
      this.formValidate.publisher = newVal.publisher
      this.formValidate.newsAbstract = newVal.newsAbstract // 新闻摘要
      this.formValidate.content = newVal.content
      // this.editor.txt.html(this.formValidate.content)
    }
  }
}
</script>

<style lang="less" scoped>
.demo-upload-list{
    display: inline-block;
    vertical-align: top;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
</style>
