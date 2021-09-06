import './check.scss'
import Header from '../../components/Header/index.vue'
import Aside from '../../components/Aside/index.vue'
import {
  checkInvoiceCode,
  checkInvoiceUrl,
  checkInvoiceQrCode
} from '../../api/check'
import { getQiniuKey, getQiniuToken } from '../../api/qiniu'

export default {
  name: '',
  components: {
    Header,
    Aside
  },
  data() {
    var validateCode = (rule, value, callback) => {
      if (value.length !== 10 && value.length !== 12) {
        callback(new Error('请输入10位或12位发票代码'))
      } else {
        callback()
      }
    }
    var validateNumber = (rule, value, callback) => {
      if (value.length !== 8) {
        callback(new Error('请输入8位发票号码'))
      } else {
        callback()
      }
    }
    var validateCheckCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入效验码后六位'))
      } else {
        callback()
      }
    }
    return {
      showHeader: '',
      qnKey: null,
      qnToken: null,
      imgUrl: '',
      qrCode: '',
      invoiceDetail: {
        items: []
      },
      invoiceType: 1,
      ruleForm: {
        code: '',
        number: '',
        makeDate: '',
        checkCode: '',
        price: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入发票代码', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入发票号码', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        makeDate: [
          { required: true, message: '请选择发票日期', trigger: 'blur' }
        ],
        checkCode: [
          { required: true, message: '请输入效验码', trigger: 'blur' },
          { validator: validateCheckCode, trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      }
    }
  },
  head() {
    return {
      title: '发票查验 - EasyAPI发票查验',
      meta: [
        { hid: 'description', name: 'description', content: '发票管理发票查验' },
        { hid: 'keyword', name: 'keyword', content: '发票管理发票查验' }
      ]
    }
  },
  mounted() {
    this.showHeader = this.theme.showHeader
  },
  computed: {
    allAmount() {
      let num = 0
      for (let item of this.invoiceDetail.items) {
        num += Number(item.sum) + Number(item.tax)
      }
      return num.toFixed(2)
    }
  },
  methods: {
    getQiniuKey() {
      getQiniuKey(this).then((res) => {
        if (res.data.code === 1) {
          this.qnKey = res.data.content.key
        }
      })
    },
    getQiniuToken() {
      getQiniuToken(this).then((res) => {
        if (res.data.code === 1) {
          this.qnToken = res.data.content.upToken
        }
      })
    },
    //获取七牛key和token
    getTokenAandKey() {
      this.getQiniuKey()
      this.getQiniuToken()
    },
    handleAvatarSuccess(res) {
      this.$message.success('上传成功!')
      this.imgUrl = 'https://qiniu.easyapi.com/' + res.key
      //图片查验
      this.checkInvoiceUrl()
    },
    //表格合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index == 5 || index == 7) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return (prev + curr).toFixed(2)
              } else {
                return prev.toFixed(2)
              }
            }, 0)
          }
        }
      })
      return sums
    },
    // 选择发票类型
    invoiceTypeChange() {
      this.ruleForm.code = ''
      this.ruleForm.number = ''
      this.ruleForm.makeDate = ''
      this.ruleForm.checkCode = ''
      this.ruleForm.price = ''
    },
    // 数字转大写
    DX(n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
      var unit = n > 0 ? '千百拾亿千百拾万千百拾元角分' : '',
        str = ''
      n += '00'
      var p = n.indexOf('.')
      if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
      unit = unit.substr(unit.length - n.length)
      for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
      return str
        .replace(/零(千|百|拾|角)/g, '零')
        .replace(/(零)+/g, '零')
        .replace(/零(万|亿|元)/g, '$1')
        .replace(/(亿)万|壹(拾)/g, '$1$2')
        .replace(/^元零?|零分/g, '')
        .replace(/元$/g, '元整')
    },
    //图片查验
    checkInvoiceUrl() {
      let params = {
        appKey: '53Z9oTH5KpIy2SC2',
        appSecret: 'tfmjloheqcricbic',
        url: this.imgUrl
      }
      checkInvoiceUrl(params, this)
        .then((res) => {
          if (res.data.code === 1) {
            this.invoiceDetail = res.data.content
          } else {
            this.invoiceDetail = {
              items: []
            }
          }
        })
        .catch((error) => {
          this.invoiceDetail = {
            items: []
          }
        })
    },
    checkInvoiceQrCode() {
      let params = {
        appKey: '53Z9oTH5KpIy2SC2',
        appSecret: 'tfmjloheqcricbic',
        text: '01,04,032002100404,08370904,653.40,20210611,01312583033131800741,2030,'
      }
      checkInvoiceQrCode(params, this)
        .then((res) => {
          if (res.data.code === 1) {
            this.invoiceDetail = res.data.content
          } else {
            this.invoiceDetail = {
              items: []
            }
          }
        })
        .catch((error) => {
          this.invoiceDetail = {
            items: []
          }
        })
    },
    // 查询
    search() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            ...this.ruleForm,
            appKey: '53Z9oTH5KpIy2SC2',
            appSecret: 'tfmjloheqcricbic'
          }
          // 032002100404 08370904  3200202130 08108805
          checkInvoiceCode(params, this)
            .then((res) => {
              if (res.data.code === 1) {
                this.invoiceDetail = res.data.content
              } else {
                this.invoiceDetail = {
                  items: []
                }
              }
            })
            .catch((error) => {
              this.invoiceDetail = {
                items: []
              }
            })
        }
      })
    }
  }
}
