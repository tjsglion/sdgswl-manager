<template>
  <div class="party-wrapper">
    <operatenav>
      <Button type="success" @click="addContact">新增</Button>
      <!-- <Select v-model="companyId" filterable style="width:200px" @on-change="changeCompany">
          <Option value="">请选择</Option>
          <Option v-for="company in companies" :key="company.id" :value="company.id + ''">{{company.companyName}}</Option>
      </Select> -->
    </operatenav>
    <Table :columns="header" :data="datas" :loading="loading"></Table>
    <!-- 分页 -->
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
        <addOrEditContact @addContactInfo="addContactInfo" v-bind:editContact="editContact" :companies="companies"/>
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditContact from './addOrEditContact'
import * as CONST from '@/utils/consts'
import api from '@/fetch/api'
export default {
  name: 'business',
  components: {operatenav, addOrEditContact},
  data () {
    return {
      header: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'businessScopeId',
          minWidth: 200,
          render: (h, params) => {
            return h('div', this.formatCompany(params.row.businessScopeId))
          }
        },
        {
          title: '姓名',
          key: 'name',
          width: 150
        },
        {
          title: '邮箱',
          key: 'email',
          width: 150
        },
        {
          title: '业务类型',
          key: 'type',
          width: 150,
          render: (h, params) => {
            return h('div', this.formatBusiness(params.row.type))
          }
        },
        {
          title: '电话1',
          key: 'phone1',
          minWidth: 150
        },
        {
          title: '电话2',
          key: 'phone2',
          minWidth: 150
        },
        {
          title: '电话3',
          key: 'phone3',
          minWidth: 150
        },
        {
          title: '电话4',
          key: 'phone4',
          minWidth: 150
        },
        {
          title: '电话5',
          key: 'phone5',
          minWidth: 150
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
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      datas: [],
      addOrEdit: false,
      title: '新增/编辑',
      pages: {
        pageNumber: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      loading: false,
      editContact: {},
      isEdit: false,
      companies: [],
      companyId: ''
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editContact = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
        title: '删除联系人',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          api.DeleteBusinessContact({id}).then(result => {
            if (result) {
              this.$Message.success('删除成功')
              this.fetchData()
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除')
        }
      })
    },
    addContact () {
      this.isEdit = false
      this.editContact = {}
      this.addOrEdit = true
    },
    fetchCompany () {
      api.GetAllCompanyName({companyName: ''}).then(res => {
        this.companies = res
      })
    },
    fetchData () {
      this.loading = true
      api.GETALLBUSINESSCONTACTS({pageNumber: this.pages.pageNumber, pageSize: this.pages.pageSize, companyId: this.companyId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    formatData (times) {
      if (!times) return ''
      return ''
    },
    addContactInfo (data) {
      api.AddOrEditBusinessContact(data, !this.isEdit ? 'add' : 'update').then(res => {
        if (res) {
          this.$Message.success(this.isEdit ? '修改成功' : '保存成功')
          this.addOrEdit = false
          this.isEdit = false
          this.fetchData()
        }
      })
    },
    formatPartyType (type) {
      if (!type) return '-'
      return ''
    },
    formatCompany (id) {
      let name = ''
      // CONST.companyType
      this.companies.map(com => {
        if (com.id === id) name = com.companyName
      })
      return name
    },
    formatBusiness (id) {
      let name = ''
      CONST.businessTypes.map(bus => {
        if (+bus.value === +id) name = bus.label
      })
      return name
    },
    changePage (numb) {
      this.pages.pageNo = numb
      this.fetchData()
    },
    changePageSize (numb) {
      this.pages.pageSize = numb
      this.fetchData()
    },
    changeCompany (id) {
      this.companyId = id
      this.fetchData()
    }
  },
  mounted () {
    this.fetchCompany()
    this.fetchData()
  }
}
</script>
