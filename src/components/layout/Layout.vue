<template>
  <div class="app-wrapper">
<!--    <div class="arrowsImg" v-if="isShow" @click="switchover">-->
<!--      <img :src="srcImg" alt="">-->
<!--    </div>-->
<div v-if="newPage()">
  <router-view v-if="!$route.meta.keepAlive" :key="$route.name" />
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
</div>
<div v-else>
   <navbar @changeNav="changeNav" :leftWidth="leftWidth"/>
    <div style="display: flex;width: 100%;height: calc(100vh - 50px)">
      <sidebar :class="['sidebar-container', leftWidth ? 'sidebar-width' : '']" :leftWidth="leftWidth"/>
      <div class="main-container">
        <crumb/>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.name" />
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
      </div>
</div>
    </div>
    <messageNotice></messageNotice>
  </div>
</template>

<script>
import Navbar from './Navbar'
import Sidebar from './Sidebar/index'
import Crumb from './Crumb'
import messageNotice from '../messageNotice.vue'
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    Crumb,
    messageNotice
  },
  data() {
    return {
      isShow: false,
      leftWidth: true,
      srcImg: require('../../assets/zankai.png')
    }
  },
  methods: {
    changeNav(data){
      this.leftWidth = data;
    },
    newPage(){
      let route = this.$route
      // console.log(route.query.ledShow)
      // console.log(route.name == 'airReception');
      if(route.query.ledShow){
        return true
      } else if(route.name=='airReception'){
        return true
      } else {
        return false
      }
    }
  },
  created(){
  }
}
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  .arrowsImg {
    position: absolute;
    left: 0;
    top: 64px;
    z-index: 10;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .sidebar-width {
    flex: 0 0 150px !important;
  }
  .sidebar-wrapper {
    /deep/
    .el-scrollbar__wrap {
      overflow-x: hidden;
      position: relative;
      .menu-expanded{
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-x: auto;
      }
    }
    flex: 0 0 60px;
    // width: 230px;
    transition: flex 1s;
    overflow: hidden;
    background: #2B333B;
    /deep/
    a {
      padding: 0;
    }
    /deep/
    .el-menu {
      border-right: none !important;
    }

    /deep/
    .el-submenu {
      .el-submenu__title {
        padding-right: 30px !important;
        padding-left: 15px !important;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        background-color: #2B333B;
        color: #FFFFFF;
        .icon {
          padding-right: 5px;
          color: #ffffff;
          vertical-align: middle;
        }
        .el-submenu__icon-arrow {
          right: 10px;
          color: #ffffff;
        }
      }
      &.is-active {

        color: #2273CE;
        .el-submenu__title {
          background-color: #2B333B !important;
          // color: #2273CE;
          .icon {
            color: #2273CE !important;
          }
          .el-submenu__icon-arrow {
            right: 10px;
            color: #2273CE;
          }
        }
      }
      .menu-wrapper {
        .el-menu-item {
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          //padding-left: 42px !important;
          background-color: #000;
          color: #FFFFFF;
          &.is-active {
            // background: #2273CE;
            background-color:#1a1e22;
            // color: #2273ce;
            //border-right: 4px solid #2273CE;
          }
        }

      }
    }

  }
  .main-container {
    // width: calc(100% - 230px);
    width: 100%;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
    // margin-left: 230px;

  }

}
</style>
