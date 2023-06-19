<template>
  <div class="content-wrapper" :class="{ embedPage:orderEmbed }">
    <div class="content">
      <div class="left">
        <div class="search" v-if="!orderEmbed">
          <div class="item">
            <el-input
              v-model="orderNo"
              style="width: 200px"
              size="medium"
              onKeyUp="value=value.replace(/[\W]/g,'')"
              spellcheck="false"
              maxlength="15"
              clearable
              placeholder="请输入订单号"
            ></el-input>
            <div class="size-icon" v-auth="['153000_B']">
              <i class="el-icon-search" @click="tabShow"></i>
            </div>
          </div>
        </div>
        <div class="border">
          <div class="left-bottom">
            <div
              @click="subshow"
              style="
                background-color: rgb(0, 21, 41);
                color: #fff;
                height: 50px;
                display: flex;
                justify-content: space-between;
              "
            >
              <span class="icon1"> <i class="el-icon-tickets"></i>主单 </span>
              <div
                style="font-size: 16px; margin-top: 20px; margin-right: 10px"
              >
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>

            <div
              style="
                background-color: rgb(0, 21, 41);
                color: #fff;
                height: 50px;
                display: flex;
                justify-content: space-between;
                margin-top: 1px;
              "
            >
              <div class="icon2"><i class="el-icon-document-copy"></i>分单</div>
              <div
                @click="add(true)"
                style="
                  font-weight: bolder;
                  fontsize: 20px;
                  margin-top: 15px;
                  margin-right: 10px;
                "
              >
                +
              </div>
            </div>

            <div v-for="(item, index) in menudata" :key="index">
              <div
                @click="handlepage(index)"
                style="
                  background-color: rgb(0, 21, 41);
                  color: #fff;
                  height: 50px;
                  display: flex;
                  justify-content: space-between;
                  margin-top: 1px;
                "
              >
                <div
                  style="fontsize: 15px; margin-left: 40px; margin-top: 10px"
                >
                  {{ item.name ? item.name : "分单" + (index + 1) }}
                </div>
                <div
                  @click.stop="closeFirst(index)"
                  style="
                    fontsize: 20px;
                    font-weight: bolder;
                    margin-right: 10px;
                    margin-top: 8px;
                  "
                >
                  x
                </div>
              </div>
            </div>

            <div
              @click="orderSubshow"
              style="
                margin-top: 1px;
                background-color: rgb(0, 21, 41);
                color: #fff;
                height: 50px;
                display: flex;
                justify-content: space-between;
              "
            >
              <div class="icon1"><i class="el-icon-tickets"></i>舱单</div>
              <div
                style="font-size: 16px; margin-top: 20px; margin-right: 10px"
              >
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="bread" style="display: flex">
          <div @click="subshow" id="bread-item1" class="activeColor">
            <div style="margin-left: 10px">
              <div style="font-size: 15px">主单</div>
            </div>
          </div>
          <div v-for="(item, index) in menudata" :key="item.index">
            <div
              @click.stop="consure(index)"
              id="bread-item2"
              v-if="item.show"
              :class="comId == menudata[index].title ? 'activeColor' : ''"
            >
              <div style="font-size: 15px">
                {{ item.name ? item.name : "分单" + (index + 1) }}
              </div>
              <div @click.stop="remove(index)" class="icondelete">
                <i class="el-icon-circle-close"></i>
              </div>
            </div>
          </div>
        </div>

        <div>
          <keep-alive>
            <component
              :is="comId"
              ref="child"
              :key="comId"
              :noPrice="noPrice"
              :menudata="menudata"
              :orderPoint="orderPoint"
              :datatype="comId"
              :mainData="mainData"
              :currentIndex = "currentIndex"
              @sonSaveData="sonSaveData"
            ></component>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import order0 from "../../components/order.vue";
