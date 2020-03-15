<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="年份" prop="year">
        <Select v-model="formValidate.year" filterable>
            <Option v-for="item in getFullYear" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="事件详情" prop="events">
          <Input v-model="formValidate.events" placeholder="大事件描述"/>
      </FormItem>
      <FormItem label="是否精简" prop="simple">
          <Select v-model="formValidate.simple" placeholder="是否精简">
              <Option value="0">否</Option>
              <Option value="1">是</Option>
          </Select>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
  </Form>
</template>
<script>
  import {getAllYear} from '@/utils/utils'
  export default {
    props: {
      editEvents: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      getFullYear () {
        return getAllYear()
      }
    },
    data () {
      return {
        formValidate: {
          year: '',
          events: '',
          simple: ''
        },
        ruleValidate: {
          year: [
            { required: true, message: '年不能为空', trigger: 'change' }
          ],
          events: [
            { required: true, message: '事件不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$emit('addEvents', Object.assign({}, this.editEvents, this.formValidate, {simple: !!(+this.formValidate.simple)}))
          } else {
              this.$Message.error('保存失败')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    },
    mounted () {
      let {year, events, simple} = this.editEvents
      this.$set(this.formValidate, 'year', (year || new Date().getFullYear()))
      // this.formValidate.year = year || new Date().getFullYear()
      this.formValidate.events = events
      this.formValidate.simple = simple + ''
      // console.log(this.formValidate.year)
    },
    watch: {
      editEvents (newVal, oldVal) {
        this.handleReset('formValidate')
        this.formValidate.year = newVal.year + ''
        this.formValidate.events = newVal.events
        this.formValidate.simple = +(!!newVal.simple) + ''
      }
    }
  }
</script>
