<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="未检测" name="first">
        <el-row>
          <el-col :span="7" v-for="(item,index) in appData" :offset="index > 0 ? 1 : 0" :key="index">
            <el-card shadow="hover">
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
              </div>
              <el-button type="primary" @click="chooseStaff(item)" round style="float: right;">分配员工</el-button>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <div style="opacity: 0;">0</div>
          </el-col>
          <el-col :span="8">
            <div class="block" style="margin-top: 20px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[6, 9, 12]"
                :page-size="6"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalSize">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="检测中" name="second">
        检测中
      </el-tab-pane>
      <el-tab-pane label="已检测" name="third">角色管理</el-tab-pane>
    </el-tabs>
    <appoint-staff @closeDialog="closeDialog" :appointmentId="appointmentId" :isDialog="isDialog"></appoint-staff>
  </div>
</template>

<script>
  import appointStaff from "./child/appointStaff";

  export default {
    name: "appoint",
    components: {appointStaff},
    data() {
      return {
        activeName: 'first',
        appData: [], //数据
        currentPage: 1, //分页时定义的页数
        pageSize: 6, //定义分label页个数的格式
        totalSize: 0, //总的数据
        isDialog: 0,
        appointmentId: 0,//需要传值的预约id
      }
    },
    methods: {
      initAppoints() {
        this.$axios.get('apis/vehicle/appoint/app', {
          params: {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
          }
        }).then(res => {
          console.log(res.data);
          this.appData = res.data.data.records;
          this.currentPage = res.data.data.current;
          this.totalSize = res.data.data.total;
        }).catch(err => {
          console.log(err);
        })
      },
      //当前页存在的个数
      handleSizeChange(val) {
        this.pageSize = val;
        this.initAppoints();
      },
      //当前页变化
      handleCurrentChange(val) {
        //当前多少页
        this.currentPage = val;
        this.initAppoints();
      },
      tabClick(tab, event) {
        // console.log(tab, event);
      },
      chooseStaff(obj) {
        this.appointmentId = obj.id;
        this.isDialog = 1;
      },
      //关闭对话框
      closeDialog(msg) {
        this.isDialog = msg;
      }
    },
    mounted() {
      this.initAppoints();
    }
  }
</script>

<style scoped>

</style>
