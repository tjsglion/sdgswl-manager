<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="车名" prop="name">
          <Input v-model="formValidate.name" placeholder="车名" />
      </FormItem>
      <FormItem label="公司" prop="companyId">
          <Select v-model="formValidate.companyId" placeholder="请选择">
              <Option value="">请选择</Option>
              <Option v-for="company in companys" :key="company.id" :value="company.id + ''">{{company.companyName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="logo" prop="icon">
          <Select v-model="formValidate.icon" placeholder="请选择">
              <Option v-for="icon in icons" :key="icon.value" :value="icon.value">{{icon.label}}</Option>
          </Select>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
import * as CONST from '@/utils/consts'
export default {
  name: 'addOrEditCars',
  props: {
    editCars: {
      type: Object,
      default: function () {
        return {}
      }
    },
    companys: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      formValidate: {
        name: '',
        companyId: '',
        icon: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '车名不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '车LOGO不能为空', trigger: 'change' }
        ]
        // companyId: [
        //   { required: true, message: '招标内容不能为空', trigger: 'blur' }
        // ]
      },
      icons: CONST.carLogo
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('addCars', Object.assign({}, this.editCars, this.formValidate))
        } else {
            this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    setDefaultValue (obj) {
      let {name, icon, companyId} = obj
      this.$set(this.formValidate, 'name', name)
      this.$set(this.formValidate, 'icon', icon)
      this.$set(this.formValidate, 'companyId', companyId + '')
    }
  },
  mounted () {
    this.setDefaultValue(this.editCars)
  },
  watch: {
    editCars (newVal) {
      this.handleReset('formValidate')
      this.setDefaultValue(newVal)
    }
  }
}
</script>
