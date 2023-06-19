<template>
  <div>
    <!-- 面包屑导航 展开的tabs-->
    <div class="menu-list">
      <ul class="ul-list">
        <li
          :class="{ active: isUrl == item.path }"
          @click.prevent="handleLink(item, index)"
          v-for="(item, index) in urlArr"
          :key="item.path"
        >
          {{ item.meta.title }}
          <img
            v-if="item.path != '/adminUser/homePage'"
            @click.stop="guanbiClick({ item, index })"
            src="../../assets/close.png"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import pathToRegexp from "path-to-regexp";
// import crumbConfig from '@/router/crumbConfig'
export default {
  data() {
    return {
      levelList: null,
      tabList: null,
      urlIndex: 0,
      urlArr: [
        // {
        //   path: "/adminUser/homePage",
        //   name: "homePage",
        //   meta: {title: "首页"}
        // }
      ],
      urlArrName: [],
      isUrl: "",
      isClick: 0
    };
  },
  computed: {
    payExceptNum() {
      return this.$store.getters.getPayExceptNum || 0;
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
    this.$bus &&
      this.$bus.$on(
        "close-current-page",
        ({ isGoBack, callback, noHistoryCallback } = {}) => {
          const path = this.$route.path;
          const item = this.urlArr.find(item => item.path === path);
          console.log(item);
          if (item) {
            this.guanbiClick({ item, isGoBack, callback, noHistoryCallback });
          }
        }
      );
  },
  methods: {
    guanbiClick({
      item,
      index,
      isGoBack = true,
      callback = () => {},
      noHistoryCallback = () => {}
    } = {}) {
      if (this.$route.path == "/routeManagement/routeAdd") {
        sessionStorage.setItem("routeAdd", "hide");
      }
      if (item.path == this.isUrl && item.path != "/adminUser/homePage") {
        this.urlArr.splice(this.urlArr.indexOf(item), 1);
        this.urlArrName.splice(this.urlArrName.indexOf(item.name), 1);
        this.isUrl = "/adminUser/homePage";
        // this.handleLink(this.urlArr[index])
        // this.handleLink(this.urlArr[index-1])
        if (this.urlArr.length > 0) {
          if (isGoBack) {
            this.$router.go(-1);
          }
          callback();
        } else {
          noHistoryCallback();
        }
      } else if (item.path != "/adminUser/homePage") {
        this.urlArr.splice(this.urlArr.indexOf(item), 1);
        this.urlArrName.splice(this.urlArrName.indexOf(item.name), 1);
      }
      var arr = this.$router.options.routes;
    },
    getBreadcrumb() {
      var _this = this;
      let matched = this.$route.matched.filter(item => item.name);
      // 增加返回上一页
      // const last = matched[matched.length - 1]
      // let lastNames = []
      // if (lastNames.indexOf(last.name) !==-1) {
      //   matched.splice(1, 0, {
      //     path: last.name,
      //     meta: { title: "返回上一级" }
      //   })
      // }
      this.levelList = matched.filter(
        // item => item.meta && item.meta.title && item.meta.breadcrumb !== false
        //过滤出 子菜单，只有子菜单展示在面包屑中
        item => item.path.split("/").length == 3
      );
      this.isUrl = this.levelList[0].path; //当前点击的子菜单
      if (this.urlArrName.indexOf(this.levelList[0].name) == -1) {
        var pathUrl = this.$route.path;

        for (var i = 0; i < this.levelList.length; i++) {
          var json = {};
          json.meta = this.levelList[i].meta;
          json.path = this.levelList[i].path;
          json.name = this.levelList[i].name;
          json.query = this.$route.query;
          this.urlArrName.push(this.levelList[i].name);
          this.urlArr.push(json);
        }
      } else {
        var reQuery = this.$route.query;
        this.urlArr[
          this.urlArrName.indexOf(this.levelList[0].name)
        ].query = reQuery;
      }
    },
    pathCompile(path) {
      const { params } = this.$route;
      var pathUrl = this.$route.path;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item, index) {
      if (!item) {
        return;
      }
      this.isClick = index;
      //console.log(item)
      var query = item.query;
      var canshu = "";
      for (var key in query) {
        canshu += key + "=" + query[key] + "&";
      }
      const { path } = item;
      if (path == this.$route.path) {
        return;
      }
      this.$router.push(item);
    },
    handleLinkBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
.app-breadcrumb.el-breadcrumb {
  height: 55px;
  line-height: 55px;
  padding-top: 15px;
  background-color: #fff;
  font-size: 14px;
  padding-left: 50px;
  color: #333333;
  box-shadow: 0px 0px 10px 0px rgba(0, 103, 243, 0.06);
  border-radius: 6px;
  .no-redirect {
    cursor: text;
  }
  .el-breadcrumb__item {
    position: relative;
    i {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      border-bottom: 3px solid #2273ce;
    }
    .back {
      color: #2273ce;
      font-weight: normal;
    }
  }
}
.title {
  background: #fff;
  &::after {
    display: block;
    content: "";
    height: 0;
    line-height: 0;
    visibility: hidden;
    clear: both;
  }
  .title-txt {
    position: relative;
    float: left;
    padding-top: 35px;
    margin-left: 50px;
    height: 35px;
    cursor: pointer;
    &.active {
      color: #3985ca;
      i {
        left: 0;
        border-bottom: 3px solid #3985ca;
      }
    }
    span {
      padding-top: 40px;
      font-size: 14px;
    }
    i {
      position: absolute;
      width: 100%;
      bottom: 0;
    }
    /deep/ .el-badge__content.is-fixed {
      right: 0;
    }
  }
  .el-button {
    float: right;
  }
}

.menu-list {
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  font-size: 14px;
  color: #333333;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 103, 243, 0.06);
  box-shadow: 0px 0px 10px 0px rgba(0, 103, 243, 0.06);
}
.ul-list {
  display: -webkit-box;
  overflow-x: auto;
  width: 100%;
}
.ul-list li {
  // float: left;
  cursor: pointer;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  padding: 0 20px;
}
.ul-list li img {
  font-size: 15px;
  width: 12px;
  height: 12px;
  margin-left: 10px;
}
.ul-list li.active {
  background-color: #f3f6f9 !important;
  color: #2273ce;
}
</style>
