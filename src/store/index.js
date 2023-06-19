import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import financial from './modules/financial'
import common from './modules/common'
import chatRoom from './modules/chatRoom'
import orderModule from "./modules/userOrder";
import persistedState from "vuex-persistedstate";

Vue.use(Vuex)

// setTimeout(()=>{store.dispatch("getCurrencyTypes")})

const store = new Vuex.Store({
  state: {
    userManageType: 0,
    dogShowZ: 0,
    infoHeadFromZoom: false,
    warnOrderNo: "",
    userOrder: []
  },
  modules: {
    user,
    financial,
    common,
    chatRoom,
    orderModule
  },
  getters: {
    // 只能选今天及之前的日期选择器配置
    tomorrowDisabledDatePickerOptions() {
      return {
        disabledDate: time => {
          const today = new Date().getTime();
          return time.getTime() > today;
        }
      };
    }
  },
  mutations: {
    // 页面级别传值
    changeUserManageType(state, data) {
      state.userManageType = data;
    },
    changeUserOrder(state, data) {
      state.userOrder = data;
    },
    changeDogShow(state, data) {
      state.dogShowZ = data;
    },
    changeInfoHeadFromZoom(state, data) {
      state.infoHeadFromZoom = data;
    },
    changeWarnOrderNo(state, data) {
      state.warnOrderNo = data;
    }
    // this.$store.commit('changeUserManageType',10) //mutations
  },
  plugins: [
    persistedState({
      storage: window.sessionStorage
    })
  ]
});

export default store