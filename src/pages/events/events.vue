<template>
  <div class="news-wrapper">
    <operatenav>
      <Button type="success" @click="addEvents">新增</Button>
      <Select v-model="year" filterable style="width:200px" @on-change="changeYear">
          <Option value="">请选择</Option>
          <Option v-for="item in getFullYear" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
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
    <!-- 新增/编辑对话框 -->
    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title"
      width="800">
        <addOrEditEvents @addEvents="addEventsInfo" v-bind:editEvents="editEvents"/>
    </Modal>
    <!-- <Modal v-model="showEvents" footer-hide :title="viewTitle" :styles="{top: '20px'}"
      width="800">
      <div style="min-height: 300;" v-html="viewContent"></div>
    </Modal> -->
  </div>

</template>
<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditEvents from '@/pages/events/addOrEditEvents'
import api from '@/fetch/api'
import {getAllYear} from '@/utils/utils'

export default {
  name: 'events',
  components: {operatenav, addOrEditEvents},
  computed: {
    getFullYear () {
      return getAllYear()
    }
  },
  data () {
    return {
      header: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '年',
          key: 'year',
          width: 100
        },
        {
          title: '事件',
          key: 'events',
          minWidth: 200
        },
        {
          title: '是否精简',
          key: 'simple',
          width: 100,
          render: (h, params) => {
            return h('div', params.row.simple ? '是' : '否')
          }
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
      loading: false,
      pages: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      addOrEdit: false,
      title: '新增/编辑大事件',
      editEvents: {},
      isEdit: false,
      year: ''
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editEvents = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
          title: '删除大事件',
          content: '您确定要删除该条大事件吗?',
          onOk: () => {
            const id = this.datas[index].id
            api.DeleteEvents({id}).then(result => {
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
    addEvents () {
      this.isEdit = false
      this.addOrEdit = true
      this.editEvents = {}
    },
    fetchData () {
      this.loading = true
      api.GetAllEvents({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, year: this.year}).then((res) => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addEventsInfo (data) {
      // console.log(data)
      api.AddOrEditEvents(data, this.isEdit ? 'update' : 'add').then(res => {
        this.$Message.success(this.isEdit ? '修改成功' : '保存成功')
        this.addOrEdit = false
        this.isEdit = false
        this.fetchData()
      })
    },
    changePage (numb) {
      this.pages.pageNo = numb
      this.fetchData()
    },
    changePageSize (numb) {
      this.pages.pageSize = numb
      this.fetchData()
    },
    changeYear (val) {
      this.year = val
      this.fetchData()
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
