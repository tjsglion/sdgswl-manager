<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <FormItem label="车辆类型" prop="typeId">
          <Select v-model="formValidate.typeId" placeholder="请选择">
              <Option value="">请选择</Option>
              <Option v-for="type in carsTypes" :key="type.id" :value="type.id + ''">{{type.name}}</Option>
          </Select>
      </FormItem>
    <FormItem label="车辆图片" prop="image">
          <div class="demo-upload-list" v-if="formValidate.image">
            <img :src="formValidate.image">
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
      <FormItem label="车辆款式" prop="carModel">
          <Input v-model="formValidate.carModel" placeholder="车的款式" />
      </FormItem>
      <FormItem label="车辆排量" prop="volume">
          <Input v-model="formValidate.volume" placeholder="车的排量" />
      </FormItem>
      <FormItem label="描述信息" prop="detail">
        <Input type="textarea" v-model="formValidate.detail" placeholder="描述信息" />
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
import {URLS} from '@/fetch/url'
export default {
  name: 'addOrEditCarsDesc',
  props: {
    editCarsDesc: {
      type: Object,
      default: function () {
        return {}
      }
    },
    carsTypes: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      formValidate: {
        typeId: '',
        image: '',
        carModel: '',
        volume: '',
        detail: ''
      },
      ruleValidate: {
        typeId: [
          { required: true, message: '车辆型号不能为空', trigger: 'blur' }
        ],
        image: [
          { required: true, message: '车辆图片不能为空', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '车辆详述信息不能为空', trigger: 'blur' }
        ]
      },
      uploadServer: URLS.UPLOADSERVER
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('addCarsDesc', Object.assign({}, this.editCarsDesc, this.formValidate), {typeId: +this.formValidate.typeId})
        } else {
            this.$Message.error('操作失败')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleSuccess (res, file) {
      let {url} = res
      this.$set(this.formValidate, 'image', url)
    },
    setDefaultValue (obj) {
      let {typeId, image, carModel, volume, detail} = obj
      this.$set(this.formValidate, 'typeId', typeId + '')
      this.$set(this.formValidate, 'image', image)
      this.$set(this.formValidate, 'carModel', carModel)
      this.$set(this.formValidate, 'volume', volume)
      this.$set(this.formValidate, 'detail', detail)
    }
  },
  mounted () {
    this.setDefaultValue(this.editCarsDesc)
  },
  watch: {
    editCarsDesc (newVal) {
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
