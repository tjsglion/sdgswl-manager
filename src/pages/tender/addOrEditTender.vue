<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="标题" prop="title">
          <Input v-model="formValidate.title" placeholder="招标标题"></Input>
      </FormItem>
      <FormItem label="发布时间" prop="publishDate">
          <DatePicker format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="formValidate.publishDate" placeholder="发布时间" style="width: 250px"></DatePicker>
      </FormItem>
      <FormItem label="省份" prop="proId">
          <select class="select-common" v-model="formValidate.proId" placeholder="选择省份" @change="changeProv">
              <option value="">请选择</option>
              <option v-for="pro in provList" :key="pro.pid" :value="pro.pid">{{pro.provincial}}</option>
              <!-- <option value="shanghai">London</option>
              <option value="shenzhen">Sydney</option> -->
          </select>
      </FormItem>
      <FormItem label="城市" prop="cityId">
          <select class="select-common" v-model="formValidate.cityId" placeholder="选择城市" @change="changeCity">
            <option value="">请选择</option>
            <option v-for="city in cityList" :key="city.cid" :value="city.cid">{{city.city}}</option>
          </select>
      </FormItem>
      <FormItem label="浏览次数" prop="watchTimes">
          <InputNumber :min="0" v-model="formValidate.watchTimes" placeholder="浏览次数" style="width: 250px"></InputNumber>
      </FormItem>
      <FormItem label="上传附件">
        <Upload
          type="drag"
          name="url"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :action="uploadServer">
          <div style="padding: 10px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽</p>
          </div>
        </Upload>
        <div class="close-alert" closable v-if="formValidate.url1">{{formValidate.url1}} <Icon class="close-icon" type="close" @click="closeUrl('url1')"></Icon></div>
        <div class="close-alert"  closable v-if="formValidate.url2">{{formValidate.url2}}<Icon class="close-icon" type="close" @click="closeUrl('url2')"></Icon></div>
        <div class="close-alert" closable v-if="formValidate.url3">{{formValidate.url3}} <Icon class="close-icon" type="close" @click="closeUrl('url3')"></Icon></div>
        <div class="close-alert" closable v-if="formValidate.url4">{{formValidate.url4}} <Icon class="close-icon" type="close" @click="closeUrl('url4')" ></Icon> </div>
        <div class="close-alert" closable v-if="formValidate.url5">{{formValidate.url5}} <Icon class="close-icon" type="close" @click="closeUrl('url5')"></Icon></div>
      </FormItem>
      <FormItem label="招标内容" prop="content">
          <Row style="position: relative; z-index: 1;">
            <Col span="24">
              <editor :content.sync="formValidate.content" />
            </Col>
          </Row>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
// import moment from 'moment'
import editor from '@/components/editor/editor'
import {URLS} from '@/fetch/url'
// console.log(moment)
import api from '@/fetch/api'

export default {
  name: 'addOrEditTender',
  components: {editor},
  props: {
    provList: {
      type: Array,
      default: function () {
        return []
      }
    },
    editTender: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate: {
        title: '',
        publishDate: '',
        proName: '',
        proId: '',
        cityId: '',
        cityName: '',
        content: '',
        watchTimes: 0,
        url1: '',
        url2: '',
        url3: '',
        url4: '',
        url5: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '招标标题不能为空', trigger: 'blur' }
        ],
        publishDate: [
          { required: true, type: 'date', message: '招标发布时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '招标内容不能为空', trigger: 'blur' }
        ]
        // proId: [
        //   { required: true, message: '省份不能为空', trigger: 'change' }
        // ],
        // cityId: [
        //   { required: true, message: '城市不能为空', trigger: 'change' }
        // ]
      },
      uploadServer: URLS.UPLOADSERVER,
      uploadList: [],
      cityList: []
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.$emit('addTender', Object.assign({}, this.editTender, this.formValidate, {proName: this.getProvName()}))
        } else {
            this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 上传成功后
    handleSuccess (res, file) {
      if (res) {
        let url = res.url
        let formValidate = this.formValidate
        if (!formValidate.url1) formValidate.url1 = url
        else if (!formValidate.url2) formValidate.url2 = url
        else if (!formValidate.url3) formValidate.url3 = url
        else if (!formValidate.url4) formValidate.url4 = url
        else formValidate.url5 = url
      }
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
    },
    fetchCityByPid (pid) {
      api.QueryCityByPro({pid}).then(res => {
        this.$set(this, 'cityList', res)
      })
    },
    changeProv () {
      // this.formValidate.proId = pid + ''
      this.formValidate.proName = this.getProvName()
      let pid = +this.formValidate.proId
      this.fetchCityByPid(pid)
    },
    changeCity (cid) {
      // debugger;
      // this.formValidate.cityId = cid + ''
      this.formValidate.cityName = this.getCityName()
    },
    getProvName () {
      let provName = ''
      for (let key in this.provList) {
        let el = this.provList[key]
        if (el.pid === +this.formValidate.proId) {
          provName = el.provincial
          break
        }
      }
      return provName
    },
    getCityName () {
      let cityName = ''
      let self = this
      this.cityList.map((city) => {
        if (+self.formValidate.cityId === city.cid) {
          cityName = city.city
        }
      })
      return cityName
    },
    setDefaultValue (obj) {
      let {title, publishDate, proName, proId, cityId, cityName, content, watchTimes, url1, url2, url3, url4, url5} = obj
      this.$set(this.formValidate, 'title', title)
      this.$set(this.formValidate, 'publishDate', publishDate ? new Date(publishDate) : '')
      this.$set(this.formValidate, 'proName', proName)
      this.$set(this.formValidate, 'proId', proId || 16)
      this.$set(this.formValidate, 'cityName', cityName)
      this.$set(this.formValidate, 'cityId', cityId)
      this.$set(this.formValidate, 'content', content)
      this.$set(this.formValidate, 'watchTimes', watchTimes)
      this.$set(this.formValidate, 'url1', url1)
      this.$set(this.formValidate, 'url2', url2)
      this.$set(this.formValidate, 'url3', url3)
      this.$set(this.formValidate, 'url4', url4)
      this.$set(this.formValidate, 'url5', url5)
      // this.formValidate.proName = this.getProvName()
      this.fetchCityByPid(+this.formValidate.proId)
    },
    closeUrl (tab) {
      this.$Modal.confirm({
        title: '删除附件内容',
        content: '您确定要删除该条附件吗, 确定删除后请点击保存！',
        onOk: () => {
          this.formValidate[tab] = ''
        },
        onCancel: () => {
          this.$Message.info('取消删除')
          return false
        }
    })
    }
  },
  mounted () {
    this.setDefaultValue(this.editTender)
  },
  watch: {
    editTender (newVal) {
      this.handleReset('formValidate')
      this.setDefaultValue(newVal)
    }
  }
}
</script>

<style>
.uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .select-common{
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out, background .2s ease-in-out,box-shadow .2s ease-in-out;
}
.close-alert{
  position: relative;
  padding: 8px 48px 8px 16px;
  border-radius: 6px;
  color: #495060;
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 10px;
  border: 1px solid #d5e8fc;
  background-color: #eaf4fe;
}
.close-icon{
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
</style>
