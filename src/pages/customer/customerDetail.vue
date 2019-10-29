<template>
  <div>
    <h2>顾客详情</h2>
    <el-col :offset="22">
      <el-button type="primary" size="small" @click="backHandler">返回</el-button>
    </el-col>

    <el-col>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有地址" name="second">所有地址
          <!--展示数据表格-->
          <el-table :data="allAddressofcustomer" style="width: 100%;">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column label="编号" width="80" align="center">
                            <template v-slot:default="scope">
                                <input type="checkbox" :value="scope.row.id">
                            </template>
                        </el-table-column> -->
            <el-table-column prop="id" label="地址编号" align="center" />
            <el-table-column prop="customerId" label="顾客编号" align="center" />
            <el-table-column prop="province" label="省份" align="center" />
            <el-table-column prop="city" label="城市" align="center" />
            <el-table-column prop="area" label="区域" align="center" />
            <el-table-column prop="address" label="地址" align="center" />
            <el-table-column prop="telephone" label="电话" align="center" />
            <!-- <el-table-column label="操作" align="center">
                        <template v-slot:default="scope">
                        <el-button type="danger" icon="el-icon-delete" circle @click.prevent="deleteHandler(scope.row.id)" />
                        <el-button type="primary" icon="el-icon-edit" circle @click.prevent="editHandler(scope.row)" />
                        </template>
                    </el-table-column> -->
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="所有订单" name="first">所有订单
          <el-table  style="width: 100%;">
            <el-table-column type="selection" width="55" />
            <!-- <el-table-column label="编号" width="80" align="center">
                            <template v-slot:default="scope">
                                <input type="checkbox" :value="scope.row.id">
                            </template>
                        </el-table-column> -->
            <el-table-column  label="顾客编号" align="center" />
            <el-table-column  label="地址编号" align="center" />
            <el-table-column  label="下单时间" align="center" />
            <el-table-column  label="数量" align="center" />
            <el-table-column  label="总数" align="center" />
            <el-table-column  label="状态" align="center" />
            <el-table-column  label="备注" align="center" />
            <!-- <el-table-column label="操作" align="center">
                        <template v-slot:default="scope">
                        <el-button type="danger" icon="el-icon-delete" circle @click.prevent="deleteHandler(scope.row.id)" />
                        <el-button type="primary" icon="el-icon-edit" circle @click.prevent="editHandler(scope.row)" />
                        </template>
                    </el-table-column> -->
          </el-table>
        </el-tab-pane>
        
      </el-tabs>
    </el-col>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: 'first',
    }
  },
  computed: {
    ...mapState('address', ['allAddressofcustomer'])
  },
  created() {
    
    console.log(this.$route)
    this.customer = this.$route.query.customer
    console.log('222222220', this.customer)
    console.log('typeof', typeof this.customer.id)
    this.findAddressByCustomerId(this.customer.id)

  },
  methods: {
    // 映射address的方法
    ...mapActions('address', ['findAddressByCustomerId']),
    backHandler() {
      this.$router.go(-1)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style scoped>

</style>
