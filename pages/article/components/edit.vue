<template>
  <el-dialog
    :close-on-click-modal = "false"
    :title="title"
    :visible.sync="dialogVisible"
    width="50%">
    <el-form ref="articleForm" :model="articleForm" :rules="ruleValidate" label-width="80px">
      <el-form-item label="文章配文" prop="content">
        <quill-editor
          v-model="articleForm.content"
          ref="myQuillEditor"
          :options="editorOption"
        ></quill-editor>
        <el-upload
          class="editor-img-plus"
          ref="upload"
          :show-file-list="false"
          :on-success="handleSuccess"
          action="https://upload.qiniup.com/"
          :data="dataObj"
          style="display: none"
        >
          <input id="upload"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="articleForm.title" placeholder="请输入视频名称"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="articleCategoryId">
        <el-select v-model="articleForm.articleCategoryId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传封面" prop="img">
        <div class="block">
          <el-upload
            :data="dataObj"
            class="avatar-uploader"
            action="https://upload.qiniup.com/"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="articleForm.img" :src="articleForm.img" @click="getImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="getImg"></i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm('articleForm')">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import {getQiniuKey, getQiniuToken} from '../../../api/qiniu'
  import {getArticleCategoryList} from '../../../api/article-category'
  import {createArticle, updateArticle} from '../../../api/article'

  const toolbarOptions = [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [{list: 'ordered'}, {list: 'bullet'}],
    ['bold', 'italic', 'underline'],
    [{size: ['small', false, 'large', 'huge']}],
    [{color: ['red', 'blue']}, {background: ['red', 'blue']}],
    [{script: 'sub'}, {script: 'super'}],
    [{direction: 'rtl'}],
    ['code-block', 'image']
  ];
  export default {
    name: 'addArticle',
    data() {
      return {
        articleForm: {
          content: '',
          title: '',
          articleCategoryId: '',
          img: ''
        },
        articleId: "",
        title: '',
        options: [],
        dialogVisible: false,
        addImgRange: '',
        dataObj: {token: null, key: null},
        ruleValidate: {
          title: [
            {required: true, message: '请输入视频标题', trigger: 'blur'}
          ]
        },
        //编辑器
        editorOption: {
          placeholder: '文章配文',
          modules: {
            //配置头部（功能）
            toolbar: {
              container: toolbarOptions,
              handlers: {
                image: (value) => {
                  if (value) {
                    this.imgClick()
                  } else {
                    this.quill.format('image', false)
                  }
                }
              }
            }
          }
        }
      }
    },
    mounted() {

    },
    computed: {},
    watch: {
      dialogVisible(val) {
        if (val) {
          this.getArticleCategoryList()
        }
      }
    },
    methods: {
      imgClick() {
        this.getImg();
        let upload = document.getElementById('upload')
        upload.click()
      },
      handleSuccess(res, file, fileList) {
        let img = 'https://qiniu.easyapi.com/' + res.key
        this.addImgRange = this.$refs.myQuillEditor.quill.getSelection()
        this.$refs.myQuillEditor.quill.insertEmbed(
          this.addImgRange != null ? this.addImgRange.index : 0,
          'image',
          img
        )
      },
      //获取分类
      getArticleCategoryList() {
        let params = {
          appKey: sessionStorage.getItem('appKey'),
          appSecret: sessionStorage.getItem('appSecret')
        }
        getArticleCategoryList(params, this).then(res => {
          if (res.data.code === 1) {
            res.data.content.forEach(item => {
              this.options.push({"label": item.name, "value": item.articleCategoryId})
            })
          }
        })
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
      handleAvatarSuccess(res, file) {
        let img = 'https://qiniu.easyapi.com/' + res.key;
        file.url = img
        this.articleForm.img = img
      },
      confirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {
              ...this.articleForm,
              type: '文章',
              appKey: sessionStorage.getItem('appKey'),
              appSecret: sessionStorage.getItem('appSecret')
            }
            if (this.title === '添加文章') {
              createArticle(data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('添加成功!');
                  this.$parent.getArticleList();
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields()
                }
              }).catch(error => {
                console.log(error.response)
              })
            } else if (this.title === '编辑文章') {
              updateArticle(this.articleId, data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('编辑成功!');
                  this.$parent.getArticleList();
                  this.dialogVisible = false;
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

<style lang="scss">
  .ql-container {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 13px;
    height: 150px;
    margin: 0px;
    position: relative;
  }

  .ql-editor-class {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 1.42;
    height: 100%;
    outline: none;
    padding: 0 !important;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    word-wrap: break-word;
  }

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

  .ql-snow .ql-picker {
    color: #444;
    display: inline-block;
    float: left;
    font-size: 14px;
    height: 40px;
    font-weight: 500;
    position: relative;
    vertical-align: middle;
  }
</style>
