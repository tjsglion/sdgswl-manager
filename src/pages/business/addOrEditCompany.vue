<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="公司名称" prop="companyName">
          <Input v-model="formValidate.companyName" placeholder="公司名称" />
      </FormItem>
      <FormItem label="公司介绍" prop="companyAbstract">
          <Input v-model="formValidate.companyAbstract" type="textarea" placeholder="公司介绍" />
      </FormItem>
      <FormItem label="公司类型" prop="companyType">
          <Select v-model="formValidate.companyType" placeholder="请选择">
              <Option value="">请选择</Option>
              <Option v-for="type in companyTypes" :key="type.value" :value="type.value">{{type.label}}</Option>
          </Select>
      </FormItem>
      <FormItem label="公司图片" prop="companyImage">
          <div class="demo-upload-list" v-if="formValidate.companyImage">
            <img :src="formValidate.companyImage">
          </div>
          <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess"
              :max-size="2048"
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
      <FormItem label="公司地址" prop="detailAddress">
          <Input v-model="formValidate.detailAddress" placeholder="公司地址" />
      </FormItem>
      <FormItem label="公司详情" prop="companyDetail">
          <Input v-model="formValidate.companyDetail" :row="10" type="textarea" placeholder="公司详情" />
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
import {URLS} from '@/fetch/url'
import * as CONST from '@/utils/consts'
export default {
  name: 'addOrEditCompany',
  props: {
    editCompany: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      formValidate: {
        companyName: '',
        companyAbstract: '',
        companyType: '',
        companyImage: '',
        companyDetail: '',
        detailAddress: ''
      },
      ruleValidate: {
        companyName: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        companyAbstract: [
          { required: true, message: '公司介绍不能为空', trigger: 'blur' }
        ],
        companyType: [
          { required: true, message: '公司类型不能为空', trigger: 'change' }
        ],
        companyImage: [
          { required: true, message: '公司图片不能为空', trigger: 'blur' }
        ],
        companyDetail: [
          { required: true, message: '公司详情不能为空', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '公司地址不能为空', trigger: 'blur' }
        ]
      },
      uploadServer: URLS.UPLOADSERVER,
      companyTypes: CONST.companyType
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('addCompany', Object.assign({}, this.editCompany, this.formValidate))
        } else {
            this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    setDefaultValue (obj) {
      let {companyName, companyAbstract, companyType, companyImage, companyDetail, detailAddress} = obj
      this.$set(this.formValidate, 'companyName', companyName)
      this.$set(this.formValidate, 'companyAbstract', companyAbstract)
      this.$set(this.formValidate, 'companyType', companyType + '')
      this.$set(this.formValidate, 'companyImage', companyImage)
      this.$set(this.formValidate, 'companyDetail', companyDetail)
      this.$set(this.formValidate, 'detailAddress', detailAddress)
    },
    handleSuccess (res, file) {
      let {url} = res
      this.$set(this.formValidate, 'companyImage', url)
    }
  },
  mounted () {
    this.setDefaultValue(this.editCompany)
  },
  watch: {
    editCompany (newVal) {
      this.handleReset('formValidate')
      this.setDefaultValue(newVal)
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
    width: 60px;
    height: 60px;
}
</style>
