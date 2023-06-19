import DcApi from "@/api";
export default {
  namespaced: true,
  state: {
    userOrderPayways: {}
  },
  getters: {},
  mutations: {
    setOrderPayways(state, data) {
        state.userOrderPayways = data
    }
  },
  actions: {}
};
