import './record.scss'
import Header from '../../components/Header/index.vue'
import Aside from '../../components/Aside/index.vue'
import Pagination from '../../components/Pagination/index'
import { getCheckRecords } from '../../api/record'
import DetailModal from './moudel/detailModal.vue'
import SearchArea from '../../components/SearchArea/index.vue'

export default {
  name: '',
  components: {
    Header,
    Aside,
    Pagination,
    DetailModal,
    SearchArea,
  },
  data() {
    return {
      checkRecords: [],
      searchItems: [
        { label: '发票代码', type: 'input', key: 'code' },
        { label: '发票号码', type: 'input', key: 'number' },
        { label: '购买方名称', type: 'input', key: 'purchaserName' },
        { label: '销售方名称', type: 'input', key: 'salesName' },
        {
          label: '开票日期',
          type: 'datePicker',
          key: 'makeDate',
          pickerType: 'date',
          format: 'yyyy-MM-dd',
        },
      ],
      formInline: {
        code: null,
        number: null,
        makeDate: null,
        purchaserName: null,
        salesName: null,
      },
      showHeader: '',
      pagination: {
        page: 1,
        size: 12,
        total: 0,
      },
      loadingData: false,
      tableText: '',
      detailModal: false,
      checkDetail: {},
    }
  },
  head() {
    return {
      title: '查验记录 - EasyAPI查验记录',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '发票管理查验记录',
        },
        { hid: 'keyword', name: 'keyword', content: '发票管理查验记录' },
      ],
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
        page: page,
        size: this.pagination.size,
        appKey: '53Z9oTH5KpIy2SC2',
        appSecret: 'tfmjloheqcricbic',
        ...this.formInline,
      }
      getCheckRecords(params, this).then((res) => {
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
      })
    },
    openDetail(row) {
      this.detailModal = true
      this.checkDetail = row
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
      this.pagination.page = 1
      let { code, number, makeDate, purchaserName, salesName } = item
      this.formInline.code = code
      this.formInline.number = number
      this.formInline.makeDate = makeDate
      this.formInline.purchaserName = purchaserName
      this.formInline.salesName = salesName
      this.getCheckRecords()
    },
    event(item) {
      let { code, number, makeDate, purchaserName, salesName } = item
      this.formInline.code = code
      this.formInline.number = number
      this.formInline.makeDate = makeDate
      this.formInline.purchaserName = purchaserName
      this.formInline.salesName = salesName
    },
    reset() {},
  },
  mounted() {
    this.getCheckRecords()
    this.showHeader = this.theme.showHeader
  },
}
