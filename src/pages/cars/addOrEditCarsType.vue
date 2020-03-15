<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="车名" prop="carId">
        <Select v-model="formValidate.carId" placeholder="请选择">
            <Option v-for="brand in carBrands" :key="brand.id" :value="brand.id+''">{{brand.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="车类型" prop="name">
          <Input v-model="formValidate.name" placeholder="车类型" />
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
  name: 'addOrEditCarsType',
  props: {
    editCarsType: {
      type: Object,
      default: function () {
        return {}
      }
    },
    carBrands: {
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
        carId: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '车类型不能为空', trigger: 'blur' }
        ],
        carId: [
          { required: true, message: '车名不有为空', trigger: 'change' }
        ]
      },
      icons: CONST.carLogo
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('addCarsType', Object.assign({}, this.editCarsType, this.formValidate))
        } else {
            this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    setDefaultValue (obj) {
      let {name, carId} = obj
      this.$set(this.formValidate, 'name', name)
      this.$set(this.formValidate, 'carId', carId + '')
    }
  },
  mounted () {
    this.setDefaultValue(this.editCarsType)
  },
  watch: {
    editCarsType (newVal) {
      this.handleReset('formValidate')
      this.setDefaultValue(newVal)
    }
  }
}
</script>
