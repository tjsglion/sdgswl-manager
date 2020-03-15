<template>
  <div class="party-wrapper">
    <operatenav>
      <Button type="success" @click="addParty">新增</Button>
      <!-- <div class="party-select"> -->
        <Select v-model="selectPartyType" style="width: 150px; margin-left: 5px;" @on-change="changePartyOpts">
          <Option value="">请选择</Option>
          <Option v-for="opt in partyOpts" :key="opt.value" :value="opt.value">{{opt.label}}</Option>
        </Select>
      <!-- </div> -->
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
    <!-- 新增/编辑对话框 -->
    <Modal v-model="addOrEdit" fullscreen footer-hide :title="title" :styles="{top: '20px'}"
      width="800">
        <addOrEditParty @addParty="addPartyInfo" v-bind:editParty="editParty"/>
    </Modal>
    <Modal v-model="showParty" footer-hide :title="viewTitle" :styles="{top: '20px'}"
      width="800">
      <div style="min-height: 300;" v-html="viewContent"></div>
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditParty from '@/pages/party/addOrEditParty.vue'
import moment from 'moment'
import api from '@/fetch/api'
const partyTypes = {
  1: '党建动态',
  2: '党章常规',
  3: '上级精神',
  4: '支部风采',
  5: '廉政频道'
}
// console.log(moment, api)
export default {
  name: 'party',
  components: {operatenav, addOrEditParty},
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
          minWidth: 120,
          render: (h, params) => {
            return h('div', this.formatData(params.row.date))
          }
        },
        {
          title: '党建类型',
          key: 'partyBuildType',
          minWidth: 100,
          render: (h, params) => {
            return h('div', this.formatPartyType(params.row.partyBuildType))
          }
        },
        {
          title: '发布者',
          key: 'promulgator',
          minWidth: 100
        },
        {
          title: '浏览次数',
          key: 'viewTimes',
          minWidth: 100
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
          title: '是否置顶',
          key: 'isPush',
          minWidth: 100,
          render: (h, params) => {
            return h('div', this.formatIsPusher(params.row.isPush))
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
      datas: [],
      addOrEdit: false,
      title: '新增/编辑',
      viewTitle: '党建预览',
      pages: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      loading: false,
      editParty: {},
      isEdit: false,
      showParty: false,
      viewContent: '',
      partyOpts: [{
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
      ],
      selectPartyType: ''
    }
  },
  methods: {
    addParty () {
      this.isEdit = false
      this.editParty = {}
      this.addOrEdit = true
    },
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editParty = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
          title: '删除党建内容',
          content: '您确定要删除该条党建内容吗?',
          onOk: () => {
            let delParty = this.datas[index]
            api.DeleteParty({id: delParty.id}).then(result => {
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
      this.addPartyInfo(pushRow)
    },
    show (index) {
      let viewParty = this.datas[index]
      let content = viewParty.content
      this.showParty = true
      this.viewContent = content
    },
    formatData (times) {
      if (!times) return ''
      return moment(times).format('YYYY-MM-DD')
    },
    formatPartyType (type) {
      if (!type) return '-'
      return partyTypes[+type]
    },
    formatIsPusher (bool) {
      return bool ? '是' : '否'
    },
    fetchData () {
      this.loading = true
      api.GetAllParty({pageNumber: this.pages.pageNo, pageSize: this.pages.pageSize, partyBuildType: this.selectPartyType}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addPartyInfo (data) {
      this.isEdit ? (function (vm) {
        api.UpdateParty(data).then(res => {
          vm.$Message.success('修改成功')
          vm.addOrEdit = false
          vm.isEdit = false
          vm.fetchData()
        })
      })(this) : (function (vm) {
        api.AddParty(data).then(res => {
          if (res) {
            vm.$Message.success('保存成功')
            vm.addOrEdit = false
            vm.fetchData()
          }
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
    },
    changePartyOpts (val) {
      this.selectPartyType = val
      this.fetchData()
    },
    formatContent (val) {
      if (val) {
        let result = val.replace(/<[^>]*>/g, '')
        return result.length > 300 ? result.substring(0, 300) + '...' : result
        // return val.substring(0, 300)
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>

<style lang="less" scoped>
  .party-select{
    display: inline-block;
    width: 150px;
  }
</style>
