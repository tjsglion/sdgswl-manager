<template>
  <div class="car-desc-wrapper">
    <operatenav>
      <Button type="success" @click="addCarsDesc">新增</Button>
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
        <addOrEditCarsDesc @addCarsDesc="addCarsDescInfo"
          v-bind:editCarsDesc="editCarsDesc"
          :carsTypes="carsTypes"
        />
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditCarsDesc from '@/pages/cars/addOrEditCarsDesc.vue'
import api from '@/fetch/api'
export default {
  name: 'carsDesc',
  components: {operatenav, addOrEditCarsDesc},
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
          title: '车辆类型',
          key: 'typeId',
          width: 150,
          render: (h, params) => {
            return h('div', this.formatTypes(params.row.typeId))
          }
        },
        {
          title: '车辆图片',
          key: 'image',
          width: 150,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.image
              },
              style: {
                width: '100px',
                height: '100px'
              }
            })
          }
        },
        {
          title: '车辆款式',
          key: 'carModel',
          width: 150
        },
        {
          title: '车辆排量',
          key: 'volume',
          width: 150
        },
        {
          title: '车辆描述',
          key: 'detail'
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
      editCarsDesc: {},
      carsTypeId: '',
      isEdit: false,
      carsTypes: [],
      typeId: ''
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editCarsDesc = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
        title: '删除车详情',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          // let car = this.datas[index]
          api.DeleteCarsDesc({id}).then(result => {
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
    formatTypes (id) {
      let typeName = ''
      this.carsTypes.map(type => {
        if (type.id === id) typeName = type.name
      })
      return typeName
    },
    fetchCarsType () {
      api.GetAllCarsType({pageNo: 1, pageSize: 100, carId: ''}).then(res => {
        if (res.list) this.carsTypes = res.list
      })
    },
    fetchData () {
      this.loading = true
      api.GetAllCarsDesc({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, typeId: this.typeId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addCarsDesc () {
      this.isEdit = false
      this.editCarsDesc = {}
      this.addOrEdit = true
    },
    addCarsDescInfo (data) {
      api.AddOrEditCarsDesc(data, !this.isEdit ? 'add' : 'update').then(res => {
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
    // 获取车类型
    this.fetchCarsType()
    this.fetchData()
  }
}
</script>
