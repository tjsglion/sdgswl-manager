<template>
  <div class="account-wrap">
    <operatenav>
      <Button type="success" @click="addAccount">新增</Button>
    </operatenav>

    <Table :columns="header" :data="datas" :loading="loading"></Table>
    <Row type="flex" justify="end" style="margin-top: 10px;">
      <Col>
        <Page :total="pages.total"
          show-elevator show-sizer
          @on-change="changePage"
          @on-page-size-change="changePageSize"
        ></Page>
      </Col>
    </Row>

    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title" :styles="{top: '20px'}" width="800">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="账号" prop="userName">
            <Input v-model="formValidate.userName" placeholder="账号" />
        </FormItem>
        <FormItem label="密码" prop="password">
            <Input type="password" v-model="formValidate.password" placeholder="密码" />
        </FormItem>
        <FormItem label="邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="邮箱" />
        </FormItem>
        <FormItem label="手机号" prop="phone">
            <Input number :maxlength="11" v-model="formValidate.phone" placeholder="手机号" />
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import api from '@/fetch/api'

export default {
  name: 'account',
  components: {operatenav},
  data () {
    return {
      title: '添加/编辑用户',
      addOrEdit: false,
      isEdit: false,
      editUser: null,
      header: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '账号',
          key: 'userName'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      pages: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      user: {
        'userName': '',
        'password': '',
        'email': '',
        'phone': ''
      },
      formValidate: {
        userName: '',
        password: ''
      },
      ruleValidate: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      },
      datas: [],
      loading: false
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      api.GetAllAccount({pageSize: this.pages.pageSize, pageNo: this.pages.pageNo}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editUser = this.datas[index]
    },
    addAccount () {
      this.isEdit = false
      this.editUser = {}
      this.addOrEdit = true
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let datas = Object.assign({}, this.editUser, this.formValidate)
          api.AddOrEditAccount(datas, !this.isEdit ? 'add' : 'update').then(res => {
            if (res) {
              this.$Message.success(this.isEdit ? '修改成功' : '保存成功')
              this.addOrEdit = false
              this.isEdit = false
              this.fetchData()
            }
          })
          // console.log(this.formValidate)
          // this.$emit('addCars', Object.assign({}, this.editCars, this.formValidate))
        } else {
            this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePage (numb) {
      this.pages.pageNo = numb
      this.fetchData()
    },
    changePageSize (numb) {
      this.pages.pageSize = numb
      this.fetchData()
    },
    setDefaultValue (obj) {
      let {userName, email, phone} = obj
      this.$set(this.formValidate, 'userName', userName)
      // this.$set(this.formValidate, 'password', password)
      this.$set(this.formValidate, 'email', email)
      this.$set(this.formValidate, 'phone', phone)
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    editUser (newVal) {
      this.setDefaultValue(newVal)
    }
  }
}
</script>
