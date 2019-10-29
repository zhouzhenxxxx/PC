<template>
  <div class="order">
    <h2>订单管理</h2>
    <!-- 二级栏目 -->
    <!-- 所有订单 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有订单" name="allOrder">
            <!-- 按钮 -->
            <div class="btns">
              <!-- 左侧搜索 -->
              <el-col :span="16">
                <el-form :inline="true">
                  <el-form-item>
                    <el-input v-model="search.name" placeholder="请输入名称" clearable />
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
            <el-table :data="orders" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
            <!--更新操作模态框-->
            <el-dialog :title="title" :visible="visible" @close="dialogCloseHandler">
              <el-form ref="orderForm" :model="form" :rules="rules">
                <!-- <el-form-item label="顾客" :label-width="formLabelWidth" prop="customerId">
                  <el-input v-model="form.customerId" autocomplete="off"></el-input>
                </el-form-item>  -->
                <el-form-item label="顾客">
                  <el-select v-model="customersId" placeholder="顾客姓名">
                    <el-option v-for="c in customers" :key="c.id" :label="c.realname" :value="c.id" />
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="地址">
                        <el-select placeholder="地址信息">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item> -->
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCloseHandler">取 消</el-button>
                <el-button type="primary" @click="submitHandler(form)">确 定</el-button>
              </div>
            </el-dialog>
            <!--/更新操作模态框-->

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
        </el-tab-pane>
        <!-- /所有订单 -->
        <!-- 待支付 -->
        <el-tab-pane label="待支付" name="dzf">         
            <el-table :data="statusDpd('待支付')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
          <!--/ 待支付 -->
        <el-tab-pane label="待派单" name="dpd">         
            <el-table :data="statusDpd('待派单')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="待接单" name="djd">
                <el-table :data="statusDpd('待接单')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="待服务" name="dfu">
              <el-table :data="statusDpd('待服务')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="待确认" name="dqr">
              <el-table :data="statusDpd('待确认')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="done">
              <el-table :data="statusDpd('已完成')" @selection-change="idsChangeHandler">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="订单编号" />
              <el-table-column prop="orderTime" label="下单时间" />
              <el-table-column prop="total" label="总价" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="customerId" label="顾客编号" />
              <el-table-column label="操作" width="100px" align="center">
                <template #default="record">
                  <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
                  <a href="" class="el-icon-warning" @click.prevent="toDetails(record.row)" />
                </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    <!--/ 二级栏目 -->
    
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      form: {},
      customersId: [],
      activeName: 'allOrder',
      search: {
        page: 0,
        pageSize: 9, // 每页显示几条数据
        customerId: ''// 实现查询的条件之一
	    },
      rules: {
        customerId: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到  个字符', trigger: 'blur' }
        ],
        addressId: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.findAllOrders();
    this.query(this.search)
  },
  computed: {
    ...mapState('order', ['orders', 'visible', 'title', 'queryResult', 'formLabelWidth','allOrders']),
    ...mapGetters('order', ['statusDpd']),
    // 顾客的信息
    ...mapState('customer', ['customers']),
    // 普通信息
    allCustomer() {
      return customers
    },

  },
  methods: {
    ...mapActions('order', ['findAllOrders', 'deleteOrderById', 'saveOrder', 'batchDeleteOrders', 'query']),
    ...mapMutations('order', ['showModal', 'closeModal', 'setTitle']),
    // 初始化顾客
    ...mapActions('customer', ['findAllCustomers']),
    // 普通方法
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    toDetails(order) {
      // 跳转到顾客详情页面
      this.$router.push({
        path: '/orderDetail',
        query: { order }
        // params:{id:1}
      })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加订单信息'),
      this.findAllCustomers(), // 获得所有顾客信息
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrder(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
              this.query(this.search)
            })
        } else {
          return false
        }
      })
    },
    filterStatus(){
      //this.findAllOrders(); 
      //this.statusDpd("待派单");
    },

    // 单个删除
    async deleteHandler(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
      })
        .then(() => {
          this.deleteOrderById(id)
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
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    // 监控模态框关闭
    dialogCloseHandler() {
      this.closeModal()
      this.$refs.orderForm.resetFields()
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
          this.batchDeleteOrders(this.ids)
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
