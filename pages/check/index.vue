<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content': 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div><b>发票查验</b></div>
        </div>
        <el-divider></el-divider>

        <div class="main-content">
         
          <!-- <div>
            <SearchArea :items="searchAreaItems" @search="search" @event="event" @reset="reset"/>
          </div>
          <el-table
            :data="articleList"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            v-loading="loadingData"
            element-loading-text="数据正在加载中..."
          >
            <template slot="empty">
              <p>{{tableText}}</p>
            </template>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="articleCategory.name" label="分类" width="180"></el-table-column>
            <el-table-column prop="count" label="查看次数" width="180"></el-table-column>
            <el-table-column prop="addTime" label="发布时间" width="200"></el-table-column>
            <el-table-column width="200">
              <template #default="scope">
                <el-button type="primary" @click="updateArticle(scope.row)" size="mini">编辑</el-button>
                <el-button @click="deleteArticle(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
        <!-- <Pagination @fatherSize="fatherSize" @fatherCurrent="fatherCurrent" :size="pagination.size"
                    :total-elements="pagination.total" class="paging"></Pagination>
        <div style="clear: both"></div> -->
      </div>
    </div>
  </div>

</template>

<script>
  import Header from '../../components/Header/index.vue'
  import Aside from '../../components/Aside/index.vue'
  import SearchArea from '../../components/SearchArea/index.vue'
  import Pagination from '../../components/Pagination/index'
  // import {getArticleList, deleteArticle} from '../../api/article'

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
        articleList: [],
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
        title: '发票查验 - EasyAPI发票查验',
        meta: [
          {hid: 'description', name: 'description', content: '发票管理发票查验'},
          {hid: 'keyword', name: 'keyword', content: '发票管理发票查验'}
        ]
      }
    },
    methods: {
      /**
       * 获取文章列表
       */
      getArticleList() {
        this.loadingData = true
        let page = this.pagination.page - 1
        let params = {
          title: this.title,
          appKey: sessionStorage.getItem('appKey'),
          appSecret: sessionStorage.getItem('appSecret'),
          page: page,
          size: this.pagination.size,
          type: '文章'
        }
        getArticleList(params, this).then(res => {
          if (res.data.code === 0) {
            this.loadingData = false
            this.tableText = '暂无数据'
            this.articleList = []
            this.pagination.total = 0
          } else {
            this.loadingData = false
            this.articleList = res.data.content
            this.pagination.total = Number(res.data.totalElements)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 添加文章
       */
      createArticle() {
        this.$refs.editArticle.dialogVisible = true
        this.$refs.editArticle.title = '添加文章'
        this.$refs.editArticle.articleForm = this.$options.data()
      },
      /**
       * 修改文章
       */
      updateArticle(row) {
        this.$refs.editArticle.dialogVisible = true
        this.$refs.editArticle.title = '编辑文章'
        this.$refs.editArticle.articleForm = row
        this.$refs.editArticle.articleId = row.articleId
        this.$refs.editArticle.articleForm.articleCategoryId = row.articleCategory.articleCategoryId
      },
      //删除文章
      deleteArticle(row) {
        this.$confirm('您确定要删除该文章吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(row.articleId, this).then(res => {
            if (res.data.code === 1) {
              this.getArticleList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })
        })
      },
      //分页
      fatherSize(data) {
        this.pagination.size = data
        this.getArticleList()
      },
      fatherCurrent(data) {
        this.pagination.page = data
        this.getArticleList()
      },
      search(item) {
        console.log(1111, item)
        let {title} = item
        this.title = title
        this.getArticleList()
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
      // this.getArticleList()
      this.showHeader = this.comsys.showHeader
    }
  }
</script>

<style lang="scss">

</style>
