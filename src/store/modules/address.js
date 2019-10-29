// import request from '@/utils/request'
import { get, post, post_array } from '@/http/axios'

export default {
  namespaced: true,
  state: {
    allAddressofcustomer: []// 顾客的所有地址
  },
  getters: {

  },
  mutations: {
    refreshAllAddressofcustomer(state, data) {
      state.allAddressofcustomer = data
    }
  },
  actions: {
    async findAddressByCustomerId({ commit, dispath }, id) {
      const response = await get('/address/findByCustomerId', { id })
      commit('refreshAllAddressofcustomer', response.data)
      console.log('this is result', response)
      return response
    }
  }
}
