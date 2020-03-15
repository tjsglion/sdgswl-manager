<template>
  <div class="car-brand-wrap">
    <operatenav>
      <Button type="success" @click="addCarsType">新增</Button>
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
        <addOrEditCarsType @addCarsType="addCarsTypeInfo"
          v-bind:editCarsType="editCarsType"
          :carBrands="carBrands"
        />
    </Modal>

  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditCarsType from '@/pages/cars/addOrEditCarsType.vue'
import api from '@/fetch/api'

export default {
  name: 'car',
  components: {operatenav, addOrEditCarsType},
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
          key: 'carId'
        },
        {
          title: '车类型',
          key: 'name'
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
      editCarsType: {},
      isEdit: false,
      carId: '',
      carBrands: []
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editCarsType = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
        title: '删除车类型',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          api.DeleteCarsType({id}).then(result => {
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
    addCarsType () {
      this.isEdit = false
      this.editCarsType = {}
      this.addOrEdit = true
    },
    fetchData () {
      this.loading = true
      api.GetAllCarsType({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, carId: this.carId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    fetchCarBrand () {
      api.GetAllCars({pageNo: 1, pageSize: 100}).then(res => {
        let {list} = res
        this.carBrands = list
        // console.log('**********', this.carBrands)
      })
    },
    addCarsTypeInfo (data) {
      api.AddOrEditCarsType(data, !this.isEdit ? 'add' : 'update').then(res => {
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
    // 加载车名
    this.fetchCarBrand()
    this.fetchData()
  }
}
</script>