import order1 from "../../components/order.vue";
import order2 from "../../components/order.vue";
import order3 from "../../components/order.vue";
import order4 from "../../components/order.vue";
import order5 from "../../components/order.vue";
import axios from "../../../static/axios.min.js";
const { BILL_URL:billUrl} = process.env
export default {
  props:{
    orderEmbed:{
      type:String,
      default:''
    }
  },
  components: { order0, order5, order1, order2, order3, order4 },
  data() {
    return {
      currentIndex:'',
      orderNo: "",
      // 左侧分单删除完之后再添加默认从1开始
      none: "",
      // 分单数据数组
      menudata: [],
      // 主单数据
      // 获取远程数据
      mainData: "",
      noPrice:0,
      // 控制页面显示
      comId: "order0",
      //控制第二次搜索之后提示
      initState: true,
      // 分泡
      orderPoint:"",
      
    };
  },
  created(){

  },
  mounted(){
    if(this.orderEmbed){
      this.orderNo = this.orderEmbed
      this.tabShow()
    }
    if(this.$route.params.orderNo){
      this.orderNo = this.$route.params.orderNo
      this.tabShow()
   }
  },
  methods: {
    // 子组件调用 返还页面数据
    sonSaveData(data) {
      var index = data[0];
      
      //  分单
      if (index > 0) {
        this.mainData.hawbList[index - 1] = data[1];
        if (data[1].hawb) {
          this.$set(this.menudata[index-1],"name",data[1].hawb)
          this.$set(this.menudata[index-1],"hab",data[1].hawb)
          this.$forceUpdate();
        }
      } else if (index == 0) {
        this.mainData.consigneeInfo = data[1].consigneeInfo;
        this.mainData.goodsInfo = data[1].goodsInfo;
        this.mainData.handlingInfo = data[1].handlingInfo;
        this.mainData.id = data[1].id;
        this.mainData.notificationInfo = data[1].notificationInfo;
        this.mainData.orderNo = data[1].orderNo;
        this.mainData.otherCharges = data[1].otherCharges;
        this.mainData.shipperInfo = data[1].shipperInfo;
        this.mainData.shippingMark = data[1].shippingMark;
        this.mainData.wtVal = data[1].wtVal;
        this.mainData.carrierInfo = data[1].carrierInfo
      }
    },

    // 增加分单
    add(self) {
      // 限制分单最大长度
      if (this.menudata.length > 4) {
        this.$message.warning("最多添加5个分单哦");
        return;
      }
      //从页面中点击+添加
      if (self) { 
        this.mainData.hawbList[this.menudata.length] = {};
        this.mainData.hawbList[this.menudata.length].ifNewData = true;
        this.$nextTick(function(){
            this.menudata[this.menudata.length-1].show = true 
            this.comId = this.menudata[this.menudata.length-1].title
         let item = document.querySelector("#bread-item1");
      if (this.comId != "order0") {
        item.classList.remove("activeColor");
      }
     
        })
        setTimeout(() => {
          this.handlepage(this.menudata.length-1,true)
          
        },100);
      
       
      }
      // 删除完之后默认从1开始添加分单
      if (this.none) {
        let arr = ["order1", "order2", "order3", "order4", "order5"];
        for (let i = 0; i < arr.length; i++) {
          if (this.menudata.every((item) => item.title != arr[i])) {
            this.none = arr[i];
            break;
          }
        }
        this.menudata.push({ title: this.none, show: false });
        let copy = [...this.comId];
        copy[copy.length - 1] = Number(copy[copy.length - 1]) + 1;
        copy = copy.join("");
        // this.$refs.child.relick(copy)
        return;
      }
      // show属性控制右上角面包屑显示与隐藏
      this.menudata.push({
        title: "order" + (this.menudata.length + 1),
        show: false,
      });
    },
    closeFirst(idx){
      sessionStorage.removeItem(`orderNo${idx+1}`)
      this.handlepage(idx)
      setTimeout(()=>{
        this.closeorder(idx)
      },100)
    },
    //  左侧删除分单 以及控制删除完之后显示哪个页面
    closeorder(idx) {
      if (this.mainData) {
        let id = this.menudata[idx].title.slice(-1);
        let data = this.mainData.hawbList[id - 1];
        if (data) {
          this.$refs.child.relick(this.menudata[idx].title)
          this.deleteData(idx);
          this.mainData.hawbList.splice(id - 1, 1);
        }
      }

      let state = this.comId == this.menudata[idx].title;
      // 删除的是当前所在页面
      if (state) {
        // 只剩一个可删除的分单
        if (idx + 1 == this.menudata.length && this.menudata.length == 1) {
          this.comId = "order0";
          this.menudata.splice(idx, 1);
          let item = document.querySelector("#bread-item1");
          item.classList.add("activeColor");
        }
        // 从后面删除 展示前一个页面
        else if (idx + 1 == this.menudata.length && this.menudata.length > 1) {
          this.menudata.splice(idx, 1);
          this.comId = this.menudata[idx - 1].title;
        }
        // 从前面删  展示后一个页面
        else if (idx + 1 != this.menudata.length) {
          this.menudata.splice(idx, 1);
          this.comId = this.menudata[idx].title;
        }
      } else {
        this.menudata.splice(idx, 1);
      }
      let arr = ["order1", "order2", "order3", "order4", "order5"];
      for (let i = 0; i < arr.length; i++) {
        if (this.menudata.every((item) => item.title != arr[i])) {
          this.none = arr[i];
          break;
        }
      }
    },
    initOrderBubblePoint(){
      let param = this.orderNo
      this.$http.get(this.$service.getOrderBubblePoint+'?orderNo='+param).then((res)=>{
        if(res.code == 200) {
          this.orderPoint = res.data
        }
      })


    },
    //  初始化数据
    initData() {
      let param = this.orderNo;
      this.$http
        .get(this.$service.billLading+`/${param}`)
        .then((data) => {  
           if(data.ext) {
            this.noPrice = 1
          }
          if (data.code == 200) {
            let copy = data.data.hawbList;
            this.mainData = data.data;
            this.menudata = [];
            for (let i = 0; i < copy.length; i++) {
              this.add();
              this.$set(this.menudata[i],"hab",copy[i].hawb)
            }
           
            for (let j = 0; j < copy.length; j++) {
              this.$set(
                this.menudata[j],
                "name",
                data.data.hawbList[j].hawb
              );
            }
          } else {
            this.$message.error('该订单号不存在')
            return
          }
       
        });
    },
    //分单删除
    deleteData(idx) {
      let i = this.menudata[idx].title.substring(5);
      if (this.mainData.hawbList) {
        let id = this.mainData.hawbList[i - 1].id;
        axios
          .get(billUrl+"/delete/" + id)
          .then((data) => {
            if (data.data.code == 200) {
              this.$message.success("分单删除成功");
            }
          });
      }
    },
    // 查询
    tabShow() {
      for(let i=0;i<6;i++){
        sessionStorage.removeItem(`orderNo${i}`)
      }
        if(this.orderNo.length<6){
          this.$message.warning('请输入15位完整订单号或订单号后6位')
        } else{
      let bottom = document.querySelector(".left-bottom");
      bottom.style.display = "block";
      if (this.initState) {
        this.initData();
        this.initOrderBubblePoint()
        this.initState = false;
      } else{
        this.$confirm(
          "查询操作会清空未保存数据，请确认数据保存后进行操作，是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.subshow();
            this.initData();
            this.initOrderBubblePoint()
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消查询",
            });
          });
      }
        }
    },
    // 左侧点击分单显示
    handlepage(idx,self) {
      let id = ""
      this.menudata[idx].show = true;
      this.comId = this.menudata[idx].title;
      this.currentIndex = idx+1
      if(self) {
      for(let i=0;i<this.menudata.length;i++) {
        if(!this.menudata[i].name) {
          id = i
          if(id==idx){
          this.$refs.child.newAdd()
          }
        }
      } 
      }
      let item = document.querySelector("#bread-item1");
      if (this.comId != "order0") {
        item.classList.remove("activeColor");
      }
    },
    consure(e) {
      this.comId = this.menudata[e].title;
      this.currentIndex = e+1
      let item = document.querySelector("#bread-item1");
      if (this.comId != "order0") {
        if (item) item.classList.remove("activeColor");
      }
    },
    // 面包屑删除
    remove(e) {
      let newArray = [];
      for (let i = 0, j = this.menudata.length; i < j; i++) {
        if (this.menudata[i].show == true) {
          newArray.push(this.menudata[i].title);
        }
      }
      // 删除的不是当前页面
      this.menudata[e].show = false;
      let state = this.comId == this.menudata[e].title;
      //  删除的是当前页面
      if (state) {
        //  后删
        let len = newArray.length;
        if (this.comId == newArray[len - 1]) {
          this.comId = newArray[len - 2];
        } else {
          let m = newArray.indexOf(this.comId);
          this.comId = newArray[m + 1];
        }
      }
      // 删完最后一个页面重置为提单页面
      if (newArray.length == 1) {
        this.comId = "order0";
        let item = document.querySelector("#bread-item1");
        item.classList.add("activeColor");
      }
    },
    subshow() {
      this.comId = "order0";
      this.currentIndex = ""     
      let item = document.querySelector("#bread-item1");
      item.classList.add("activeColor");
    },
    //  调用子组件方法
    orderSubshow() {
      if (this.mainData) {
        this.$refs.child.cangDanDialog();
      } else {
        this.$message.error("请先输入订单号");
      }
    },
  },
};
</script>
<style scoped lang="less">
.embedPage {
  overflow-y:visible!important;
  height:auto;
}
.content {
  background: #fff;
  margin: 20px 20px 0 20px;
  font-size: 15px;
  display: flex;
}
.left {
  //  height: 800px;
  width: 15%;
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-right: 1px solid;
}
.search {
  height: 60px;
  border: 1px solid rgb(215, 215, 215);
}
.item {
  display: flex;
  margin-top: 12px;
  margin-left: 15px;
}
.size-icon {
  font-size: 20px;
  margin-top: 8px;
  margin-left: 10px;
}
.left-bottom {
  display: none;
  cursor: pointer;
}
.el-menu-item {
  min-width: 100px !important;
}

