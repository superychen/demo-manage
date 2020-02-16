<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label">
          <i v-if="isTask" style="color: orangered;" class="el-icon-chat-line-square"></i> 任务中心
          <el-badge class="mark" :value="appData.length" />
        </span>
        <el-row v-if="isTask">
          <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" v-for="(item, index) in appData" :key="index">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <el-image fit="contain" style="width: 300px; height: 200px;"
                        :src="$fastdfsUrl.fastdfs + item.vehicleInfo.fileNumber.split(',')[0]"></el-image>
              <div style="padding: 14px;">
                <div>
                  <i>车主姓名:&nbsp;&nbsp;</i><span style="color: #606266;">{{item.vehicleInfo.vehicleUser}}</span>
                </div>
                <div>
                  <i>车牌号:&nbsp;&nbsp;</i><span style="color: #606266;">{{item.vehicleInfo.vehicleNumber}}</span>
                </div>
                <div>
                  <i>预约时间:&nbsp;&nbsp;</i>
                  <time class="time">{{ item.appointTime.replace('T',' ') }}</time>
                </div>
                <div>
                  <i>预约地址:&nbsp;&nbsp;</i>
                  <time class="time">{{ item.appointAddress}}</time>
                </div>
                <div>
                  <i>预约电话:&nbsp;&nbsp;</i>
                  <time class="time">{{ item.vehicleInfo.vehicleUserTelephone}}</time>
                </div>
              </div>
              <el-button type="primary" @click="gotoResult(item.id)" round style="float: right;">填写检查结果</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row v-if="!isTask">
          当前还没有任何任务哟!!!
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "staffResult",
    data() {
      return {
        activeName: 'first',
        appData: [],
        isTask: false,
      }
    },
    methods: {
      gotoResult(id) {
        this.$router.push({path: '/staffRes/' + id + ''})
      },
    },
    mounted() {
      this.$axios.get('apis/vehicle/appoint/staff').then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          if (res.data.data === 10086) {
            this.isTask = false;
          } else {
            this.isTask = true;
            this.appData = res.data.data;
          }
        }

      }).catch(err => {
        console.log(err);
      })
    }
  }
</script>

<style scoped>

</style>
