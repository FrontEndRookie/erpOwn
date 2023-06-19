import http from '@/util/http'
import serviceAPI from '@/service/index'
import DcApi from '@/api'
export default {
  state: {
    expenseCodeOpt: [], // 费用列表
    airCompanys: [], // 航空公司列表
    agentList: [], // 代理列表
    principalList: [], // 航线负责人列表
    pscsList: [], // 售前列表
    mscsList: [], // 售中列表
    authFields: [],
    currencyTypes: [], // 货币
    countInfo: {},
    menuCountInfo: {},
  },
  getters: {
    // 返回不包含人民币的货币数组
    getCurrencyExceptChina(state, getters){
      return  state.currencyTypes.filter((item)=>{
        return (item.name !== "人民币")
      })
    },
    // 返回货币数组以id为索引取值的对象[{id:code,1:'CNY',2:'HKD',...},{id:symbol,...},{id:name,...},{id:status,...}] code:"CNY",symbol:"￥",name:"人民币",status:0 禁用状态
    getCurrencyIdObjArr(state, getters){
      return  [{},{},{},{}].map((item,index)=>{
        var obj = {}
        for (let i = 0; i < state.currencyTypes.length; i++) {
          // this.$set(obj,state.currencyTypes[i].id,state.currencyTypes[i][type])
          if(index === 0){obj[state.currencyTypes[i].id] = state.currencyTypes[i].code;continue}
          if(index === 1){obj[state.currencyTypes[i].id] = state.currencyTypes[i].symbol;continue}
          if(index === 2){obj[state.currencyTypes[i].id] = state.currencyTypes[i].name;continue}
          if(index === 3){obj[state.currencyTypes[i].id] = state.currencyTypes[i].status;continue}
        }
        return obj
      })
    },
    // 添加 id=0 时 也为人民币 用于财务列表
    getCurrencyFinance(state, getters){
      var array = JSON.parse(JSON.stringify(state.currencyTypes))
      var array1 = state.currencyTypes.filter((item)=>{
        if(item.name == "人民币"){
          return item
        }
      })
      var obj = JSON.parse(JSON.stringify(array1[0]))
      obj.id = 0
      array.push(obj)
      return array
    },
    // 返回货币数组增加 Value == id label == name:人民币
    getCurrencyAddValue(state, getters){
      return  state.currencyTypes.map((item)=>{
        item.value = item.id
        item.label = item.name
        return item
      })
    },
    // 返回货币数组增加 Value == id label == code:CNY
    getCurrencyAddValCode(state, getters){
      return  state.currencyTypes.map((item)=>{
        item.value = item.id
        item.label = item.code
        return item
      })
    },
    allAuthFields(state, getters) {
      return state.authFields.map(item => item.fieldCode)
    },
    validAuthFields(state, getters) {
      return state.authFields.filter(item => {
        return [1, 2].includes(item.level) || [1].includes(item.listFlag)
      })
    },
    validEditAuthFieldCodes(state, getters) {
      return getters.validAuthFields.filter(item => [2].includes(item.level)).map(item => item.fieldCode)
    },
    validViewAuthFieldCodes(state, getters) {
      return getters.validAuthFields.filter(item => [1].includes(item.level)).map(item => item.fieldCode)
    },
    validListAuthFieldCodes(state, getters) {
      return getters.validAuthFields.filter(item => [1].includes(item.listFlag)).map(item => item.fieldCode)
    },
  },
  mutations: {
    SET_EXPENSE_CODE_OPT(state, data) {
      state.expenseCodeOpt = data
    },
    SET_CURRENCY_TYPES(state, data) {
      state.currencyTypes = data
    },
    SET_AIRCOMPANYS(state, data) {
      state.airCompanys = data
    },
    SET_AGENT_LIST(state, data) {
      state.agentList = data
    },
    SET_PRINCIPAL_LIST(state, data) {
      state.principalList = data
    },
    SET_PSCS_LIST(state, data) {
      state.pscsList = data
    },
    SET_MSCS_LIST(state, data) {
      state.mscsList = data
    },
    SET_THREE_LETTER_CODES(state, data) {
      state.threeLetterCodes = data
    },
    SET_AUTH_FIELDS(state, data) {
      state.authFields = data
    },
    SET_COUNT_INFO(state, data) {
      state.countInfo = {
        ...state.countInfo,
        ...data
      }
    },
  },
  actions: {
    getExpenseCodeOpt({ commit }) {
      http.get(serviceAPI.expenseSearchExcludeAirFee, {
        params: {
          pageSize: 50000,
        }
      }).then((data) => {
        if (data.code == 200) {
          commit('SET_EXPENSE_CODE_OPT', data.data.records)
        }
      })
    },
    getCurrencyTypes({ commit }) {
      if(!sessionStorage.getItem("userInfo")){
        return
      }
      console.log("赋值前");
      http.post(serviceAPI.searchByCurrency, {
        params: {}
      }).then((data) => {
        if (data.code == 200) {
          commit('SET_CURRENCY_TYPES', data.data)
        }else{
          console.warn("费率获取失败")
          alert("费率获取失败:",data.message)
        }
      })
    },
    getAirCompanys({ commit }) {
      commit('SET_AIRCOMPANYS', [])
    },
    getAgentList({ commit }) {
      commit('SET_AGENT_LIST', [])
    },
    getPrincipalList({ commit }) {
      commit('SET_PRINCIPAL_LIST', [])
    },
    getPscsList({ commit }) {
      commit('SET_PSCS_LIST', [])
    },
    getMscsList({ commit }) {
      commit('SET_MSCS_LIST', [])
    },
    async getOrderCountInfo({ commit }) {
      try {
        const { data: { data } } = await DcApi.countOrderList()
        commit("SET_COUNT_INFO", data);
      } catch (error) { }
    },
    async getMenuCountInfo({ commit }) {
      try {
        const { data: { data } } = await DcApi.getMenuCountInfo({
          isCountApi: true,
        })
        const { agentExamNum, predominantExamNum } = data
        commit("SET_COUNT_INFO", {
          ...data,
          agentTotal: agentExamNum + predominantExamNum,
        });
      } catch (error) { }
    },
  }
}
