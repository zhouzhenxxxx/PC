// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'

export default {
  namespaced: true,
  state: {
    visible: false,
    categories: [],
    queryResult: {},
    title: '添加栏目信息',
    formLabelWidth: '80px'
  },
  getters: {
    countCategories: (state) => {
      return state.categories.length
    },
    // 需要为获取器传递参数的写法
    categoryStatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.categories.filter(item => item.status === status)
        } else {
          return state.categories
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
    // 刷新得到的数据
    refreshCategories(state, categories) {
      console.log('state->', state)
      state.categories = categories
    },
    // 刷新分页查询结果的数据
    refreQuery(state, queryResult) {
      state.queryResult = queryResult
      state.categories = queryResult.list
    },
    // 修改标题
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    // 批量删除
    async batchDeleteCategories(context, ids) {
      const response = await post_array('/category/batchDelete', { ids })
      context.dispatch('findAllCategories')
      context.commit('refreshCategories', response.data)
      return response
    },
    // 查询全部
    async findAllCategories(context) {
      console.log('context->', context)
      // 1. 查询所有栏目信息
      const response = await get('/category/findAll')
      // 2. 将栏目信息设置到state.categories中
      context.commit('refreshCategories', response.data)
    },
    // 删除
    async deleteCategoryById({ dispatch, commit }, id) {
      // 1. 删除栏目信息
      const response = await get('/category/deleteById', { id })
      // 2. 刷新
      // dispatch("findAllCategories",response.data)
      // 3. 提示成功
      return response
    },
    // 更新操作
    async saveOrUpdateCategory({ dispatch, commit }, category) {
      // 1. 提交请求
      const response = await post('/category/saveOrUpdate', category)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      // dispatch("findAllCategories");
      // 4. 提示成功 react
      return response
    },
    // 分页查询
    async query({ commit, dispatch }, search) {
      const response = await post('/category/query', search)
      commit('refreQuery', response.data)
    }
  }
}
