<template>
  <div class="page">
    <el-tabs v-model="tabAct" type="card" @tab-click="handleClick">
      <el-tab-pane label="起始港分区" name="pol">
        <el-form class="pageSearch" :inline="true" size="small">
          <el-form-item label="起运口岸">
            <el-select
              v-model="polSearch.pol"
              placeholder="请选择起运港"
              :remote-method="getPodList"
              id="podSearch"
              filterable
              clearable
              remote
              reserve-keyword
            >
              <el-option
                v-for="(item, index) in podOpt"
                :key="index"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分区">
            <el-select
              v-model="polSearch.area"
              placeholder="请选择起运区域"
              clearable
              remote
              reserve-keyword
              style="width: 170px"
            >
              <el-option
                v-for="item in polArea"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="起运名称">
            <el-input
              v-model="polSearch.polName"
              placeholder="请输入起运名称"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="
                pageNum = 1;
                searchResult();
              "
              icon="el-icon-search"
              >搜索</el-button
            >
            <el-button
              type="primary"
              @click="importDial = true"
              icon="el-icon-download"
              >导入</el-button
            >
            <el-button type="primary" @click="newPol">新建</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="目的港分区" name="pod">
        <el-form class="pageSearch" :inline="true" size="small">
          <el-form-item label="目的港">
            <el-select
              v-model="podSearch.pod"
              placeholder="请选择目的港"
              :remote-method="getPodList"
              id="podSearch"
              filterable
              clearable
              remote
              reserve-keyword
            >
              <el-option
                v-for="(item, index) in podOpt"
                :key="index"
                :value="item.threeLetterCode"
              >
                <span>{{ item.threeLetterCode }}</span>
                <span style="margin-left: 5px">{{ item.name }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="州">
            <el-select v-model="podSearch.continent" placeholder="请选择州">
              <el-option
                v-for="(item, index) in continentList"
                :key="index"
                :value="item.label"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机场名称">
            <el-input
              v-model="podSearch.name"
              placeholder="请输入机场名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="国家名称">
            <el-input
              v-model="podSearch.country"
              placeholder="请输入国家名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="城市名称">
            <el-input
              v-model="podSearch.city"
              placeholder="请输入城市名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="
                pageNum = 1;
                searchResult();
              "
              icon="el-icon-search"
              >搜索</el-button
            >
            <el-button
              type="primary"
              @click="importDial = true"
              icon="el-icon-download"
              >导入</el-button
            >
            <el-button type="primary" @click="newPod">新建</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-table
      ref="table"
      row-key="id"
      :data="vocationTable"
      max-height="500"
      style="width: 98%;margin:auto"
    >
      <el-table-column
        v-if="tabAct == 'pol'"
        v-for="(item, index) in polColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :fixed="item.prop == 'operate' ? 'right' : false"
      >
        <template slot-scope="scope">
          <div v-if="item.prop == 'operate'">
            <el-button type="primary" size="mini" @click="editPol(scope.row)"
              >编辑</el-button
            >
            <el-button type="info" size="mini" @click="deletePol(scope.row)"
              >删除</el-button
            >
          </div>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tabAct == 'pod'"
        v-for="(item, index) in podColumn"
        :key="index"
        :prop="item.prop"
        :label="item.label"
      >
        <template slot-scope="scope">
          <div v-if="item.prop == 'operate'">
            <el-button type="primary" size="mini" @click="editPod(scope.row)"
              >编辑</el-button
            >
            <el-button type="info" size="mini" @click="deletePod(scope.row)"
              >删除</el-button
            >
          </div>
          <div v-else>
            {{ scope.row[item.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :title="`${tabAct == 'pol' ? '起运港' : '目的港'}分区操作`"
      :visible.sync="dialogVisible"
      width="fit-content"
    >
      <el-form
        :model="polOperate"
        ref="operateForm"
        :rules="rules"
        v-if="tabAct == 'pol'"
      >
        <el-form-item
          v-for="(item, index) in polColumn"
          v-if="item.prop != 'operate'"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          label-width="130px"
          required
        >
          <el-select
            v-if="item.prop == 'area'"
            v-model="polOperate.area"
            placeholder="请选择起运区域"
            clearable
            remote
            reserve-keyword
            style="width: 200px"
          >
            <el-option
              v-for="item in polArea"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-else-if="item.prop == 'pol'"
            v-model="polOperate.pol"
            placeholder="请选择起运港"
            :remote-method="getPodList"
            id="podSearch"
            filterable
            clearable
            remote
            reserve-keyword
            style="width: 200px"
          >
            <el-option
              v-for="(item, index) in podOpt"
              :key="index"
              :value="item.threeLetterCode"
            >
              <span>{{ item.threeLetterCode }}</span>
              <span style="margin-left: 5px">{{ item.name }}</span>
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="polOperate[item.prop]"
            :placeholder="'请输入' + item.label"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center;padding:15px 0">
            <el-button type="info" @click="dialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="confirmOperate"
              >确认{{ polOpeate == "create" ? "新增" : "编辑" }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <el-form
        :model="podOperate"
        ref="operatePodForm"
        :rules="podRules"
        v-if="tabAct == 'pod'"
      >
        <el-form-item
          v-for="(item, index) in podColumn"
          v-if="item.prop != 'operate'"
          :prop="item.prop"
          :label="item.label"
          :key="index"
          label-width="130px"
          required
        >
          <el-select
            v-if="item.prop == 'threeLetterCode'"
            v-model="podOperate.threeLetterCode"
            placeholder="请选择目的港"
            :remote-method="getPodList"
            filterable
            clearable
            remote
            reserve-keyword
          >
            <el-option
              v-for="(item, index) in podOpt"
              :key="index"
              :value="item.threeLetterCode"
            >
              <span>{{ item.threeLetterCode }}</span>
              <span style="margin-left: 5px">{{ item.name }}</span>
            </el-option>
          </el-select>
          <el-select
            v-else-if="item.prop == 'continent'"
            v-model="podOperate.continent"
            placeholder="请选择州"
          >
            <el-option
              v-for="(item, index) in continentList"
              :key="index"
              :value="item.label"
              :label="item.label"
            ></el-option>
          </el-select>
          <el-input
            v-else
            v-model="podOperate[item.prop]"
            :placeholder="'请输入' + item.label"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="text-align:center;padding:15px 0">
            <el-button type="info" @click="dialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="confirmPodOperate"
              >确认{{ podOpeate == "create" ? "新增" : "编辑" }}</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 导入弹框 -->
    <el-dialog class="importDial" :visible.sync="importDial" width=" 450px">
      <span>
        <i class="el-icon-warning" style="color:#f4ea2a"></i>
        导入将使所有已有数据更新为导入的数据，请谨慎处理
      </span>
      <div class="importDialBox">
        <div>请下载导入模板,按格式输入后导入</div>
        <div class="downloadTemplate" @click="downLoadModel">下载模板</div>
      </div>
      <div class="importDialBoxs">
        <div>
          仅支持xls、xlsx格式文件
        </div>
        <span class="importFileButton" @click="importFile">
          上传文件
        </span>
      </div>
      <!-- <div class="importDialBoxss">
        <div>
          1)<span class="deepenWord">目的港请英文大写</span>
          ；如有一个目的港为多个人负责,请 分成多列填写
        </div>
        <div>
          2)<span class="deepenWord">航线负责人姓名</span>请填写为当前后台姓名
        </div>
        <div>
          3)<span class="deepenWord">航线负责人账号</span
          >请填写与姓名对应的后台账号
        </div>
        <div>4)请勿在模板行与列之间留下空格</div>
        <div>5)一条数据校验报错,全部数据导入不成功</div>
      </div> -->
      <div class="importDialFoot">
        <el-button type="info" size="mini" @click="importDial = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          style="margin-left:40px"
          @click="importFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {
      importDial: false,
      tabAct: "pol",
      polOpeate: "create",
      podOpeate: "create",
      polArea: [
        {
          //起运区域
          label: "华东",
          value: "华东"
        },
        {
          label: "华南",
          value: "华南"
        },
        {
          label: "华中/华北",
          value: "华中华北"
        }
      ],
      polSearch: {
        pol: "",
        area: "",
        polName: ""
      },
      podSearch: {
        threeLetterCode: "",
        continent: "",
        name: "",
        country: "",
        city: ""
      },
      dialogVisible: false,
      rules: {
        area: [
          { required: true, message: "请输入分区", trigger: ["blur", "change"] }
        ],
        pol: [
          {
            required: true,
            message: "请输入起运口岸",
            trigger: ["blur", "change"]
          }
        ],
        polName: [
          {
            required: true,
            message: "请输入起运名称",
            trigger: ["blur", "change"]
          }
        ],
        northAmerica: [
          { required: true, message: "请输入北美", trigger: ["blur", "change"] }
        ],
        middleAmerica: [
          { required: true, message: "请输入中美", trigger: ["blur", "change"] }
        ],
        southAmerica: [
          { required: true, message: "请输入南美", trigger: ["blur", "change"] }
        ],
        australiaAndNewZealand: [
          { required: true, message: "请输入澳新", trigger: ["blur", "change"] }
        ],
        southeastAsia: [
          {
            required: true,
            message: "请输入东南亚",
            trigger: ["blur", "change"]
          }
        ],
        asia: [
          { required: true, message: "请输入亚洲", trigger: ["blur", "change"] }
        ],
        europe: [
          { required: true, message: "请输入欧洲", trigger: ["blur", "change"] }
        ],
        africa: [
          { required: true, message: "请输入非洲", trigger: ["blur", "change"] }
        ],
        middleEast: [
          { required: true, message: "请输入中东", trigger: ["blur", "change"] }
        ],
        asiaIndiaAndAkistan: [
          {
            required: true,
            message: "请输入亚洲（印巴）",
            trigger: ["blur", "change"]
          }
        ],
        asiaChina: [
          {
            required: true,
            message: "请输入亚州（中亚五国）",
            trigger: ["blur", "change"]
          }
        ],
        asiaImport: [
          {
            required: true,
            message: "请输入亚洲（进口）",
            trigger: ["blur", "change"]
          }
        ],
        dangerousExport: [
          {
            required: true,
            message: "请输入危险品出口",
            trigger: ["blur", "change"]
          }
        ]
      },
      polColumn: [
        { prop: "area", label: "分区", width: 110 },
        { prop: "pol", label: "起运口岸", width: 130 },
        { prop: "polName", label: "起运名称", width: 130 },
        { prop: "northAmerica", label: "北美", width: 110 },
        { prop: "middleAmerica", label: "中美", width: 110 },
        { prop: "southAmerica", label: "南美", width: 110 },
        { prop: "australiaAndNewZealand", label: "澳新", width: 110 },
        { prop: "southeastAsia", label: "东南亚", width: 110 },
        { prop: "asia", label: "亚洲", width: 110 },
        { prop: "europe", label: "欧洲", width: 110 },
        { prop: "africa", label: "非洲", width: 110 },
        { prop: "middleEast", label: "中东", width: 110 },
        { prop: "asiaIndiaAndAkistan", label: "亚洲（印巴）", width: 150 },
        { prop: "asiaChina", label: "亚洲（中亚五国）", width: 150 },
        { prop: "asiaImport", label: "亚洲（进口）", width: 150 },
        { prop: "dangerousExport", label: "危险品出口", width: 150 },
        { prop: "operate", label: "操作", width: 200 }
      ],
      podColumn: [
        { prop: "threeLetterCode", label: "三字码" },
        { prop: "city", label: "城市" },
        { prop: "continent", label: "州" },
        { prop: "country", label: "国家" },
        { prop: "name", label: "机场中文名称" },
        { prop: "operate", label: "操作" }
      ],
      podRules: {
        city: [
          { required: true, message: "请输入城市", trigger: ["blur", "change"] }
        ],
        continent: [
          { required: true, message: "请输入州", trigger: ["blur", "change"] }
        ],
        country: [
          { required: true, message: "请输入国家", trigger: ["blur", "change"] }
        ],
        name: [
          {
            required: true,
            message: "请输入机场中文名称",
            trigger: ["blur", "change"]
          }
        ],
        threeLetterCode: [
          {
            required: true,
            message: "请输入三字码",
            trigger: ["blur", "change"]
          }
        ]
      },
      polOpt: [],
      podOpt: [],
      polOperate: {
        area: "",
        pol: "",
        polName: "",
        northAmerica: "",
        middleAmerica: "",
        southAmerica: "",
        australiaAndNewZealand: "",
        southeastAsia: "",
        asia: "",
        europe: "",
        africa: "",
        middleEast: "",
        asiaIndiaAndAkistan: "",
        asiaChina: "",
        asiaImport: "",
        dangerousExport: "",
        id: ""
      },
      podOperate: {
        city: "",
        continent: "",
        country: "",
        name: "",
        threeLetterCode: "",
        id: ""
      },
      continentList: [
        { label: "澳新" },
        { label: "北美" },
        { label: "东南亚" },
        { label: "非洲" },
        { label: "南美" },
        { label: "欧洲" },
        { label: "亚洲（中亚五国）" },
        { label: "亚洲（进口）" },
        { label: "亚洲（印巴）" },
        { label: "中东" },
        { label: "中美" }
      ],
      //分页
      pageNum: 1,
      pageSize: 10,
      total: 0,
      //表格数据
      vocationTable: []
    };
  },
  created() {
    this.searchResult();
    this.getPodList();
  },
  mounted() {
    window.addEventListener("beforeunload", this.dealUnload);
  },
  methods: {
    downLoadModel() {
      this.$utils.downloadFile({
        url: `/image/template/airlineRule.xlsx`,
        name: "航线分配规则-模板.xlsx",
        sameOrigin: false
      });
    },
    handleClick(tab, event) {
      this.pageNum = 1;
      this.pageSize = 10;
      this.searchResult();
    },
    async newPol() {
      this.polOpeate = "create";
      this.polOperate = {
        area: "",
        pol: "",
        polName: "",
        northAmerica: "",
        middleAmerica: "",
        southAmerica: "",
        australiaAndNewZealand: "",
        southeastAsia: "",
        asia: "",
        europe: "",
        africa: "",
        middleEast: "",
        asiaIndiaAndAkistan: "",
        asiaChina: "",
        asiaImport: "",
        dangerousExport: "",
        id: ""
      };
      this.dialogVisible = true;
      await this.$nextTick();
      this.$refs.operateForm.resetFields();
    },
    async newPod() {
      this.podOpeate = "create";
      this.podOperate = {
        city: "",
        continent: "",
        country: "",
        name: "",
        threeLetterCode: "",
        id: ""
      };
      this.dialogVisible = true;
      await this.$nextTick();
      this.$refs.operatePodForm.resetFields();
    },
    confirmOperate() {
      this.$refs["operateForm"].validate(valid => {
        if (valid) {
          if (this.polOpeate == "create") {
            this.$http
              .post(this.$service.polSave, this.polOperate)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("新建成功");
                  this.searchResult();
                }
              });
          } else {
            this.$http
              .put(this.$service.polUpdate, this.polOperate)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("编辑成功");
                  this.searchResult();
                }
              });
          }
          this.dialogVisible = false;
        } else {
          this.$message.warning("请输入全部信息");
        }
      });
    },
    confirmPodOperate() {
      this.$refs["operatePodForm"].validate(valid => {
        if (valid) {
          if (this.podOpeate == "create") {
            this.$http
              .post(this.$service.podSave, this.podOperate)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("新建成功");
                  this.searchResult();
                }
              });
          } else {
            this.$http
              .put(this.$service.podUpdate, this.podOperate)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("编辑成功");
                  this.searchResult();
                }
              });
          }
          this.dialogVisible = false;
        } else {
          this.$message.warning("请输入全部信息");
        }
      });
    },
    deletePol(item) {
      console.log(item);
      this.$confirm("确认删除此条数据?")
        .then(_ => {
          this.$http.post(this.$service.polDelete, [item.id]).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.searchResult();
            }
          });
        })
        .catch(_ => {});
    },
    editPol(item) {
      this.polOpeate = "edit";
      this.polOperate = { ...item };
      this.dialogVisible = true;
    },
    deletePod(item) {
      console.log(item);
      this.$confirm("确认删除此条数据?")
        .then(_ => {
          this.$http.post(this.$service.podDelete, [item.id]).then(res => {
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.searchResult();
            }
          });
        })
        .catch(_ => {});
    },
    editPod(item) {
      this.podOpeate = "edit";
      this.podOperate = { ...item };
      this.dialogVisible = true;
    },
    //目的港数据
    getPodList(keyWord) {
      if (!keyWord) {
        keyWord = "";
      }
      this.$http
        .get(this.$service.airportSearchByPage + "?keyWord=" + keyWord)
        .then(data => {
          this.loading = false;
          if (data.code == 200) {
            this.podOpt = data.data.records;
          } else {
            this.$message.error(data.message);
          }
        });
    },

    dealUnload() {
      sessionStorage.setItem("podSetPage", true);
    },
    //表格数据
    searchResult() {
      if (this.tabAct == "pol") {
        this.$http
          .post(this.$service.polPage, {
            ...this.polSearch,
            ...{ pageSize: this.pageSize, pageNum: this.pageNum }
          })
          .then(res => {
            if (res.code == 200) {
              this.vocationTable = res.data.records;
              if (this.pageNum != 1 && res.data.records.length == 0) {
                this.pageNum--;
                this.searchResult();
              }
              this.total = res.data.total;
            }
          });
      } else {
        this.$http
          .post(this.$service.podPage, {
            ...this.podSearch,
            ...{ pageSize: this.pageSize, pageNum: this.pageNum }
          })
          .then(res => {
            if (res.code == 200) {
              this.vocationTable = res.data.records;
              if (this.pageNum != 1 && res.data.records.length == 0) {
                this.pageNum--;
                this.searchResult();
              }
              this.total = res.data.total;
            }
          });
      }
    },

    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.searchResult(this.sortOrder);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.searchResult(this.sortOrder);
    },

    //导入文件
    async importFile() {
      const accepts = [
        ".xls",
        "application/vnd.ms-excel",
        ".xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ];
      const files = await this.$utils.loadFile({
        accept: accepts.join(",")
      });
      const fileFormData = new FormData();
      fileFormData.append("file", files[0]);
      let loadingInstance = Loading.service({
        fullscreen: true,
        text: "文件上传中"
      });
      try {
        const data = await this.$http.post(
          this.$service.importAllocationRuleExcel,
          fileFormData,
          { responseType: "arraybuffer" }
        );
        let enc = new TextDecoder("utf-8");
        let uint8_msg = new Uint8Array(data);
        let str = enc.decode(uint8_msg);
        if (str.indexOf("code") > -1) {
          let copyStr = JSON.parse(str);
          if (copyStr.code == 200) {
            this.$message.success("导入成功");
            this.importDial = false;
            this.searchResult();
          }
          setTimeout(() => {
            loadingInstance.close();
          }, 500);
        } else {
          this.$message.error("上传失败");
          this.$utils.exportBuffer({
            buffer: data,
            exportName: `目的港分配文件上传失败.xlsx`
          });
          setTimeout(() => {
            loadingInstance.close();
          }, 500);
        }
      } catch (error) {}
    }
  },

  destroyed() {
    window.removeEventListener("beforeunload", this.dealUnload);
  }
};
</script>
<style>
.is-fullscreen {
  z-index: 9999 !important;
}
</style>
<style lang="less" scoped>
.importDial {
  /deep/.el-dialog__header {
    padding-top: 35px !important;
    .el-dialog__title {
      display: none;
    }
  }
}
/deep/.el-dialog__body {
  padding-right: 50px;
}
.page {
  background-color: #fff;
  margin-top: 10px;
  min-height: 700px;
  &Search {
    padding-left: 15px;
  }
}
/deep/.el-form-item {
  margin-bottom: 22px !important;
}
/deep/.el-pagination {
  text-align: right;
  margin-top: 10px;
}
/deep/.el-dialog__header {
  padding: 0 0 0 6px !important;
  border-bottom: 0;
  .el-dialog__title {
    font-size: 18px;
  }
}
.importDial {
  /deep/.el-dialog__header {
    padding-top: 35px !important;
    .el-dialog__title {
      display: none;
    }
  }
}
/deep/.el-table {
  border-right: 1px solid silver;
  border-bottom: 1px solid silver;
  .el-table__body-wrapper {
    max-height: 500px;
    overflow-y: auto;
  }
  th {
    text-align: center;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    border-top: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
  td {
    text-align: center;
    background-color: #fff;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    &:first-child {
      border-left: 1px solid silver;
    }
  }
}
/deep/.el-button {
  font-size: 14px;
}
.dialBox {
  margin-top: 15px;
  padding: 4px 12px;
  border: 1px solid silver;
}
.importDialBox {
  .dialBox;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .downloadTemplate {
    background-color: #caf982;
    color: #666;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
  }
}
.importDialBoxs {
  .dialBox;
  padding: 20px 0;
  text-align: center;
  .importFileButton {
    padding: 3px 8px;
    display: inline-block;
    border: 1px solid #333;
    margin-top: 12px;
    cursor: pointer;
  }
}
.importDialBoxss {
  .dialBox;
  padding: 15px 10px;
  div {
    color: #aaa;
    margin-top: 8px;
    line-height: 24px;
    .deepenWord {
      color: #d9001b;
    }
  }
}
.importDialFoot {
  text-align: center;
  padding: 15px 0;
}
.el-message {
  z-index: 99999 !important;
}
</style>
