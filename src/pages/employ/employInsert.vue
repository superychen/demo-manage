<template>
  <span>
      <el-button type="primary" @click="openInsertDialog" icon="el-icon-edit" circle></el-button>
      <el-dialog title="新增员工"
                 :close-on-click-modal='false'
                 :modal-append-to-body='false'
                 :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" class="demo-ruleForm">
          <el-form-item label="员工姓名" prop="staffName" :rules="[{ required: true, message: '员工姓名不能为空'}]"
                        :label-width="formLabelWidth">
            <el-input v-model="form.staffName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="员工年龄" prop="staffAge" :rules="[{ required: true, message: '员工年龄不能为空'}]"
                        :label-width="formLabelWidth">
            <el-select v-model="form.staffAge" placeholder="请选择年龄">
              <el-option v-for="(item,ind) in ageOption" :key="ind" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="员工身份证" prop="staffIdCard" :rules="[{ required: true, message: '员工身份证不能为空'}]"
                        :label-width="formLabelWidth">
            <el-input v-model="form.staffIdCard" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="员工性别" :label-width="formLabelWidth">
            <el-radio-group v-model="form.staffSex">
              <el-radio label="男" :value="0"></el-radio>
              <el-radio label="女" :value="1"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="员工简介" prop="staffIntroduce" :rules="[{ required: true, message: '员工简介不能为空'}]"
                        :label-width="formLabelWidth">
             <el-input type="textarea" v-model="form.staffIntroduce"></el-input>
          </el-form-item>
          <el-form-item label="员工照片" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              :action="doUpload"
              :headers="myHeaders"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload">
                <img v-if="uploadUrl" :src="uploadUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="是否在职" :label-width="formLabelWidth">
              <el-switch v-model="form.status"></el-switch>
          </el-form-item>
        <el-form-item style="margin-left: 35%;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="insertStaff('form')">确 定</el-button>
        </el-form-item>
      </el-form>


      </el-dialog>
  </span>
</template>

<script>
  export default {
    name: "employInsert",
    data() {

      return {
        dialogFormVisible: false,
        form: {
          staffName: '',
          staffAge: '',
          staffSex: 0,
          staffIdCard: '',//员工身份证
          staffPic: '', //图片url
          staffIntroduce: '',//员工简介
          status: false, //是否在职
          staffStatus: 0, //在职,默认为0
        },
        ageOption: [],
        formLabelWidth: '100px',
        doUpload: '/apis/management/file/upload', //上传文件地址
        uploadUrl: '', //上传的图片地址
        myHeaders: {
          Authorization: 'Bearer ' + this.$Cookies.get('token'),
        },//上传图片地址请求头
      }
    },
    methods: {
      //选择年龄段
      addAge() {
        let minAge = 18;
        let maxAge = 55;
        for (let age = minAge; age <= maxAge; age++) {
          this.ageOption.push(age);
        }
      },
      openInsertDialog() {
        this.dialogFormVisible = true;
      },
      //上传图片成功后
      uploadSuccess(res, file) {
        if (res.code === 200) {
          // this.staffPic = URL.createObjectURL(file.raw);
          this.uploadUrl = this.$fastdfsUrl.fastdfs + res.data;
          this.form.staffPic = res.data[0];
        }
      },
      //上传图片之间
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        const isBMP = file.type === 'image/bmp';
        const isLt10M = file.size / 1024 / 1024 / 5 < 2;

        if (!isJPG && !isGIF && !isPNG && !isBMP) {
          this.$getMessage('上传图片必须是JPG/GIF/PNG/BMP 格式!', 'error');
          return false;
        }
        if (!isLt10M) {
          this.$getMessage('上传头像图片大小不能超过 10MB!', 'error');
          return false;
        }
        return (isJPG || isBMP || isGIF || isPNG) && isLt10M;
      },
      //新增员工
      insertStaff(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.form.staffIdCard = this.form.staffIdCard.replace(/\s/g, "");
            this.form.staffName = this.form.staffName.replace(/\s/g, "");
            if (this.form.status === false) {
              this.$getMessage('请将员工改为在职状态', 'info');
              return false;
            } else {
              this.form.staffStatus = 0;
            }
            let VehicleStaff = this.form;
            this.$axios.post('apis/management/manage/staff', VehicleStaff).then(res => {
              if (res.data.code === 200) {
                this.$getMessage('插入员工成功', 'success');
                this.dialogFormVisible = false;
                //向父组件传值
                this.$emit('insertGetStaff', true);
                this.$router.go(0);//新建成功刷新组件
              }
            }).catch(err => {
              console.log(err);
            });
          } else {
            this.$getMessage('请完善信息', 'error');
            return false;
          }
        });

      }
    },
    mounted() {
      this.addAge();
    },
  }
</script>

<style scoped>
  /*上传文件*/
  .avatar-uploader {
    width: 180px;
    height: 180px;
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
    width: 180px;
    height: 60px;
    line-height: 180px;
    text-align: center;
  }

  .avatar {
    width: 180px;
    height: 180px;
    display: block;
  }
</style>
