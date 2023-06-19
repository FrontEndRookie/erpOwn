<template>
  <el-upload
    class="avatar-uploader"
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :on-change="fileUpload"
    :accept="computedAccept"
  >
    <img v-if="showResult('image')" :src="getPath || defaultUrl" class="avatar" />
    <video
      v-if="showResult('video')"
      :src="getPath || defaultUrl"
      class="avatar video-avatar"
      controls="controls"
    >
      您的浏览器不支持视频播放
    </video>
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: "VideoUpload",
  props: {
    type: {
      type: String,
      default: "image"
    },
    defaultUrl:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      getPath: ""
    };
  },
  computed:{
    computedAccept(){
      if(this.type == 'image'){
        return '.bmp,.jpg,.png,.tif,.gif,.svg,.webp'
      }
      else {
        return '.mp4,.wav'
      }
    }
  },
  methods: {
    showResult(type){
      if(type==this.type){
        if(this.defaultUrl) return true
        else {
          return this.type == type && this.getPath
        }
      }
      return false
    },
    async fileUpload(file) {
      const fileFormData = new FormData();
      fileFormData.append("video", file.raw);
      const {
        data: { code, message }
      } = (this.type=='image'?await this.$api.cmsUploadImg(fileFormData): await this.$api.cmsVideo(fileFormData));
      if (code == 200) {
        this.getPath = message;
        this.$emit('uploadSuccess',message)
      } else {
        this.$message.error('上传出错')
      }
    }
  }
};
</script>

<style lang="less" scoped>
.avatar {
  width: 150px;
  height: 150px;
}
</style>
