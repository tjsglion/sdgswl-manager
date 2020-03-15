<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="公司名称" prop="businessScopeId">
          <Select v-model="formValidate.businessScopeId" placeholder="请选择">
              <Option value="">请选择</Option>
              <Option v-for="company in companies" :key="company.id" :value="company.id + ''">{{company.companyName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="输入姓名" />
      </FormItem>
      <FormItem label="邮箱" prop="email">
          <Input type="email" v-model="formValidate.email" placeholder="输入邮箱" />
      </FormItem>
      <FormItem label="业务类型" prop="type">
          <Select v-model="formValidate.type" placeholder="选择业务类型">
              <Option value="">请选择</Option>
              <Option v-for="business in businessTypes" :key="business.value" :value="business.value">{{business.label}}</Option>
          </Select>
      </FormItem>
      <FormItem label="电话1" prop="phone1">
          <Input v-model="formValidate.phone1" placeholder="输入电话1" />
      </FormItem>
      <FormItem label="电话2" prop="phone2">
          <Input v-model="formValidate.phone2" placeholder="输入电话2" />
      </FormItem>
      <FormItem label="电话3" prop="phone3">
          <Input v-model="formValidate.phone3" placeholder="输入电话3" />
      </FormItem>
      <FormItem label="电话4" prop="phone4">
          <Input v-model="formValidate.phone4" placeholder="输入电话4" />
      </FormItem>
      <FormItem label="电话5" prop="phone5">
          <Input v-model="formValidate.phone5" placeholder="输入电话5" />
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
    name: 'addOrEditContact',
    props: {
      companies: {
        type: Array,
        default: function () {
          return []
        }
      },
      editContact: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        formValidate: {
          businessScopeId: '',
          name: '',
          email: '',
          type: '',
          phone1: '',
          phone2: '',
          phone3: '',
          phone4: '',
          phone5: ''
        },
        ruleValidate: {
          businessScopeId: [
            { required: true, message: '公司不能为空', trigger: 'change' }
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '业务类型不能为空', trigger: 'change' }
          ],
          email: [
            { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
          ],
          phone1: [
            { required: true, message: '电话号码不能为空', trigger: 'blur' }
          ]
        },
        businessTypes: CONST.businessTypes
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
              this.$emit('addContactInfo', Object.assign({}, this.editContact, this.formValidate), {businessScopeId: +this.formValidate.type, type: +this.formValidate.type})
              // this.$Message.success('Success!')
          } else {
              this.$Message.error('Fail!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      setDefaultValue (obj) {
        let {businessScopeId, name, email, type, phone1, phone2, phone3, phone4, phone5} = obj
        this.$set(this.formValidate, 'businessScopeId', businessScopeId + '')
        this.$set(this.formValidate, 'name', name)
        this.$set(this.formValidate, 'email', email)
        this.$set(this.formValidate, 'type', type + '')
        this.$set(this.formValidate, 'phone1', phone1)
        this.$set(this.formValidate, 'phone2', phone2)
        this.$set(this.formValidate, 'phone3', phone3)
        this.$set(this.formValidate, 'phone4', phone4)
        this.$set(this.formValidate, 'phone5', phone5)
      }
    },
    mounted () {
      this.setDefaultValue(this.editContact)
    },
    watch: {
      editContact (newVal) {
        this.handleReset('formValidate')
        this.setDefaultValue(newVal)
      }
    }
  }
</script>
