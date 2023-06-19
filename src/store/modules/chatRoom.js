
import DcApi from '@/api'
import { Message } from 'element-ui'
export default{
    namespaced:true,
    state:{
        leftOrderMes:[],
        targetChatContent:[],
        quickAllLanguage:[],
        // 聊天内容顶部
        chatMessageExtra:{},
        chatRoomTitleBox:{},
        // 聊天内容
        chatRoomContent:{},
        wsDisable:false,
        activeIndex:'',
    },
    getters:{
        ifSelf(state){
            let target = sessionStorage.getItem('userId') == state.chatRoomTitleBox.customerId?state.chatRoomTitleBox.chatName:state.chatRoomTitleBox.customerName
            return target == state.chatMessageExtra.chatName 
        },
        ifLeader(state){
            let loginId = sessionStorage.getItem('userId') 
            return loginId != state.chatRoomTitleBox.customerId && loginId != state.chatRoomTitleBox.serviceId
        }
    },
    mutations:{
        SetOrderMes(state, data) {
            state.leftOrderMes = data
          },
        spliceOrderMes(state,data){
            state.leftOrderMes.splice(...data)
        },
        unShiftOrderMes(state,data){
            state.leftOrderMes.unshift(data)
        },
        setQuickAllMessage(state,data){
            state.quickAllLanguage = data
        },
        setChatMessageExtra(state,data){
            state.chatMessageExtra = data
        },
        setChatRoomTitleBox(state,data){
            state.chatRoomTitleBox = data
        },
        setChatRoomContent(state,data){
            state.chatRoomContent = data
        },
        setWsDisable(state,data){
            state.wsDisable = data
        },
        setActiveIndex(state,data){
            state.activeIndex = data
        }
    },
    actions:{

        async createNewChat({ commit },payload) {
            try {
              const {data:{data:{records}}} = await DcApi.searchInquiry(payload)
              if(records && records[0]){
                commit("spliceOrderMes", [0,0,...records]);
              }
            } catch (error) { }
          },
    }
}