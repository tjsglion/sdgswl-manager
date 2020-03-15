<template>
  <div class="news-wrapper">
    <operatenav>
      <Button type="success" @click="addNews">新增</Button>
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
    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title" :styles="{top: '20px'}"
      width="800">
        <addOrEditNews @addNews="addNewsInfo" v-bind:editNews="editNews"/>
    </Modal>
    <Modal v-model="showNews" footer-hide :title="viewTitle" :styles="{top: '20px'}"
      width="800">
      <div style="min-height: 300;" v-html="viewContent"></div>
    </Modal>
  </div>

</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditNews from '@/pages/news/addOrEditNews.vue'
import moment from 'moment'
import api from '@/fetch/api'
const newsTypes = {
  1: '集团新闻',
  2: '媒体报道',
  3: '通知公告'
}
export default {
  name: 'news',
  computed: {},
  components: {operatenav, addOrEditNews},
  data () {
    return {
      header: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 200
        },
        {
          title: '发布时间',
          key: 'date',
          width: 120,
          render: (h, params) => {
            return h('div', this.formatData(params.row.date))
          }
        },
        {
          title: '发布者',
          key: 'publisher',
          minWidth: 100
        },
        {
          title: '新闻类型',
          key: 'type',
          minWidth: 100,
          render: (h, params) => {
            return h('div', this.formatNewsType(params.row.type))
          }
        },
        {
          title: '浏览次数',
          key: 'count',
          minWidth: 100
        },
        {
          title: '是否置顶',
          key: 'isPush',
          minWidth: 100,
          render: (h, params) => {
            return h('div', this.formatIsPusher(params.row.isPush))
          }
        },
        {
          title: '新闻摘要',
          key: 'newsAbstract',
          minWidth: 300
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
              }, '删除'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.pushTop(params.index)
                  }
                }
              }, '置顶'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      addOrEdit: false,
      title: '新增/编辑',
      viewTitle: '新闻预览',
      pages: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      datas: [],
      loading: false,
      editNews: {},
      isEdit: false,
      showNews: false,
      viewContent: ''
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      let editRow = this.datas[index]
      // let id = editRow.id
      // this.editNews = editRow
      this.$nextTick(function () {
        this.editNews = editRow
      })
    },
    delete (index) {
      this.$Modal.confirm({
          title: '删除新闻',
          content: '您确定要删除该条新闻吗?',
          onOk: () => {
            let delNews = this.datas[index]
            api.DeleteNews({id: delNews.id}).then(result => {
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
    pushTop (index) {
      let pushRow = this.datas[index]
      pushRow.isPush = true
      this.isEdit = true
      this.addNewsInfo(pushRow)
    },
    show (index) {
      let viewNews = this.datas[index]
      let content = viewNews.content
      this.showNews = true
      this.viewContent = content
    },
    addNews () {
      this.isEdit = false
      this.editNews = {}
      this.addOrEdit = true
    },
    // 格式化时间
    formatData (times) {
      if (!times) return ''
      return moment(times).format('YYYY-MM-DD')
    },
    // 格式化新闻类型
    formatNewsType (type) {
      if (!type) return '-'
      return newsTypes[+type]
    },
    // 格式化是否置顶
    formatIsPusher (bool) {
      return bool ? '是' : '否'
    },
    fetchData () {
      this.loading = true
      api.GetAllNews({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize}).then(res => {
        this.loading = false
        let {total, pageNum, list} = res
        this.pages.pageNo = pageNum
        this.pages.total = total
        this.pages.current = pageNum
        this.$set(this, 'datas', list)
      })
    },
    // 添加新闻
    addNewsInfo (data) {
      this.isEdit ? (function (vm) {
        api.UpdateNews(data).then(res => {
          vm.$Message.success('修改成功')
          vm.addOrEdit = false
          vm.isEdit = false
          vm.fetchData()
        })
      })(this) : (function (vm) {
        api.AddNews(data).then(res => {
          vm.$Message.success('保存成功')
          vm.addOrEdit = false
          vm.fetchData()
        })
      })(this)
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
    this.fetchData()
  }
}
</script>

<style lang="less">
.ivu-modal-footer{
  padding: 0 !important
}
</style>
