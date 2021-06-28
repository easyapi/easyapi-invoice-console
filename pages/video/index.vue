<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content': 'contents'">
      <Aside></Aside>
      <div class="main">
        <div class="main-title">
          <div>
            <b>视频管理</b>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="main-content">
          <el-button type="primary" class="ea-info-btn" @click="openVideo"
          >添加视频
          </el-button>
          <div>
            <div class="video-card">
              <div class="video-card-item"
                   v-for="item in videoList"
                   :key="item.id">
                <el-card :body-style="{ padding: '0px' }">
                  <div class="video-card-imgBox">
                    <img class="video-card-img" :src="item.img">
                  </div>
                  <h4
                    class="video-title">
                    {{item.title}}</h4>
                  <div class="video-bottom">
                    <p class="video-type">类型：{{item.articleCategory.name}}</p>
                    <div>
                      <el-button class="video-delete" type="danger" size="mini"
                                 @click="deleteVideo(item.articleId)">删除
                      </el-button>
                      <el-button class="video-edit" type="primary" size="mini"
                                 @click="updateVideo(item)">编辑
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
          <Edit ref="videoChild"></Edit>
          <Pagination @fatherSize="fatherSize" @fatherCurrent="fatherCurrent" :size="pagination.size"
                      :total-elements="pagination.total" class="paging"></Pagination>
          <div style="clear: both"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../../components/Header/index.vue'
  import Aside from '../../components/Aside/index.vue'
  import Pagination from '../../components/Pagination/index'
  import Edit from './components/edit'
  import { getArticleList, deleteArticle } from '../../api/article'

  export default {
    name: '',
    components: {
      Header,
      Aside,
      Pagination,
      Edit
    },
    data() {
      return {
        videoList: [],
        pagination: {
          page: 1,
          size: 12,
          total: 0
        },
        loadingData: '加载中'
      }
    },
    head() {
      return {
        title: '金融专辑 - EasyAPI服务市场',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: '服务市场场景化服务'
          },
          { hid: 'keyword', name: 'keyword', content: '服务市场场景化服务' }
        ]
      }
    },
    mounted() {
      this.getArticleList()
    },
    methods: {
      //1.获取视频管理列表
      getArticleList() {
        let page = this.pagination.page - 1
        let params = {
          appKey: sessionStorage.getItem('appKey'),
          appSecret: sessionStorage.getItem('appSecret'),
          page: page,
          size: this.pagination.size,
          type: '视频'
        }
        getArticleList(params, this).then(res => {
          if (res.data.code === 0) {
            this.videoList = []
            this.pagination.total = 0
            this.loadingData = '暂无数据'
          } else {
            this.videoList = res.data.content
            this.pagination.total = Number(res.data.totalElements)
          }

        }).catch(error => {
          console.log(error)
        })
      },
      //删除视频
      deleteVideo(id) {
        this.$confirm('您确定要删除该视频吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArticle(id, this).then(res => {
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
      //添加视频
      openVideo() {
        this.$refs.videoChild.dialogVisible = true
        this.$refs.videoChild.title = '添加视频'
        this.$refs.videoChild.videoForm = this.$options.data()
      },
      //编辑视频
      updateVideo(item) {
        this.$refs.videoChild.dialogVisible = true
        this.$refs.videoChild.title = '编辑视频'
        this.$refs.videoChild.videoForm = item
        this.$refs.videoChild.articleId = item.articleId
        this.$refs.videoChild.videoForm.articleCategoryId = item.articleCategory.articleCategoryId
      },
      //分页
      fatherSize(data) {
        this.pagination.size = data
        this.getArticleList()
      },
      fatherCurrent(data) {
        this.pagination.page = data
        this.getArticleList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .video-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .video-card-item {
    margin-bottom: 30px;
    width: 21.25%;
  }

  .video-card-imgBox {
    text-align: center
  }

  .video-card-img {
    width: 100%;
    object-fit: scale-down;
    border-radius: 6px;
  }

  .video-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 5px 10px 0;
  }

  .video-type {
    font-size: 13px;
    color: #999;
    margin-top: 5px;
    padding: 5px 10px 0;
    float: left;
  }

  .video-bottom {
    height: 45px;
  }

  .video-edit {
    float: right;
    margin: 10px 0 10px 10px;
  }

  .video-delete {
    float: right;
    margin: 10px 10px 10px 10px;
  }
</style>
