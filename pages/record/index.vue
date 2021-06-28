<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content': 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div><b>查验记录</b></div>
        </div>
        <el-divider></el-divider>
        <div class="main-content">
          <!-- <div>
            <SearchArea :items="searchAreaItems" @search="search" @event="event" @reset="reset"/>
          </div> -->
          <el-table
            :data="checkRecords"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            v-loading="loadingData"
            element-loading-text="数据正在加载中..."
          >
            <template slot="empty">
              <p>{{tableText}}</p>
            </template>
            <el-table-column prop="title" label="查验时间"></el-table-column>
            <el-table-column prop="articleCategory.name" label="发票代码"></el-table-column>
            <el-table-column prop="count" label="发票号码" ></el-table-column>
            <el-table-column prop="addTime" label="开票日期" ></el-table-column>
            <el-table-column prop="addTime" label="税额" ></el-table-column>
            <el-table-column prop="addTime" label="税价合计" ></el-table-column>
            <el-table-column prop="addTime" label="票种" ></el-table-column>
            <el-table-column width="200" label="操作">
              <template #default="scope">
                <el-button type="primary" @click="updateArticle(scope.row)" size="mini">编辑</el-button>
                <el-button @click="deleteArticle(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination @fatherSize="fatherSize" @fatherCurrent="fatherCurrent" :size="pagination.size"
                    :total-elements="pagination.total" class="paging"></Pagination>
        <div style="clear: both"></div>
      </div>
    </div>
  </div>

</template>

<script>
  import Header from '../../components/Header/index.vue'
  import Aside from '../../components/Aside/index.vue'
  import SearchArea from '../../components/SearchArea/index.vue'
  import Pagination from '../../components/Pagination/index'
  import {getCheckRecords} from "../../api/record"

  export default {
    name: '',
    components: {
      Header,
      Aside,
      SearchArea,
      Pagination,
    },
    data() {
      return {
        checkRecords: [],
        searchAreaItems: [
          {label: '标题', type: 'input', key: 'title'}
        ],
        title: '',
        showHeader: '',
        pagination: {
          page: 1,
          size: 12,
          total: 0
        },
        loadingData: false,
        tableText: ''
      }
    },
    head() {
      return {
        title: '查验记录 - EasyAPI查验记录',
        meta: [
          {hid: 'description', name: 'description', content: '发票管理查验记录'},
          {hid: 'keyword', name: 'keyword', content: '发票管理查验记录'}
        ]
      }
    },
    methods: {
      /**
       * 获取查验记录
       */
      getCheckRecords() {
        this.loadingData = true
        let page = this.pagination.page - 1
        let params = {
          title: this.title,
          page: page,
          size: this.pagination.size,
        }
        getCheckRecords(params, this).then(res => {
          if (res.data.code === 0) {
            this.loadingData = false
            this.tableText = '暂无数据'
            this.checkRecords = []
            this.pagination.total = 0
          } else {
            this.loadingData = false
            this.checkRecords = res.data.content
            this.pagination.total = Number(res.data.totalElements)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      //分页
      fatherSize(data) {
        this.pagination.size = data
        this.getCheckRecords()
      },
      fatherCurrent(data) {
        this.pagination.page = data
        this.getCheckRecords()
      },
      search(item) {
        console.log(1111, item)
        let {title} = item
        this.title = title
        this.getCheckRecords()
      },
      reset(item) {
        console.log(1111, item)

      },
      event(item) {
        let {title} = item
        this.title = title
      }
    },
    mounted() {
      this.getCheckRecords()
      this.showHeader = this.comsys.showHeader
    }
  }
</script>

<style lang="scss">

</style>
