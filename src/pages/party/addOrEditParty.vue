<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="党建标题" prop="title">
            <Input v-model="formValidate.title" placeholder="党建标题不能为空" />
        </FormItem>
        <FormItem label="发布时间" prop="date">
            <DatePicker format="yyyy-MM-dd HH:mm" type="datetime" v-model="formValidate.date" placeholder="选择发布时间" style="width: 250px"></DatePicker>
        </FormItem>
        <FormItem label="发布者" prop="promulgator">
            <Input v-model="formValidate.promulgator" placeholder="发布者"/>
        </FormItem>
        <FormItem label="党建类型" prop="partyBuildType">
            <Select v-model="formValidate.partyBuildType">
                <Option v-for="opt in partyOps" :key="opt.value" :value="opt.value">{{opt.label}}</Option>
                <!-- <Option value="2">是</Option> -->
            </Select>
        </FormItem>
        <FormItem label="浏览次数" prop="viewTimes">
            <InputNumber :min="1" v-model="formValidate.viewTimes" placeholder="浏览次数" />
        </FormItem>
        <FormItem label="是否置顶">
            <Select v-model="formValidate.isPush">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
            </Select>
        </FormItem>
        <FormItem label="党建内容" prop="content" >
          <Row style="position: relative; z-index: 1;">
            <Col span="24">
              <editor :content.sync="formValidate.content" />
            </Col>
          </Row>
           <!-- <Input v-model="formValidate.content" placeholder="新闻内容不能为空" /> -->
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
    </Form>
</template>
<script>
import editor from '@/components/editor/editor'
export default {
  name: 'addOrEditParty',
  props: {
    editParty: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {editor},
  data () {
    return {
      editor: '',
      formValidate: {
        title: '',
        date: '',
        partyBuildType: '',
        viewTimes: 1,
        isPush: '',
        promulgator: '',
        content: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        date: [
          { required: true, type: 'date', message: '发布日期不能为空', trigger: 'change' }
        ],
        partyBuildType: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      partyOps: [
        {
            value: '1',
            label: '党建动态'
        },
        {
            value: '2',
            label: '党章党规'
        },
        {
            value: '3',
            label: '上级精神'
        },
        {
            value: '4',
            label: '支部风采'
        },
        {
            value: '5',
            label: '廉政频道'
        }
      ]
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('addParty', Object.assign({}, this.editParty, this.formValidate, {isPush: +(!!this.formValidate.isPush), viewTimes: +(this.formValidate.viewTimes || 1)}))
        } else {
          this.$Message.error('保存失败...')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  mounted () {
    let {title, date, partyBuildType, viewTimes, isPush, promulgator, content} = this.editParty
    this.formValidate.title = title
    this.formValidate.date = date
    this.formValidate.partyBuildType = '' + partyBuildType
    this.formValidate.viewTimes = viewTimes
    this.formValidate.isPush = +(!!isPush) + ''
    this.formValidate.promulgator = promulgator
    this.formValidate.content = content
  },
  watch: {
    editParty (newVal, oldVal) {
      this.handleReset('formValidate')
      this.formValidate.title = newVal.title
      if (!newVal.date) this.formValidate.date = null
      else this.formValidate.date = new Date(newVal.date)
      this.formValidate.partyBuildType = '' + newVal.partyBuildType
      this.formValidate.viewTimes = newVal.viewTimes
      this.formValidate.isPush = +(!!newVal.isPush) + ''
      this.formValidate.promulgator = newVal.promulgator
      this.formValidate.content = newVal.content
    }
  }
}
</script>
