<template>
  <div>
    <el-dialog
      custom-class="up-dialog"
      :before-close="handleClose"
      title="详情"
      :visible.sync="visible"
      width="40%"
    >
      <div class="row">
        <el-row>
          <el-col :span="4" class="row-blue">
            <div>发票代码</div>
          </el-col>
          <el-col :span="8" class="row-fff">
            <div>{{ checkDetail.code }}</div>
          </el-col>
          <el-col :span="4" class="row-blue">
            <div>发票号码</div>
          </el-col>
          <el-col :span="8" class="row-fff border-r">
            <div>{{ checkDetail.number }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="row-blue">
            <div>开票日期</div>
          </el-col>
          <el-col :span="8" class="row-fff">
            <div>{{ checkDetail.makeDate }}</div>
          </el-col>
          <el-col :span="4" class="row-blue">
            <div>税额</div>
          </el-col>
          <el-col :span="8" class="row-fff border-r">
            <div v-if="checkDetail.tax">{{ checkDetail.tax.toFixed(2) }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="row-blue">
            <div>税价合计</div>
          </el-col>
          <el-col :span="8" class="row-fff">
            <div v-if="checkDetail.price">
              {{ checkDetail.price.toFixed(2) }}
            </div>
          </el-col>
          <el-col :span="4" class="row-blue">
            <div>票种</div>
          </el-col>
          <el-col :span="8" class="row-fff border-r">
            <div>{{ checkDetail.typeName }}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="row-blue">
            <div>查验时间</div>
          </el-col>
          <el-col :span="8" class="row-fff border-b">
            <div>{{ checkDetail.addTime }}</div>
          </el-col>
          <el-col :span="4" class="row-blue">
            <!-- <div>发照日期</div> -->
          </el-col>
          <el-col :span="8" class="row-fff border-r border-b">
            <div></div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['visible', 'checkDetail'],
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  methods: {
    // 确认
    handleSubmit() {
      this.$emit('update:visible', false)
    },
    //关闭
    handleClose() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
<style lang="scss">
.row {
  .row-blue {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    height: 40px;
    line-height: 40px;
    background: #eaf2fb;
    border-left: 1px solid #d7e1ec;
    border-top: 1px solid #d7e1ec;
    text-align: center;
  }

  .row-fff {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    border-left: 1px solid #d7e1ec;
    border-top: 1px solid #d7e1ec;
  }

  .border-r {
    border-right: 1px solid #d7e1ec;
  }

  .border-b {
    border-bottom: 1px solid #d7e1ec;
  }
}
</style>
