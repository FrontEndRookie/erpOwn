<template>
  <div class="content-wrapper">
    <div class="content">
      <el-form :label-position="labelPosition" label-width="80px" size="medium" class="demo-form-inline">
        <div class="banner-list" v-for="(item,index) in bannerArr" :key="index">
          <el-form-item label="轮播名称">
            <el-input :value="'广告轮播'+(index+1)" style="width: 85%;" clearable placeholder="请输入链接地址"
              :maxlength="inputMax" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item @click="aaa(index)" class="up-input" label="图片">
            <div @click="getImageTypeIndex(index)">
              <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload" action="#"
                :limit="1">
                <img v-if="item.bannerPath" :src="imgUrl+item.bannerPath" style="width: 100%;height: 100%;">
                <i v-else class="el-icon-plus avatar-uploader-icon "></i>
              </el-upload>
              <div style="font-size: 14px;color: #999;">建议尺寸1920*380</div>
            </div>
          </el-form-item>
          <el-form-item label="链接地址" style="padding-top: 20px;">
            <el-input v-model="item.bannerUrl" style="width: 85%;" clearable placeholder="请输入链接地址"
              :maxlength="inputMax"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="item.status" active-text="禁用" active-color="#C0CCDA" inactive-color="#409EFF"
              inactive-text="启用" :disabled="$utils.authCheckDisabled(['601001_B'])"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div class="baocun">
        <div style="text-align: center;padding-top:20px;">
          <el-button size="medium" type="primary"
            @click="dialogComfirm">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        labelPosition: 'right',
        file: '',
        index: '',
        bannerArr: [],
        loading: false
      }
    },
    created() {
      this.initBannerList()
    },
    methods: {
      //图片上传
      beforeAvatarUpload(file) {
        const isJPG = file.type;
        const isLt300K = 300;
        if (file.size > (isLt300K * 1024)) {
          this.$message.error('图片文件大小不能大于300KB!');
          return
        }
        if (isJPG == 'image/jpeg' || isJPG == 'image/png') {
          this.$message.success('上传图片成功');
        } else {
          this.$message.error('上传图片只能是 JPG 格式或 PNG 格式!');
          return
        }
        this.file = file;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let that = this;
        reader.onload = function() {
          that.upLoadpdf()
        };
      },
      upLoadpdf() {
        const vm = this
        let fileFormData = new FormData();
        fileFormData.append('image', vm.file)
        vm.$http.post(vm.$service.uploadBannerImage, fileFormData).then(res => {
          if (res.code == 200) {
            this.bannerArr[this.index].bannerPath = res.data
          }
        })
      },
      getImageTypeIndex(index) {
        this.index = index
      },
      //保存
      dialogComfirm(ruleForm) {
        // this.loading = true
        var newBanner = JSON.parse(JSON.stringify(this.bannerArr))
        for (var i = 0; i < newBanner.length; i++) {
          if (!newBanner[i].bannerPath) {
            this.$message.error('您还有banner没有配置')
            return
          }
          newBanner[i].status = newBanner[i].status ? 0 : 1
          if (!newBanner[i].sort) {
            newBanner[i].sort = i + 1
          }
        }
        this.$http.post(this.$service.changeBanner, newBanner).then(data => {
          if (data.code == 200) {
            // this.loading = false
            this.$message.success('保存成功')
            // this.initBannerList()
            // this.$http.get(this.$service.dcReptileReplace).then((data) => {
            //   console.log(data)
            // })
          } else {
            this.$message.error(data.message)
          }
        })
      },
      //展示
      initBannerList() {
        this.$http.get(this.$service.manageBannerList).then(data => {
          if (data.code == 200) {
            var leg = 5 - data.data.length
            this.bannerArr = data.data
            for (var q = 0; q < this.bannerArr.length; q++) {
              if (this.bannerArr[q].status == '1') {
                this.bannerArr[q].status = false
              } else {
                this.bannerArr[q].status = true
              }
            }
            for (var i = 0; i < leg; i++) {
              var json = {
                bannerImgName: '',
                bannerPath: '',
                bannerUrl: '',
                status: false,
                id: '',
                sort: ''
              }
              this.bannerArr.push(json)
            }
            this.loading = false
          } else {
            this.$message.error(data.message)
          }
        }).catch((e) => {
          console.log(e)
        })
      },

    }
  }
</script>

<style scoped lang="less">
  @import url("../../assets/icon/iconfont.css");

  .content-wrapper {
    width: 100%;
    box-sizing: border-box;
    /*height: 100%;*/
    padding: 20px;
    overflow: hidden;
    background-color: #f3f6f9 !important;
  }

  .content {
    background-color: #FFF;
    padding: 20px;
    box-sizing: border-box;
  }

  .demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    width: 100%;
  }

  .banner-list {
    flex: 0 0 32%;
    border: 1px solid #E5E5E5;
    margin-right: 2%;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 20px;

    /deep/ .up-input {
      .el-form-item__content {
        height: 150px;

        .el-upload--text {
          height: 150px;
          width: 150px;
          line-height: 150px;
          border-radius: 5px;

          .el-icon-plus {
            font-size: 28px;
            color: #8c939d;
          }
        }
      }
    }
  }

  .banner-list:nth-of-type(3n) {
    margin-right: 0;
  }

  .avatar-uploader {
    height: 150px;
    width: 150px;
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 5px;
  }
</style>
