<template>
    <div class="page">
        <div class="pageTitle" v-if="!leavePage && !podSetPage">
            会话设置
        </div>
        <div class="pageTitle sPageTitle" v-else> 
            <div class="sPageTitleReturn" @click="returnHome">
                <i class="el-icon-d-arrow-left" style="color:#d7d7d7;font-size:16px"></i> 返回
            </div>
            {{sPageTitle}}
        </div>
        <div class="pageBody" v-if="!leavePage && !podSetPage">
            <div class="pageBodyContent" v-for="(item,index) in pageBodyData" :key="index" v-auth:none="item.cardAuthCodes">
                <div class="contentTitle">
                    {{item.title}}
                </div>
                <div class="contentWord">
                    {{item.word}}
                </div>
                <div class="enter" @click="enterPage(index)" v-auth:none="item.enterBtnAuthCodes">
                    进入
                </div>
            </div>
            <!-- <div class="pageBodyContent"></div> -->
        </div>
        <leaveDivide v-if="leavePage"></leaveDivide>
        <podSet v-if="podSetPage"></podSet>
    </div>
</template>
<script>
import leaveDivide from './components/leaveDivide.vue'
import podSet from './components/podSet.vue'
export default {
   components: {
        leaveDivide,
        podSet
  },
  data() {
    return {
        pageBodyData:[
            // {
            //     title:'请假分配',
            //     word:'人员处于请假期间,询盘会话人工坐席backup安排',
            // },
            {
                title:'航线分配规则',
                word:'可根据询盘分类,将其指定给不同的航线负责人',
            },
        ],
        leavePage:false, //显示请假分配页面
        podSetPage:false,//显示目的港分配页面
        sPageTitle:'',
        currentPageList:['leavePage','podSetPage']
    };
  },
  created() {
    for(let i of this.currentPageList){
        if( sessionStorage.getItem(i) == 'true'){
            this[i] = true
        }
    }
  },
  mounted(){
  },
  methods:{
    //进入页面
    enterPage(idx) {
        switch(idx) {
            // case 0: this.leavePage = true;this.sPageTitle = '请假分配'
            //  break;
            case 0: this.podSetPage = true;this.sPageTitle = '航线分配规则'
             break;
        }
    },
    returnHome(){
        for(let i of this.currentPageList){
            this[i] = false;
            sessionStorage.setItem(i,false)
        }
    }
  }
  
};
</script>
<style lang="less" scoped>
    .sameTitle{
        background-color: #fff;
        height: 35px;
        padding-top: 15px;
        font-size: 18px;
        font-weight: 600;

    }
    .page {
        // background-color: #f3f6f9;
        padding-top:15px;
        &Title{
            text-indent: 25px;
            padding:10px 0;
            line-height:30px;
            .sameTitle;
        }
        .sPageTitle{
            .sameTitle;
            text-align: center;
            position: relative;
            &Return{
                text-indent: 0px;
                line-height: normal;
                border:1px solid #d7d2d2;
                display: inline-block;
                position: absolute;
                left:15px;
                top:12px;
                font-weight: normal;
                font-size: 14px;
                padding: 8px;
                padding-left: 4px;
                cursor: pointer;
            }
        }
        &Body{
            display: grid;
            grid-template-columns:repeat(3,1fr) ;
            grid-column-gap: 200px;
            &Content{
                background-color: #fff;
                height:300px;
                margin-top:30px ;
                padding-top: 20px;
                position:relative;
                .contentTitle{
                    font-size: 16px;
                    text-align: center;
                }
                .contentWord{
                    text-indent: 30px;
                    color:#7f7f7f;
                    font-size: 14px;
                    margin-top: 20px;
                }
                .enter{
                    position: absolute;
                    bottom:20px;
                    right:20px;
                    color:#1890ff;
                    font-size: 14px;
                    cursor: pointer;
                }
            }
        }
    }
</style>