<template>
  <div class="car-brand-wrap">
    <operatenav>
      <Button type="success" @click="addCars">新增</Button>
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
        <addOrEditCars @addCars="addCarsInfo"
          v-bind:editCars="editCars"
          :companys="companys"
        />
    </Modal>

  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditCars from '@/pages/cars/addOrEditCars.vue'
import api from '@/fetch/api'

export default {
  name: 'cars',
  components: {operatenav, addOrEditCars},
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
          title: '车名',
          key: 'name'
        },
        {
          title: '图标',
          key: 'icon'
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
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      loading: false,
      editCars: {},
      companyId: '',
      isEdit: false,
      companys: []
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editCars = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
        title: '删除车品牌',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          // let car = this.datas[index]
          api.DeleteCars({id}).then(result => {
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
    addCars () {
      this.isEdit = false
      this.editCars = {}
      this.addOrEdit = true
    },
    fetchCompany () {
      api.GetAllCompanyName({companyName: ''}).then(res => {
        this.companys = res
      })
    },
    fetchData () {
      this.loading = true
      api.GetAllCars({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, companyId: this.companyId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addCarsInfo (data) {
      api.AddOrEditCars(data, !this.isEdit ? 'add' : 'update').then(res => {
        if (res) {
          this.$Message.success(this.isEdit ? '修改成功' : '保存成功')
          this.addOrEdit = false
          this.isEdit = false
          this.fetchData()
        }
      })
    },
    changePage (numb) {
      this.pages.pageNo = numb
      this.fetchData()
    },
    changePageSize (numb) {
      this.pages.pageSize = numb
      this.fetchData()
    }
  },
  mounted () {
    // 加载公司信息
    this.fetchCompany()
    this.fetchData()
  }
}
</script>
