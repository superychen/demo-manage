<template>
  <div>
    <el-row>
      <el-col v-for="(item,index) in stepData" :xs="24" :sm="24" :md="6" :lg="6" :xl="6" style="margin-top: 20px;"
              :key="index">
        <el-tag type="success">{{item.stepTitle}}</el-tag>
        <el-radio-group v-model="item.conformity">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="2">不合格</el-radio>
        </el-radio-group>
        <div v-if="item.conformity === 1">
          <i>请输入检查合格率: &nbsp;</i>
          <el-input-number @change="chageConformityPercent(item)" v-model="item.isConformityText" :step="5"
                           :min="item.stepIndicator" :max="100"></el-input-number>
          <el-progress type="circle" :percentage="item.isConformityText"></el-progress>
        </div>
        <div v-if="item.conformity === 2">
          <i>损坏情况描述: &nbsp;</i>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="item.notConformtyText">
          </el-input>

          <div v-if="item.notConformtyPic === ''">
            <i>点击上传损坏车辆信息图片: &nbsp;</i>
            <label for="file-input" class="uploadFileLable" style="">
              上传图片
            </label>
            <input type="file" accept="image/*" capture="camera" @change="updatePic($event,item)" id="file-input"
                   style="display: none;"
                   multiple="multiple"/>
          </div>

          <div v-if="item.notConformtyPic !== ''">
            <el-image fit="contain" style="width: 50px; height: 50px;" :src="$fastdfsUrl.fastdfs + item.notConformtyPic"
                      class="can5"></el-image>
            <el-button type="danger" title="删除图片" icon="el-icon-delete"
                       @click="deletePic(item)"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-button type="success" @click="subResult">检测成功</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "staffRes",
    data() {
      return {
        stepData: [],
        uploadUrl: '', //上传的图片地址
      }
    },
    methods: {
      initRes() {
        this.$axios.get('apis/vehicle/vehicle/step').then(res => {
          console.log(res.data);
          if (res.data.code === 200) {
            res.data.data.forEach(v => {
              v.conformity = 0;
              v.isConformityText = v.stepIndicator; //合格需要填入的内容
              v.notConformtyText = ''; //不合格填入的内容
              v.notConformtyPic = ''; //不合格上传的图片src
            });
            this.stepData = res.data.data;
          }
        }).catch(err => {
          console.log(err);
        })
      },

      //改变当前合格的百分比
      chageConformityPercent(item) {
        if (item.isConformityText < item.stepIndicator) {
          this.$getMessage(item.stepTitle + '的最小合格率为' + item.stepIndicator + '%', 'warning');
          item.conformity = 2;//不合格
          item.isConformityText = item.stepIndicator;
        }
      },

      //上传文件
      updatePic(e, item) {
        let file = e.target.files[0];//获取文件
        const formData = new FormData();
        formData.append('file', file);
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
          }
        };
        this.$axios.post('/apis/management/file/upload', formData, config).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('上传成功', 'success');
            item.notConformtyPic = res.data.data[0];
          }
        }).catch(err => {
          console.log(err);
        })
      },
      //删除图片
      deletePic(item) {
        this.$axios.delete('apis/management/file/del/file?filePath=' + item.notConformtyPic).then(res => {
          console.log(res.data);
          item.notConformtyPic = '';
          this.$getMessage('删除成功', 'success');
        }).catch(err => {
          console.log(err);
        })
      },

      //提交结果
      subResult() {
        //为1表示当前选择的是合格
        for (let i = 0; i < this.stepData.length; i++) {
          let v = this.stepData[i];
          if (v.conformity === 1) {
            if (v.isConformityText < v.stepIndicator) {
              this.$getMessage(v.stepTitle + '合格率最低为' + v.isConformityText + '%', 'error');
              return false;
            }
          } else if (v.conformity === 2) {
            //为2表示选择的是不合格
            if (v.notConformtyPic === null || v.notConformtyPic === '') {
              this.$getMessage(v.stepTitle + '请上传未达合格标准的检测图片!!!', 'error');
              return false;
            }
            if (v.notConformtyText === null || v.notConformtyText === '') {
              this.$getMessage(v.stepTitle + '请描述损坏情况!!!', 'error');
              return false;
            }
          } else {
            this.$getMessage(v.stepTitle + '未选择结果!!!', 'error');
            return false;
          }
        }
        console.log(this.stepData);
        this.$confirm('您的结果已填写正确,您确定要上传检测结果吗?')
          .then(_ => {
            console.log("确认");
            this.staffResult(this.stepData);
          })
          .catch(_ => {
            console.log("gun");
          });
      },
      staffResult(item) {
        this.$axios.post('apis/vehicle/vehicle/result?aid=' + this.$route.params.appId, item).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('填写结果成功', 'success');
            setTimeout(() => {
              this.$router.push({path: '/result'});
            }, 1000);
          }
        }).catch(err => {
          console.log(err);
        });
      },
    },
    mounted() {
      this.initRes();
    }
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

  .uploadFileLable {
    width: 70px;
    height: 30px;
    display: block;
    margin-top: 10px;
    background: orangered;
    text-align: center;
    line-height: 30px;
  }

</style>
