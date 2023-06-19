<template>
<div class="content-wrapper"> 
    <el-form :inline="true" size="medium" class="demo-form-inline">
    <div class="content-search-normal">
     <el-form-item label="统计日期">
        <el-date-picker v-model="countDate" @change="dateSearch()" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="起始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
          <el-button :style="{backgroundColor:state == 1?'#2273ce': '',color:state == 1? '#fff':''}" @click="state=1;clickHander()">
              今天
          </el-button>
          <el-button  :style="{backgroundColor:state == 2?'#2273ce': '',color:state == 2? '#fff':''}" @click="state=2;clickHander()">
              昨天
          </el-button>
          <el-button  :style="{backgroundColor:state == 3?'#2273ce': '',color:state == 3? '#fff':''}" @click="state=3;clickHander()">
              近7天
          </el-button>
          <el-button  :style="{backgroundColor:state == 4?'#2273ce': '',color:state == 4? '#fff':''}" @click="state=4;clickHander()">
              近15天
          </el-button>
          <el-button  :style="{backgroundColor:state == 5?'#2273ce': '',color:state == 5? '#fff':''}" @click="state=5;clickHander()">
              近30天
          </el-button>
      </el-form-item>
    </div>
    </el-form>
   
    <div class="overview"> 
        <h1 class="word-main">概况总览</h1>
       <div style="display:flex">
           <div class="common">
               <div><span  class="textStyle">航线总条数</span><span class="textData">{{overviewData.totalRoutes}}</span></div>
           </div>
           <div class="common">
                <div><span  class="textStyle">代理总数</span><span class="textData">{{overviewData.totalAgent}}</span></div>
           </div>
       </div>
       
       <div style="display:flex;">
           <div class="common" style="margin-top:20px">
                 <div><span  class="textStyle">新增航线数</span><span class="textData">{{overviewData.newlyAddRoutes}}</span></div>
           </div>
           <div class="common" style="margin-top:20px">
                <div><span  class="textStyle">删除航线数</span><span class="textData">{{overviewData.deleteRoutes}}</span></div>  
           </div>
           <div class="common" style="margin-top:20px">
                <div><span  class="textStyle">更新航线条数</span><span class="textData">{{overviewData.updateRoutes}}</span></div>
                <div><span  class="textStyle">更新航线占比</span><span class="textData">{{(overviewData.updateRoutesProportion*100).toFixed(2)+'%'}}</span></div>
                <div><span  class="textStyle">较上一周期统计</span><span class="textData" :style="{color:overviewData.updateRoutesProportionCount>0?'red':overviewData.updateRoutesProportionCount < 0?'green':'black'}">{{overviewData.updateRoutesProportionCount == null? "-" :overviewData.updateRoutesProportionCount>0?'+'+(overviewData.updateRoutesProportionCount*100).toFixed(2)+'%':(overviewData.updateRoutesProportionCount*100).toFixed(2)+'%'}}</span></div>
           </div>
       
           <div class="common" style="margin-top:20px;display:flex;">
             <div>
                <div><span  class="textStyle">已完善航线总数</span><span class="textData">{{overviewData.perfectRoutes}}</span></div>
                <div style="margin-top:10px"><span  class="textStyle">已完善航线占比</span><span class="textData">{{(overviewData.perfectRoutesCount*100).toFixed(2)+"%"}}</span></div>
             </div>
           </div>
           <div class="common" style="margin-top:20px;display:flex;">
             <div>
                 <div><span  class="textStyle">未完善航线条数</span><span class="textData">{{overviewData.unPerfectRoutes}}</span></div>
                <div style="margin-top:10px"><span  class="textStyle">未完善航线占比</span><span class="textData">{{(overviewData.unPerfectRoutesCount*100).toFixed(2)+"%"}}</span></div>
             </div>
           </div>
       </div>

    </div>

    <div class="table-one"> 
         <h1 class="word-main">单人更新航线数据统计  <el-button @click="exportOperator()"   style="margin-left:10px;" type="primary" size="mini" v-auth="['502001_B']">导出列表</el-button></h1>
      <div style="display:flex;flex-wrap: wrap;">
          <div style="margin-top:10px;margin-left:20px" v-for="(item,index) in tableData " :key="index">
         <el-table
        :data="item"
        border
        stripe
        header
        >
        <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png" />
              <p>暂无数据</p>
            </template>
        <el-table-column
          prop="name"
          label="航线人员"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="totalRoutes"
          label="航线总数"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="newlyAddRoutes"
          label="新增航线总数"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="updateRoutesCounts"
          label="更新次数"
          min-width="40"
        ></el-table-column>
         </el-table>
         
        </div>
      </div>
        
    </div>

    <div class="table-two">
        <h1 class="word-main">各区域航线数据统计  <el-button  @click="exportArea()" style="margin-left:10px;" type="primary" size="mini" v-auth="['502001_B']">导出列表</el-button></h1>
        <div style="margin-top:10px;margin-left:20px;">
          <el-table
        :data="table"
        border
        stripe
        header
        >
        <template slot="empty">
              <img class="data-pic" src="../../assets/kong-icon.png" />
              <p>暂无数据</p>
            </template>
        <el-table-column
          prop="name"
          label="地域"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="totalRoutes"
          label="航线总数"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="newlyAddRoutes"
          label="新增航线总数"
          min-width="40"
        ></el-table-column>
         <el-table-column
          prop="updateRoutesCounts"
          label="更新次数"
          min-width="40"
        ></el-table-column>
         </el-table>
        </div>

    </div>

