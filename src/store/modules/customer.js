// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
    visible: false,
    customers: [],
    queryResult: {},
    formLabelWidth: '80px',
    title: '添加顾客信息'
  },
  getters: {
    countCustomers: (state) => {
      return state.customers.length
    },
    // 需要为获取器传递参数的写法
    customerStatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.customers.filter(item => item.status === status)
        } else {
          return state.customers
        }
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    // 需要接受一个参数，这个参数就是customers
    refreshCustomers(state, customers) {
      console.log('state->', state)
      state.customers = customers
    },
    // 刷新分页查询结果的数据
    refreQuery(state, queryResult) {
      state.queryResult = queryResult
      state.customers = queryResult.list
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteCustomers(context, ids) {
      const response = await post_array('/customer/batchDelete', { ids }) // //参数为对象
      context.dispatch('findAllCustomers')
      return response
    },
    // async findAllCustomers({commit,dispatch,getters,state}){
    async findAllCustomers(context) {
      console.log('context->', context)
      // 1. 查询所有顾客信息
      const response = await get('/customer/findAll')
      // alert(JSON.stringify(response));
      // 2. 将顾客信息设置到state.customers中
      context.commit('refreshCustomers', response.data)
    },
    async deleteCustomerById({ dispatch }, id) {
      // 1. 删除顾客信息
      const response = await get('/customer/deleteById', { id })
      // 2. 刷新
      // dispatch("findAllCustomers")
      // 3. 提示成功
      return response
    },
    async saveOrUpdateCustomer({ dispatch, commit }, customer) {
      // 1. 提交请求
      const response = await post('/customer/saveOrUpdate', customer)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      dispatch('findAllCustomers')
      // 4. 提示成功 react
      return response
    },
    // 分页查询
    async query({ commit, dispatch }, search) {
      const response = await post('/customer/query', search)
      commit('refreQuery', response.data)
    }
  }
}
