<template>
  <div class="party-wrapper">
    <operatenav>
      <Button type="success" @click="addNews">新增</Button>
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
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import moment from 'moment'
import api from '@/fetch/api'
const partyTypes = {
  1: '党建动态',
  2: '上级精神',
  3: '党章常规',
  4: '支部风采'
}
// console.log(moment, api)
export default {
  name: 'person',
  components: {operatenav},
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
          key: 'viewTimes',
          minWidth: 120,
          render: (h, params) => {
            return h('div', this.formatData(params.row.viewTimes))
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
          title: '内容',
          key: 'content',
          minWidth: 300
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
      pages: {
        pageNo: 1,
        pageSize: 10,
        total: 1,
        current: 1
      },
      loading: false,
      editParty: {},
      isEdit: false
    }
  },
  methods: {
    edit (index) {},
    delete (index) {},
    pushTop (index) {},
    show (index) {},
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
    }
  }
}
</script>
