// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'
export default {
  namespaced: true,
  state: {
    visible: false,
    products: [],
    queryResult: {},
    formLabelWidth: '80px',
    title: '添加产品信息'
  },
  getters: {
    countproducts: (state) => {
      return state.products.length
    },
    // 需要为获取器传递参数的写法
    productstatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.products.filter(item => item.status === status)
        } else {
          return state.products
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
    // 需要接受一个参数，这个参数就是products
    refreshproducts(state, products) {
      console.log('state->', state)
      state.products = products
    },
    // 刷新分页查询结果的数据
    refreQuery(state, queryResult) {
      state.queryResult = queryResult
      state.products = queryResult.list
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteproducts(context, ids) {
      const response = await post_array('/product/batchDelete', { ids }) // //参数为对象
      context.dispatch('findAllproducts')
      return response
    },
    // async findAllproducts({commit,dispatch,getters,state}){
    async findAllproducts(context) {
      console.log('context->', context)
      // 1. 查询所有产品信息
      const response = await get('/product/findAll')
      // alert(JSON.stringify(response));
      // 2. 将产品信息设置到state.products中
      context.commit('refreshproducts', response.data)
    },
    async deleteproductById({ dispatch }, id) {
      // 1. 删除产品信息
      const response = await get('/product/deleteById', { id })
      // 2. 刷新
      // dispatch("findAllproducts")
      // 3. 提示成功
      return response
    },
    async saveOrUpdateproduct({ dispatch, commit }, product) {
      // 1. 提交请求
      const response = await post('/product/saveOrUpdate', product)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      dispatch('findAllproducts')
      // 4. 提示成功 react
      return response
    },
    // 分页查询
    async query({ commit, dispatch }, search) {
      const response = await post('/product/query', search)
      commit('refreQuery', response.data)
    }
  }
}