.el-menu :hover {
  background-color: rgb(2, 167, 240) !important;
}

.right {
  // height: 800px;
  cursor: pointer;
  width: 100%;
  border: 1px solid rgb(215, 215, 215);
  margin: 10px 20px 0px 20px;
}
.bread {
  height: 60px;

  display: flex;
}

.breadSelect {
  background-color: #f3f6f9;
}
.icondelete {
  font-size: 25px;
  margin-right: 10px;
}
.icon1 {
  font-size: 25px;
  margin-top: 12px;
  margin-left: 20px;
}
.icon2 {
  font-size: 25px;
  margin-top: 12px;
  margin-left: 20px;
}
.left-bottom :hover {
  background-color: rgb(2, 167, 240) !important;
}
.activeColor {
  background: #f3f6f9 !important;
  border: 1px solid #f3f6f9 !important;
  color: #2273ce !important;
}
#bread-item1 {
  border: 1px solid #f3f6f9;
  width: 150px;
  height: 50px;
  margin-left: 10px;
  background-color: #fff;
  display: flex;
  align-items: center;
}
#bread-item2 {
  border: 1px solid #f3f6f9;
  width: 150px;
  height: 50px;
  margin-left: 10px;
  display: flex;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
}
#bread-item3 {
  border: 1px solid #f3f6f9;
  width: 150px;
  height: 50px;
  margin-left: 10px;
  display: flex;
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
}
</style>