</div>   
</template>
<script>
export default{
    data(){
        return{
            overviewData:{totalRoutes:'',
            totalAgent:'',
            newlyAddRoutes:'',
            deleteRoutes:'',
            updateRoutes:'',
            updateRoutesProportion:'',
            updateRoutesProportionCount:'',
            
          
           
            perfectRoutes:"",
            perfectRoutesCount:'',
            unPerfectRoutes:'',
            unPerfectRoutesCount:""},
            countDate:['',''],
            tableData:[[]],
            table:[],
            state:1,

        }
    },
    mounted() {
        this.initAirData()
    },
    methods:{
      initAirData(){
        let params ={
            date:this.state,
            startDate:this.countDate[0],
            endDate:this.countDate[1]
        }
        this.$http.post(this.$service.searchAirData,params).then((res)=>{
            if(res.code == 200) {
                  this.overviewData = res.data
                 let json = JSON.parse(JSON.stringify(res.data.operatorRoutesVOList))
                 for(let i =0;;i++){
                     this.tableData[i] = json.splice(0,10)
                     if(json.length == 0) break
                 }
                this.table = res.data.areaRoutesVOList
                for(var item of this.table) {
                  if(item.newlyAddRoutes ==null) {
                    item.newlyAddRoutes = 0
                  }
                  if( item.totalRoutes==null) {
                     item.totalRoutes = 0
                  }
                  if(item.updateRoutesCounts==null) {
                      item.updateRoutesCounts = 0
                  }
                }
                
                  
            }
            else {
                this.$message.error(res.message)
            }
            
        })
     },
     clickHander() {
        this.countDate=['','']
        this.initAirData()
     },
     dateSearch(){
         this.state = ""
         this.initAirData()

     },
     exportOperator() {
         let json = {
              date:this.state,
            startDate:this.countDate[0],
            endDate:this.countDate[1]
         }
         this.$http.post(this.$service.exportOperator,json,{
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '单人更新航线数据统计' + '.xlsx') 
            aLink.click()
            document.body.appendChild(aLink)
        })

     },
     exportArea() {
          let json = {
              date:this.state,
            startDate:this.countDate[0],
            endDate:this.countDate[1]
         }
          this.$http.post(this.$service.exportArea,json,{
            responseType: 'arraybuffer'
          }).then(res=>{
            const aLink = document.createElement("a");
            let blob = new Blob([res], {
              type: "application/vnd.ms-excel"
            })
            aLink.href = URL.createObjectURL(blob)
            aLink.setAttribute('download', '区域航线数据' + '.xlsx') 
            aLink.click()
            document.body.appendChild(aLink)
        })

     }
     
     
    }
}
</script>
<style scoped lang="less">
/deep/ .el-table .cell {
    text-overflow: inherit;
    padding-right: 0;
    text-align: center;
}
/deep/ .el-table__header-wrapper {
    width:550px;
  
}
/deep/ .el-table{
    width:550px;
}
/deep/.el-table__header-wrapper>table {
    width:auto!important;
  
}
/deep/ .el-table--border {
    border: none;
}
.content-wrapper {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  background-color: #f3f6f9 !important;
}
.content-search-normal {
  padding: 20px !important;
  background: #fff;
}
.overview{
    margin-top:20px;
    background-color:#fff;
    height: 300px;
    

}
.word-main{
 font-weight: 700;
 font-size: 15px;
 margin-left:20px;
 height: 50px;
 display: flex;
 align-items: center;
}
.common{
    border:1px solid black;
    height: 100px;
    width: 250px;
    margin-left:20px;
    display:flex;
     flex-direction: column;
    justify-content: space-around;
}
.textStyle{
    font-weight: 400;
    font-style: normal;
    font-size: 13px;
    letter-spacing: normal;
    white-space: nowrap;
    margin-left:10px;
    color: rgba(0, 0, 0, 0.419607843137255);

}
.textData{
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    margin-left:10px;
    color:black;
}
.table-one{
    background-color:#fff;
    margin-top:20px;
    padding-bottom:20px
}
.table-two{
    background-color: #fff;
    padding-bottom:20px;
    margin-top:20px;
}

</style>