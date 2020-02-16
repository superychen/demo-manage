<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="searchName" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="身份证" :value="1"></el-option>
            <el-option label="工牌号" :value="2"></el-option>
          </el-select>
          <el-button slot="append" @click="searchStaff" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增员工</span>
        <employ-insert @insertGetStaff="insertGetStaff"></employ-insert>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple" style="color: white; font-size: 1px;opacity: 0;">
          1
        </div>
      </el-col>
      <el-col :span="16">
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="staffNumber"
            label="工牌号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="staffName"
            label="姓名"
            width="80">
          </el-table-column>
          <el-table-column
            prop="staffSex"
            label="性别"
            width="80">
<!--            <template slot-scope="scope">-->
<!--              <span>{{scope.row.staffSex === 0 ? '男' : '女'}}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="staffIdCard"
            width="180"
            label="身份证">
          </el-table-column>
          <el-table-column
            prop="staffStatus"
            label="状态">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.staffStatus ===  0 ? 'primary' : 'info'"
                disable-transitions>{{scope.row.staffStatus === 0 ? '在职' : "离职"}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <!--              <el-button @click="lookOver(scope.row)" type="text" size="small">查看</el-button>-->
              <el-button @click="updateStaff(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>
      <employ-update @afterUpdate="insertGetStaff" @closeDialog="closeDialog" :staffInfo="staffInfo"
                     :isDialog="isDialog"></employ-update>
    </el-row>

  </div>
</template>

<script>
  import employInsert from "./employInsert";
  import employUpdate from "./employUpdate";

  export default {
    name: "employer",
    components: {employInsert, employUpdate},
    data() {
      return {
        select: '', //选择搜索条件
        searchName: '', //搜索名字
        currentPage: 1, //分页时定义的页数
        totalSize: 0, //总的数据
        pageSize: 5, //定义分label页个数的格式
        tableData: [],
        isDialog: 0,
        staffInfo: null,
      }
    },
    methods: {
      searchStaff() {
        if (this.select === null || this.select === '') {
          this.$getMessage('请选择一个您要搜索的对象', 'error');
          return false;
        }
        this.initStaff();
      },

      lookOver(row) {
        console.log("----------");
        console.log(row);
      },
      //当前页存在的个数
      handleSizeChange(val) {
        this.pageSize = val;
        this.$nextTick(() => {
          this.initStaff()
        })
      },
      //当前页变化
      handleCurrentChange(val) {
        //当前多少页
        this.currentPage = val;
        this.$nextTick(() => {
          this.initStaff()
        })
      },
      initStaff() {
        let param = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        };
        if (this.select === 1 || this.select === 2) {
          this.$set(param, "selectName", this.searchName);
          this.$set(param, "chooseSelect", this.select);
        } else if (this.select !== '') {
          this.$getMessage('无效请求', 'error');
          return false;
        }
        this.$axios.get('apis/management/manage/staff', {
          params: param
        }).then(res => {
          console.log(res.data);
          this.tableData = res.data.data.records;
          this.currentPage = res.data.data.current;
          this.totalSize = res.data.data.total;
        }).catch(err => {
          console.log(err);
        })
      },
      // 修改或者新增完成之后子组件向父组件传值,刷新数据
      insertGetStaff(msg) {
        if (msg === true) {
          this.initStaff();
        }
      },
      //修改员工
      updateStaff(val) {
        this.staffInfo = val;
        this.isDialog = 1;
      },
      //关闭对话框
      closeDialog(msg) {
        this.isDialog = msg;
      },
    },
    mounted() {
      this.initStaff();
    }
  }
</script>

<style scoped>
  .el-select {
    width: 100px;
  }
</style>
