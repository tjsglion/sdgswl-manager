<template>
  <div class="company-wrapper">
    <operatenav>
      <Button type="success" @click="addCompany">新增</Button>
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

    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title" :styles="{top: '20px'}"
      width="800">
        <addOrEditCompany @addCompany="addCompanyInfo"
          v-bind:editCompany="editCompany"
        />
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditCompany from './addOrEditCompany'
import * as CONST from '@/utils/consts'
import api from '@/fetch/api'
export default {
  name: 'company',
  components: {operatenav, addOrEditCompany},
  data () {
    return {
      header: [
        {
          type: 'index',
          width: 50,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '公司名称',
          width: 150,
          key: 'companyName'
        },
        {
          title: '公司地址',
          width: 200,
          key: 'detailAddress'
        },
        {
          title: '公司类型',
          width: 100,
          key: 'companyType',
          render: (h, params) => {
            return h('div', this.formatCompanyType(params.row.companyType))
          }
        },
        {
          title: '公司简介',
          key: 'companyAbstract',
          minWidth: 300
        },
        {
          title: '公司详情',
          key: 'companyDetail',
          minWidth: 500
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
      editCompany: {},
      isEdit: false,
      companyType: ''
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editCompany = this.datas[index]
    },
    delete (index) {
      // console.log(this.datas[index])
      this.$Modal.confirm({
        title: '删除公司',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          api.DeleteBusiness({id}).then(result => {
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
    formatCompanyType (id) {
      let name = ''
      CONST.companyType.map(type => {
        if (+type.value === +id) name = type.label
      })
      return name
    },
    addCompany () {
      this.isEdit = false
      this.editCompany = {}
      this.addOrEdit = true
    },
    fetchData () {
      this.loading = true
      // 分页查找公司信息
      api.GetAllBusiness({pageNumber: this.pages.pageNumber, pageSize: this.pages.pageSize, companyType: this.companyType}).then(res => {
        this.loading = false
        let {count, pageNumber, list, pageSize} = res
        this.pages.pageNumber = pageNumber || 1
        this.pages.total = count
        this.pages.current = pageSize || 1
        this.$set(this, 'datas', list)
      })
    },
    addCompanyInfo (data) {
      // 保存公司信息
      api.AddOrEditBusiness(data, !this.isEdit ? 'add' : 'update').then(res => {
        if (res) {
          this.$Message.success(this.isEdit ? '修改成功' : '保存成功')
          this.addOrEdit = false
          this.isEdit = false
          this.fetchData()
        }
      })
    },
    changePage (numb) {
      this.pages.pageNumber = numb
      this.fetchData()
    },
    changePageSize (numb) {
      this.pages.pageSize = numb
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
