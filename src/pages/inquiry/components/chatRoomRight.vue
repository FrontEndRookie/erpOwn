<template>
    <div class="boxRight">
        <div class="rightTitle">
          <!-- <div
            @click="checkRightActive(1)"
            :class="boxRightActive == 1 ? 'rightTitleActive' : ''"
          >
            运价查询
          </div> -->
          <div
            @click="checkRightActive(2)"
            :class="boxRightActive == 2 ? 'rightTitleActive' : ''"
          >
            快捷信息
          </div>
        </div>
        <div v-if="boxRightActive == 1">
          <div class="rightContent" style="margin-top: 20px">
            <el-button type="primary" size="mini">起运港</el-button>
            <el-select
              v-model="pol"
              id="pol"
              size="small"
              placeholder="起运港三字码"
              :remote-method="polMethod"
              clearable
              filterable
              maxlength="15"
              remote
              reserve-keyword
              style="max-width: 70%"
            >
              <el-option
                v-for="(item, index) in polOpt"
                :disabled="pod == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="rightContent">
            <el-button type="primary" size="mini">目的港</el-button>
            <el-select
              v-model="pod"
              size="small"
              id="pod"
              placeholder="目的港三字码"
              :remote-method="podMethod"
              maxlength="15"
              clearable
              filterable
              remote
              reserve-keyword
              style="max-width: 70%"
            >
              <el-option
                v-for="item in podOpt"
                :disabled="pol == item.threeLetterCode"
                :key="item.threeLetterCode"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </div>
          <div style="text-align: right">
            <el-button
              @click="frightSearch"
              style="
                background-color: #ff7700;
                color: #fff;
                margin-top: 12px;
                margin-right: 5px;
              "
              size="mini"
              >运价查询</el-button
            >
          </div>
        </div>
        <div v-if="boxRightActive == 2" style="padding: 10px 8px 0">
          <el-dialog :visible.sync="quickAdd">
            <el-input
              style="margin-top: 5px"
              type="textarea"
              :rows="2"
              maxlength="300"
              placeholder="请输入内容"
              v-model="quickLanguageWord"
            >
            </el-input>
            <div
              style="
                display: flex;
                justify-content: space-around;
                margin-top: 6px;
                padding-bottom: 5px;
              "
            >
              <el-button
                size="mini"
                type="info"
                @click="
                  quickAdd = false;
                  quickLanguageWord = '';
                "
                >取消</el-button
              >
              <el-button size="mini" type="primary" @click="addQuickMessage"
                >确定</el-button
              >
            </div>
          </el-dialog>
          <div
            @click="
              quickLanguageWord = '';
              quickAdd = true;
            "
            style="
              cursor:pointer;
              text-align: right;
              color: #ff7700;
              font-size: 15px;
              margin-bottom: 10px;
            "
          >
            <i
              class="el-icon-circle-plus-outline"
              style="color: #ff7700; font-size: 15px"
            ></i>
            添加
          </div>
          <div style="max-height:70vh;overflow-y:auto">
            <el-table :data="quickLanguage" border :show-header="false">
              <el-table-column type="index" width="40"></el-table-column>
              <el-table-column>
                <template slot-scope="{ row }">
                  <div
                    :title="row.quickMes"
                    style="
                    text-align: center;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  "
                  >
                    {{ row.quickMes }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="{ row }">
                  <span
                    style="cursor: pointer; text-align: center"
                    @click="deleteQuick(row.id)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-pagination
            style="text-align: center"
            @current-change="handleCurrentChange"
            :current-page="qPageNum"
            :page-size="qPageSize"
            pager-count="5"
            layout="total, prev, pager, next"
            :total="qTotal"
          >
          </el-pagination>
        </div>
      </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
 export default{
  created(){
    this.getQuickMessage();
    // this.initAirportSearchByPage();
  },
  data(){
    return {
      //起运港目的港
      podOpt: "",
      polOpt: "",
      pod: "",
      pol: "",
          //快捷语句
      qPageSize: 30,
      qPageNum: 1,
      qTotal: "",
      quickAdd: false,
      quickLanguageWord: "",
      quickLanguage: [],
      boxRightActive: 2, //聊天室右边运价查询快捷信息切换
    }
  },
  computed:{
    targetQuickData(){
      return this.quickLanguage.slice((this.qPageNum-1)*30,30*this.qPageNum)
    }
  },
  methods:{
    ...mapMutations('chatRoom',['setQuickAllMessage']),
      //聊天室右边运价查询快捷信息切换
    checkRightActive(idx) {
      this.boxRightActive = idx;
    },
    //聊天室右侧运价查询 起始港目的港数据
    polMethod(keyWord) {
      this.initAirportSearchByPage(keyWord, "起始港");
    },
    podMethod(keyWord) {
      this.initAirportSearchByPage(keyWord, "目的港");
    },
    //起始港三字码
    initAirportSearchByPage(keyWord, type) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          if (data.code == 200) {
            if (type == "起始港") {
              this.polOpt = data.data.records;
            } else if (type == "目的港") {
              this.podOpt = data.data.records;
            } else {
              this.polOpt = data.data.records;
              this.podOpt = data.data.records;
            }
          }
        });
    },
      //快捷信息分页
    handleSizeChange(val) {
      this.qPageNum = 1;
      this.qPageSize = val;
      this.getQuickMessage();
    },
    handleCurrentChange(val) {
      this.qPageNum = val;
      this.getQuickMessage();
    },
       //聊天室右 快捷信息
    getQuickMessage() {
      this.$http
        .post(this.$service.quickMessageSearch, {
          pageSize: 1000,
          pageNum: 1
        })
        .then(res => {
          if (res.code == 200) {
            this.quickLanguage = res.data.records;
            this.qTotal = res.data.total;
            this.setQuickAllMessage(this.quickLanguage)
          }
        });
    },
   
      //添加快捷信息
    addQuickMessage() {
      this.$http
        .post(
          this.$service.addQuickMes +
            `${this.quickLanguageWord.replace(/\+/g, "%2B")}`
        )
        .then(res => {
          if (res.code == 200) {
            this.$message.success("添加成功");
            this.quickAdd = false;
            this.quickLanguageWord = "";
            this.getQuickMessage();
          }
        });
    },
      //删除快捷信息
    deleteQuick(id) {
      this.$http.post(this.$service.deleteQuickMes + id).then(res => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getQuickMessage();
        }
      });
    },
      //聊天室右侧运价查询跳转
    frightSearch() {
      if (!this.pod) {
        return this.$message.warning("请选择目的港后查询");
      }
      window.open(
        `https://www.feeair.com/rates.html?pol=${this.pol}&pod=${this.pod}`
      );
    },
  },
  watch:{
    // qTotal(nv, ov) {
    //   if (nv) {
    //     this.getAllQuickMessage(nv);
    //   }
    // },
  },
 }
</script>

<style scoped lang="less">
  .boxRight {
      width: 16%;
      background-color: #fefefe;
      .rightTitle {
        border-right: 1px solid #f5f8fb;
        div {
          display: inline-block;
          padding: 12px 15px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .rightTitleActive {
        color: #1e74cf;
        position: relative;
        &::after {
          content: "";
          color: #1e74cf;
          width: 66px;
          position: absolute;
          border-bottom: 3px solid #1e74cf;
          bottom: 0;
          left: 12px;
        }
      }
      .rightContent {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 6px;
      }
    }
</style>