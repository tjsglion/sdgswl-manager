<template>
  <div class="party-wrapper">
    <operatenav>
      <Button type="success" @click="addTender">新增</Button>
      <Select v-model="proId" style="width:200px" @on-change="changeProv">
        <Option value="">请选择</Option>
        <Option v-for="pro in provList" :key="pro.pid" :value="pro.pid">{{pro.provincial}}</Option>
      </Select>
      <Select v-model="cityId" style="width:200px" @on-change="changeCity">
        <Option value="">请选择</Option>
        <Option v-for="city in cityList" :key="city.cid" :value="city.cid">{{ city.city }}</Option>
      </Select>
      <Button type="primary" @click="resetSearch">重置</Button>
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
        <addOrEditTender @addTender="addTenderInfo"
          v-bind:editTender="editTender"
          :provList="provList"
        />
    </Modal>

    <Modal v-model="showTender" footer-hide :title="viewTitle" :styles="{top: '20px'}"
      width="800">
      <div style="min-height: 300;" v-html="viewContent"></div>
    </Modal>
  </div>
</template>

<script>
import operatenav from '@/pages/components/operate-nav/operatenav.vue'
import addOrEditTender from '@/pages/tender/addOrEditTender.vue'
import moment from 'moment'
import api from '@/fetch/api'

// console.log(moment, api)
export default {
  name: 'tender',
  components: {operatenav, addOrEditTender},
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
          title: '省份',
          key: 'proName',
          minWidth: 100
        },
        {
          title: '城市',
          key: 'cityName',
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
      editTender: {},
      isEdit: false,
      proId: '',
      cityId: '',
      provList: [],
      cityList: [],
      showTender: false,
      viewContent: '',
      viewTitle: '招标预览'
    }
  },
  methods: {
    edit (index) {
      this.isEdit = true
      this.addOrEdit = true
      this.editTender = this.datas[index]
    },
    delete (index) {
      this.$Modal.confirm({
        title: '删除招标信息',
        content: '您确定要删除该条内容吗?',
        onOk: () => {
          let {id} = this.datas[index]
          api.DeleteTender({id}).then(result => {
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
    pushTop (index) {},
    show (index) {
      let viewTender = this.datas[index]
      let content = viewTender.content
      this.showTender = true
      this.viewContent = content
    },
    addTender () {
      this.isEdit = false
      this.editTender = {}
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
    // 查询省份信息
    fetchProvData () {
      api.QueryAllPro().then(res => {
        this.$set(this, 'provList', res)
      })
    },
    fetchData () {
      this.loading = true
      api.GetAllTender({pageNo: this.pages.pageNo, pageSize: this.pages.pageSize, cityId: this.cityId}).then(res => {
        this.loading = false
        let {count, pageNo, list, pages} = res
        this.pages.pageNo = pageNo
        this.pages.total = count
        this.pages.current = pages
        this.$set(this, 'datas', list)
      })
    },
    addTenderInfo (data) {
      // console.log('save==', data)
      api.AddOrEditTender(data, !this.isEdit ? 'add' : 'update').then(res => {
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
    },
    changeProv (pid) {
      if (!pid) {
        return false
      }
      this.proId = pid
      this.fetchCityByPid(+pid)
    },
    fetchCityByPid (pid) {
      api.QueryCityByPro({pid}).then(res => {
        this.$set(this, 'cityList', res)
      })
    },
    changeCity (cid) {
      this.cityId = cid
      this.fetchData()
    },
    resetSearch () {
      this.proId = null
      this.$set(this, 'cityId', '')
      this.fetchData()
    }
  },
  mounted () {
    this.fetchProvData()
    this.fetchData()
  }
}
</script>
