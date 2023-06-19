
import serviceApi from '@/service/index'
import http from '@/util/http'

const user = {
  state: {
    name: '',
    UserID: '',
    token: '',
    userInfo: '',
    menuList:[]
  },

  getters: {
    getToken (state) {
      const cache = sessionStorage.getItem('token')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.token) {
        return state.token
      } else {
        return cacheData
      }
    },
    getName (state) {
      const cache = sessionStorage.getItem('name')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.name) {
        return state.name
      } else {
        return cacheData
      }
    },
    getUserID (state) {
      const cache = sessionStorage.getItem('UserID')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.UserID) {
        return state.UserID
      } else {
        return cacheData
      }
    },
    getUserInfo (state) {
      const cache = sessionStorage.getItem('userInfo')
      let cacheData = null
      if (cache) {
        cacheData = JSON.parse(cache)
      }
      if (state.userInfo) {
        return state.userInfo
      } else {
        return cacheData
      }
    }
  },

  mutations: {
    getLeftMenu:(state, menuList) => { //07-27添加
      state.menuList = menuList
    }
  },
  actions : {
    getLeftMenu({ commit }, menuList) {  //07-27添加
      commit('getLeftMenu', menuList)
    }
  }
}

export default user
