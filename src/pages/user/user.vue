<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input size="medium" placeholder="请输入搜索的用户名" v-model="username">
          <el-button @click="searchUsername()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增用户</span>
        <el-button @click="showInsertOrUpdate" type="primary" icon="el-icon-edit" circle></el-button>
      </el-col>
      <el-col :span="6">
        <span>删除用户</span>
        <el-button @click="deleteUser" :disabled="isDelete" type="danger" icon="el-icon-delete" circle></el-button>
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
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @select="showDelete"
          @select-all="showDelete">
          <el-table-column
            type="selection"
            prop="uid"
            width="55">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="电话"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址"
            width="250"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="showInsertOrUpdate(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalSize">
          </el-pagination>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :modal="false"
      :close-on-click-modal='false'
      :before-close="dioagClose"
      center>
      <el-form label-position="right" label-width="80px" :model="formLabelAlign">
        <el-form-item label="用户名">
          <el-input v-if="formLabelAlign.userType === 1" v-model="formLabelAlign.username"></el-input>
          <span v-else>{{formLabelAlign.username}}</span>
        </el-form-item>

        <el-form-item v-if="formLabelAlign.userType === 2" label="重置密码">
          <el-switch v-model="formLabelAlign.resetPass"></el-switch>
        </el-form-item>
        <el-form-item v-if="formLabelAlign.userType === 1" label="密码">
          <el-input type="password" v-model="formLabelAlign.password"></el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input v-model="formLabelAlign.telephone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="formLabelAlign.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="dioagClose">取 消</el-button>
         <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        username: '',
        uid: '',
        currentPage: 1, //分页时定义的页数
        pageSize: 5, //定义分页个数的格式
        pageSizes: [5, 10, 15, 20], //可以选择分页的个数显示
        totalSize: 20, //总页数
        isDelete: true,

        dialogTitle: '新增用户',
        dialogVisible: false, //对话框是否关闭
        formLabelAlign: {
          userType: 1, //1为新增用户，2为编辑用户
          username: '',
          telephone: '',
          address: '',
          password: '', //密码
          resetPass: false, //重置密码
        }
      }
    },

    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

      showDelete(selection) {
        if (selection.length !== 0) {
          this.isDelete = false;
        } else {
          this.isDelete = true;
        }
      },
      handleSizeChange(val) {
        //当前选择的条数
        this.pageSize = val;
        this.selectAllPage();
      },
      handleCurrentChange(val) {
        //当前页uid
        this.currentPage = val;
        this.selectAllPage();
      },
      searchUsername() {
        this.selectAllPage(this.username);
      },
      selectAllPage(username) {
        let parm = {};
        if (username !== null || username !== '') {
          parm = {
            username: this.username,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
          }
        } else {
          parm = {
            pageNo: this.currentPage,
            pageSize: this.pageSize,
          }
        }
        this.$axios.get('/apis/management/manage/user', {
          params: parm
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.records;
            this.totalSize = res.data.data.total;
          }
        }).catch(err => {
          console.log(err.response);
        })
      },

      dioagClose(done) {
        this.$confirm('确认关闭？').then(_ => {
          this.dialogVisible = false;
          done();
        }).catch(_ => {

        });
      },

      showInsertOrUpdate(row) {
        this.dialogVisible = true;
        if (row.uid !== undefined) {
          this.dialogTitle = '编辑用户';
          this.formLabelAlign.userType = 2;//新增用户
          this.$axios.get('/apis/management/manage/user/' + row.uid
          ).then(res => {
            if (res.data.code === 200) {
              this.uid = res.data.data.uid;
              this.formLabelAlign.username = res.data.data.username;
              this.formLabelAlign.address = res.data.data.address;
              this.formLabelAlign.telephone = res.data.data.telephone;
            }
          }).catch(err => {
            console.log(err.response);
          })
        } else {
          this.dialogTitle = '新增用户';
          this.uid = '';
          this.formLabelAlign.userType = 1;//新增用户
          this.formLabelAlign.username = '';
          this.formLabelAlign.address = '';
          this.formLabelAlign.telephone = '';
          this.formLabelAlign.password = '';
        }
      },
      //新增用户或者修改用户
      addOrUpdateUser() {
        let user = {
          username: this.formLabelAlign.username,
          address: this.formLabelAlign.address,
          telephone: this.formLabelAlign.telephone,
        };
        //新增用户
        if (this.uid === '') {
          //给对象添加属性
          Vue.set(user, 'password', this.formLabelAlign.password);
          this.$axios.post('/apis/management/manage/user', user).then(res => {
            if (res.data.code === 200) {
              this.$getMessage('添加用户数据成功', 'success');
              this.dialogVisible = false; //关闭对话框
              this.selectAllPage();
            } else {
              this.$getMessage(res.data.data, 'error');
            }
          }).catch(err => {
            console.log(err.response);
            if (err.response.status === 601) {
              this.$getMessage('用户名已经存在了,请不要重复输入', 'error');
            } else {
              this.$getMessage(err.response.data, 'error');
            }
          })
        } else {
          //编辑用户
          Vue.set(user, 'uid', this.uid);
          if (this.formLabelAlign.resetPass === true) {
            Vue.set(user, 'password', '111111');
          }
          this.$axios.put('/apis/management/manage/user', user).then(res => {
            if (res.data.code === 200) {
              this.$getMessage('用户修改成功', 'success');
              this.dialogVisible = false; //关闭对话框
              this.selectAllPage();
            } else {
              this.$getMessage(res.data.data, 'error');
            }
          }).catch(err => {
            this.$getMessage(err.response.data, 'error');
          })
        }
      },

      //选中事件
      handleSelectionChange(val) {
        this.multipleSelection = [];
        val.forEach(res => {
          this.multipleSelection.push(res.uid);
        });
      },

      //删除用户
      deleteUser() {
        this.$axios.delete('/apis/management/manage/user', {data: this.multipleSelection}).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('用户删除成功', 'success');
            this.selectAllPage();
          }
        }).catch(err => {
          console.log(err.response.data);
          this.$getMessage('用户删除失败', 'error');
        })
      },
    },
    mounted() {
      this.selectAllPage();
    }
  }
</script>

<style scoped>

</style>
