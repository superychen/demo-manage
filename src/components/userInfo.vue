<template>
  <div>
    <el-form label-width="80px" :model="user">
      <el-form-item label="用户名称">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="用户电话">
        <el-input v-model="user.telephone"></el-input>
      </el-form-item>
      <el-form-item label="用户地址">
        <el-input v-model="user.address"></el-input>
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload
          class="avatar-uploader"
          :action="doUpload"
          :headers="myHeaders"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="uploadError"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  export default {
    name: "userInfo",
    props: ['user'],
    data() {
      return {
        imageUrl: '', //element的回显的图片url
        doUpload: '/apis/management/file/upload/tumb',
        uploadUrl: '',
        myHeaders: {
          Authorization: 'Bearer ' + this.$Cookies.get('token'),
        },
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if (res.code === 200) {
          // this.imageUrl = URL.createObjectURL(file.raw);
          this.imageUrl = this.$fastdfsUrl.fastdfs + res.data;
          this.uploadUrl = res.data;
          this.$emit('changeImgUrl', res.data);
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt10M = file.size / 1024 / 1024 / 5 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$message({
            showClose: true,
            message: "上传图片必须是JPG/GIF/PNG/BMP 格式!",
            type: 'error'
          });
          return;
        }
        if (!isLt10M) {
          this.$message({
            showClose: true,
            message: "上传头像图片大小不能超过 10MB!",
            type: 'error'
          });
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
      },
      uploadError() {
        this.$getMessage('上传文件出现异常,请稍后再次尝试');
      }
    },
    mounted() {
      this.imageUrl = this.$fastdfsUrl.fastdfs + this._props.user.userImg;
    }
  }
</script>

<style scoped>
  .e-e-input > p {
    font-size: 14px;
    color: #999;
  }

  .e-e-input > .license-file {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }

  .license-file > .upload-license-icon {
    display: inline-block;
    min-width: 64px;
    padding: 10% 15%;
    border: 1px dashed #ddd;
    background-color: #f4f4f4;
    box-sizing: border-box;
  }

  .license-file > .license-tip {
    font-size: 14px;
    color: #666;
  }

  /*上传文件*/
  .avatar-uploader {
    width: 60px;
    height: 60px;
    border: 1px dashed #d9d9d9;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
</style>
