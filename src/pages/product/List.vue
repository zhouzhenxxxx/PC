<template>
  <div class="product">
    <h2>产品管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <!-- 左侧搜索 -->
      <el-col :span="16">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="keyWord" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="searchHandler">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- /左侧搜索 -->
      <!-- 右侧按钮 -->
      <el-col :span="8" style="text-align:right">
        <el-button type="primary" icon="el-icon-edit" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="batchHandler">批量删除</el-button>
      </el-col>
      <!-- /右侧按钮 -->
    </div>
    <!-- 展示数据表格 -->
    <el-table :data="products" style="width: 100%;" @selection-change="idsChangeHandler">
      <el-table-column v-model="ids" type="selection" width="55" />
      <el-table-column prop="name" label="产品名称" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="status" label="状态" />
      <!-- <el-table-column prop="photo" label="图片" /> -->
      <!-- <el-table-column #default="scope" width="100px" height="100%" label="图片" align="center">
        <img :src="scope.row.photo">
      </el-table-column> -->
      <el-table-column label="操作" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" /> &nbsp;
          <a href="" @click.prevent="toDetails(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!--更新操作模态框-->
    <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
      <el-form ref="productForm" :model="form" :rules="rules">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
          <el-input v-model="form.status" autocomplete="off" show-status />
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="form.photo" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCloseHandler">取 消</el-button>
        <el-button type="primary" @click="submitHandler(form)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="queryResult.page+1"
      :page-size="queryResult.pageSize"
      :total="queryResult.total"
      @current-change="pageChangeHandler"
    />
    <!--/分页 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { isNumber } from 'util'
export default {
  data() {
    return {
      ids: [],
      form: {},
      keyWord: '', // 关键字查询
      search: {
        page: 0,
        pageSize: 8, // 每页显示几条数据
        name: '', // 实现查询的条件之一
        price: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' },
          { min: 1, max: 9, message: '长度在 1 到 9 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.findAllproducts();
    this.query(this.search)
  },
  computed: {
    ...mapState('product', ['products', 'visible', 'title', 'queryResult', 'formLabelWidth']),
    ...mapGetters('product', ['countproducts', 'productStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('product', ['findAllproducts', 'deleteproductById', 'saveOrUpdateproduct', 'batchDeleteproducts', 'query']),
    ...mapMutations('product', ['showModal', 'closeModal', 'setTitle']),
    // 映射查找该产品的所有地址方法
    ...mapActions('address', ['findAddressByproductId']),
    // 普通方法
    toDetails(product) {
      // 跳转到产品详情页面
      this.$router.push({
        path: '/product/productDetail',
        query: { product }
        // params:{id:1}
      })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加产品信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.productForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdateproduct(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
              this.query(this.search)
            })
        } else {
          return false
        }
      })
    },
    // 单个删除
    async deleteHandler(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.deleteproductById(id)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.query(this.search)
            })
        })
    },
    editHandler(row) {
      this.form = row
      this.setTitle('修改产品信息')
      this.showModal()
    },
    // 监控模态框关闭
    dialogCloseHandler() {
      this.closeModal()
      this.$refs.productForm.resetFields()
      this.form = {}
    },
    // 批量删除
    batchHandler() {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.batchDeleteproducts(this.ids)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
              this.query(this.search)
            })
        })
    },
    // 查询
    searchHandler() {
      if (/^[0-9]*[1-9][0-9]*$/.test(this.keyWord)) {
        console.log('数字')
        this.search.price = this.keyWord
      } else if (/[\u4E00-\u9FA5]+/.test(this.keyWord)) {
        console.log('字符')
        this.search.name = this.keyWord
      } else {
        this.search.name = ''
        this.search.price = ''
      }
      // this.search.name=this.keyWord;

      this.query(this.search)
    },
		 // 翻页
    pageChangeHandler(currentPage) {
      this.search.page = currentPage - 1
      this.query(this.search)
    }
  }
}
</script>
<style scoped>

</style>
