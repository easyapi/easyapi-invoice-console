<template>
  <el-dialog
    :close-on-click-modal = "false"
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form ref="videoForm" :model="videoForm" :rules="ruleValidate" label-width="80px">
      <el-form-item label="视频标题" prop="title">
        <el-input v-model="videoForm.title" placeholder="请输入视频名称"></el-input>
      </el-form-item>
      <el-form-item label="视频类型" prop="articleCategoryId">
        <el-select v-model="videoForm.articleCategoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="视频封面" prop="img">
        <div class="block">
          <el-upload
            :data="dataObj"
            class="avatar-uploader"
            action="https://upload.qiniup.com/"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="videoForm.img" :src="videoForm.img" @click="getImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="getImg"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="视频上传" prop="video">
        <div class="block">
          <el-upload
            :data="videoObj"
            class="avatar-uploader"
            action="https://upload.qiniup.com/"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
          >
            <video v-if="videoForm.video&&this.videoFlag==false" @click="getVideo" :src="videoForm.video"
                   class="avatar">
            </video>
            <i v-else-if="videoForm.video==''&&this.videoFlag==false" @click="getVideo"
               class="el-icon-plus avatar-uploader-icon"></i>
            <el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent"
                         style="margin-top:30px;">
            </el-progress>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm('videoForm')">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import { getQiniuKey, getQiniuToken } from '../../../api/qiniu'
  import { getArticleCategoryList } from '../../../api/article-category'
  import { createArticle, updateArticle } from '../../../api/article'

  export default {
    name: 'addVideo',
    data() {
      return {
        title: '',
        options: [],
        dialogVisible: false,
        videoForm: {
          title: '',
          articleCategoryId: '',
          img: '',
          video: ''
        },
        ruleValidate: {
          title: [
            { required: true, message: '请输入视频标题', trigger: 'blur' }
          ],
          // articleCategoryId: [
          //   { required: true, message: '请选择视频类型', trigger: 'change' }
          // ],
          // img: [
          //   { required: true, message: '请上传视频封面', trigger: 'change' }
          // ],
          // video: [
          //   { required: true, message: '请上传视频', trigger: 'change' }
          // ]
        },
        dataObj: { token: '', key: '' },
        videoObj: { token: '', key: '' },
        articleId: '',
        videoFlag: false
      }
    },
    mounted() {
      this.getArticleCategoryList()
    },
    methods: {
      //获取分类
      getArticleCategoryList() {
        let params = {
          appKey: sessionStorage.getItem('appKey'),
          appSecret: sessionStorage.getItem('appSecret')
        }
        getArticleCategoryList(params, this).then(res => {
          if (res.data.code == 1) {
            let data = res.data.content
            data.forEach(item => {
              let obj = {}
              obj.value = item.articleCategoryId
              obj.label = item.name
              this.options.push(obj)
            })
          }
        })
      },
      //验证视频格式和大小
      beforeUploadVideo(file) {
        const isLt10M = file.size / 1024 / 1024 < 10
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) == -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传视频大小不能超过10MB哦!')
          return false
        }
      },
      //上传进度
      uploadVideoProcess(event, file, fileList) {
        console.log(file)
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0)
      },
      //获取图片七牛token和key
      getImg() {
        getQiniuToken(this).then(res => {
          this.dataObj.token = res.data.content.upToken
        }).catch(error => {
          console.error(error.response)
        })
        getQiniuKey(this).then(res => {
          this.dataObj.key = res.data.content.key
        }).catch(error => {
          console.log(error.response)
        })
      },
      //获取视频七牛token和key
      getVideo() {
        getQiniuToken(this).then(res => {
          this.videoObj.token = res.data.content.upToken
        }).catch(error => {
          console.error(error.response)
        })
        getQiniuKey(this).then(res => {
          this.videoObj.key = res.data.content.key
        }).catch(error => {
          console.log(error.response)
        })
      },
      handleAvatarSuccess(res, file) {
        let img = 'https://qiniu.easyapi.com/' + res.key
        file.url = img
        this.videoForm.img = img
      },
      handleVideoSuccess(res, file) {
        this.videoFlag = false
        this.videoUploadPercent = 0
        let video = 'https://qiniu.easyapi.com/' + res.key
        file.url = video
        this.videoForm.video = video
      },
      confirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {
              ...this.videoForm,
              type: '视频',
              appKey: sessionStorage.getItem('appKey'),
              appSecret: sessionStorage.getItem('appSecret')
            }
            if (this.title === '添加视频') {
              createArticle(data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('添加成功!')
                  this.$parent.getArticleList()
                  this.dialogVisible = false
                  this.$refs[formName].resetFields()
                }
              }).catch(error => {
                console.log(error.response)
              })
            } else if (this.title === '编辑视频') {
              updateArticle(this.articleId, data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('编辑成功!')
                  this.$parent.getArticleList()
                  this.dialogVisible = false
                  this.$refs[formName].resetFields()
                }
              }).catch(error => {
                console.log(error.response)
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
