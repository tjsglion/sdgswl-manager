<template>
  <div class="party-wrapper">
    <operatenav>
      <Button type="success" @click="addContact">新增</Button>
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
    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title" :styles="{top: '20px'}"
      width="800">
        <addOrEditContact @addContact="addContactInfo"
          v-bind:editContact="editContact"
        />
    </Modal>

    <Modal v-model="showContact" footer-hide :title="viewTitle" :styles="{top: '20px'}"
      width="800">
      <div style="min-height: 300;" v-html="viewContent"></div>
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditContact from '@/pages/contact/addOrEditContact.vue'
import moment from 'moment'
import api from '@/fetch/api'

export default {
  name: 'tender',
  components: {operatenav, addOrEditContact},
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
          title: '标题',
          key: 'title',
          minWidth: 200
        },
        {
          title: '发布时间',
          key: 'publishDate',
          minWidth: 120,
          render: (h, params) => {
            return h('div', this.formatData(params.row.publishDate))
          }
        },
        {
          title: '内容',
          key: 'content',
          minWidth: 500,
          render: (h, params) => {
            return h('div', this.formatContent(params.row.content))
          }
        },
        {
          title: '浏览次数',
          key: 'watchTimes',
          width: 100
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
                    this.show(params.index)
                  }
                }
              }, '查看')
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
      editContact: {},
      isEdit: false,
      showContact: false,
      viewContent: '',
      viewTitle: '联系我们预览'
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
        title: '删除联系我们',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          api.DeleteContact({id}).then(result => {
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
    show (index) {
      let viewContact = this.datas[index]
      let content = viewContact.content
      this.showContact = true
      this.viewContent = content
    },
    addContact () {
      this.isEdit = false
      this.editContact = {}
      this.addOrEdit = true
    },
    formatData (times) {
      if (!times) return ''
      return moment(times).format('YYYY-MM-DD')
    },
    formatContent (val) {
      if (val) {
        let result = val.replace(/<[^>]*>/g, '')
        return result.length > 300 ? result.substring(0, 300) + '...' : result
        // return val.substring(0, 300)
      }
    },
    fetchData () {
      this.loading = true
      api.GetAllContact({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, cityId: this.cityId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addContactInfo (data) {
      // console.log('save==', data)
      api.AddOrEditContact(data, !this.isEdit ? 'add' : 'update').then(res => {
        // console.log('添加成功', res)
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
    this.fetchData()
  }
}
</script>
