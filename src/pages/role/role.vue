<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="username" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="角色名" value="1"></el-option>
          </el-select>
          <el-button slot="append" @click="toSelectRole" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增角色</span>
        <el-button @click="addRole" type="primary" icon="el-icon-edit" circle></el-button>
      </el-col>
      <el-col :span="6">
        <span>删除角色</span>
        <el-button :disabled="isDelete" @click="deleteRole" type="danger" icon="el-icon-delete" circle></el-button>
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
            width="55">
          </el-table-column>
          <el-table-column
            label="角色"
            width="120"
            prop="rname">
          </el-table-column>
          <el-table-column
            prop="permissions"
            label="角色对应的权限"
            width="250"
            show-overflow-tooltip>
            <slot slot-scope="scope">
              <span v-for="val in scope.row.permissions">{{val.name}}&nbsp;</span>
            </slot>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="openUpdate(scope.row)" type="text" size="small">编辑</el-button>
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
      <el-col :span="4">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
    </el-row>
    <role-dialog :dialog="dialogVisible" @childFn="parentFn"></role-dialog>
    <!--修改对话框-->
    <el-dialog
      title="修改用户角色"
      :visible.sync="updateDialog"
      :close-on-click-modal='false'
      :modal-append-to-body='false'
      width="30%"
      :before-close="updateDialogClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色" prop="rname">
          <el-input type="text" v-model="ruleForm.rname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色对应权限">
          <el-checkbox-group
            v-model="checkedRole">
            <el-checkbox v-for="role in roles" :label="role.pid" :key="role.pid">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import roleDialog from "./roleDialog";

  export default {
    components: {roleDialog},
    comments: {roleDialog},
    data() {
      let validatePass = (rule, value, callback) => {
        let patt = /^[\s]*$/;//以空格开头并且已空格结尾，中间多ruleForm次或者零次空格
        if (patt.test(value)) {
          callback(new Error('角色名不能为空且不能存在空格'));
        } else {
          callback();
        }
      };

      return {
        select: '',
        tableData: [],
        multipleSelection: [],
        username: '',
        currentPage: 1, //分页时定义的页数
        pageSize: 5, //定义分label页个数的格式
        isDelete: true,
        deleteIds: [],
        dialogVisible: false, //定义组件的值
        updateDialog: false, //编辑对话框是否显示
        updateRole: {}, //编辑时得到用户的信息
        ruleForm: {
          rname: '',
        },
        rules: {
          rname: [
            {validator: validatePass, trigger: 'blur'}
          ],
        },
        checkedRole: [],
        roles: [],
        totalSize: 0, //总的数据
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showDelete(selection) {
        this.deleteIds = selection.map(obj => {
          return obj.rid;
        });
        if (selection.length !== 0) {
          this.isDelete = false;
        } else {
          this.isDelete = true;
        }
      },
      //修改
      openUpdate(row) {
        this.updateDialog = true;
        this.updateRole = row;
        this.ruleForm.rname = this.updateRole.rname;
        let permissionName = row.permissions.map(obj => {
          return obj.pid;
        });
        this.checkedRole = permissionName;
      },
      //关闭对话框
      updateDialogClose() {
        this.updateDialog = false;
      },
      handleSizeChange(val) {
        //每页多少数
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        //当前多少页
        this.currentPage = val;
      },
      toSelectRole() {
        this.selectRoles(this.username);
      },
      //查询所有的角色
      selectRoles(rname) {
        let param = {};
        if (rname !== null || rname !== '') {
          param = {
            rname: rname,
            pageNo: this.currentPage,
            pageSize: this.pageSize,
          }
        } else {
          param = {
            pageNo: this.currentPage,
            pageSize: this.pageSizedelete,
          }
        }
        this.$axios.get('/apis/management/manage/roles', {
          params: param
        }).then(res => {
          if (res.data.code === 200) {
            this.totalSize = res.data.data.total;
            this.tableData = res.data.data.records;
          }
        }).catch(err => {
          console.log(err.response);
        })
      },
      addRole() {
        this.dialogVisible = true;
      },
      //子组件给父组件传值
      parentFn(payload) {
        this.dialogVisible = payload;
      },
      //删除角色
      deleteRole() {
        this.$axios.delete('apis/management/manage/role', {data: this.deleteIds}).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('删除角色成功', 'success');
            setTimeout(() => {
              this.$router.go(0);
            }, 1500);
          }
        }).catch(err => {
          console.log(err.response);
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.checkedRole.length <= 0) {
              this.$getMessage('请选择用户权限', 'error');
              return false;
            }
            //新增角色
            this.$axios.put('/apis/management/manage/role', {
              rid: this.updateRole.rid,
              pid: this.checkedRole,
              rname: this.ruleForm.rname,
            }).then(res => {
              if (res.data.code === 200) {
                this.$getMessage('修改角色成功', 'success');
                setTimeout(() => {
                  this.$router.go(0)
                }, 1500);
              }
            }).catch(err => {
              console.log(err.response);
            });
          } else {
            this.$getMessage('请填写对应信息', 'error');
            return false;
          }
        });
      },
    },
    mounted() {
      this.selectRoles();
      this.$axios.get('/apis/management/manage/permission').then(res => {
        if (res.data.code === 200) {
          this.roles = res.data.data;
        }
      }).catch(err => {
        console.log(err.response);
      })
    }
  }
</script>

<style scoped>

</style>
