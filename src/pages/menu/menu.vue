<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增菜单</span>
        <el-button type="primary" @click="createMenu" icon="el-icon-edit" circle></el-button>
      </el-col>
      <el-col :span="6">
        <span>删除菜单</span>
        <el-button @click="deleteMenu" :disabled="isDelete" type="danger" icon="el-icon-delete" circle></el-button>
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
            label="菜单名称"
            width="120"
            prop="menuTitle">

          </el-table-column>
          <el-table-column
            prop="menuLevel"
            label="菜单等级"
            width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.menuLevel === 0">父级节点</span>
              <span v-if="scope.row.menuLevel === 1">子级节点</span>
              <span v-if="scope.row.menuLevel === 3">菜单栏节点</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="menuPath"
            label="菜单对应的url"
            width="250"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="updateMenu(scope.row)" type="text" size="small">编辑</el-button>
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
      <el-dialog
        :title="diaogTitle"
        :visible.sync="centerDialogVisible"
        width="32%"
        :modal="false"
        :close-on-click-modal='false'
        :modal-append-to-body='false'
        :before-close="dioagClose1"
        center>
        <el-form :model="validateForm" :rules="rules" ref="numberValidateForm" label-width="100px">
          <el-form-item label="菜单名称" prop="menuTitle">
            <el-input type="text" v-model="validateForm.menuTitle"></el-input>
          </el-form-item>
          <el-form-item label="菜单等级" prop="menuLevel">
            <el-radio-group @change="levelMenu" v-model="validateForm.menuLevel">
              <el-radio :label="0">父级</el-radio>
              <el-radio :label="1">子级</el-radio>
              <el-radio :label="3">菜单栏</el-radio>
            </el-radio-group>
            <el-link v-if="validateForm.menuLevel === 1" @click="levelMenu" type="primary" :underline="false">选择菜单栏
            </el-link>
          </el-form-item>
          <el-form-item label="菜单路径" prop="menuPath">
            <el-input placeholder="格式可以为: /user/..." type="text" v-model="validateForm.menuPath"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="menuIcon">
            <el-input placeholder="字体图标,具体参考element" type="text" v-model="validateForm.menuIcon"></el-input>
          </el-form-item>
          <el-form-item label="选择角色">
            <el-checkbox-group v-model="validateForm.role">
              <template v-for="item in validateForm.roles">
                <el-checkbox :label="item.rid">{{item.rname}}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dioagClose1" size="mini">取 消</el-button>
          <el-button type="primary" @click="buildMenu">创建</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="请选择下列菜单作为父亲节点"
        :visible.sync="dialogFatherMenu"
        :close-on-click-modal='false'
        :modal-append-to-body='false'
        center
        :before-close="dioagClose"
        width="30%">
        <el-form :model="fatherMenu" label-width="100px">
          <el-form-item label="菜单名称">
            <el-radio-group @change="fatherChange" v-model="fatherMenu.menuPid">
              <template v-for="item in father">
                <el-radio :label="item.mid">{{item.menuTitle}}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dioagClose">取 消</el-button>
          <el-button type="primary" @click="fatherSub">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    data() {
      return {
        diaogTitle: '新建菜单',
        tableData: [],
        multipleSelection: [],
        username: '',
        currentPage: 1, //分页时定义的页数
        pageSize: 5, //定义分label页个数的格式
        pageSizes: [5, 10, 15, 20], //可以选择分页的个数显示
        totalSize: 20, //总页数
        isDelete: true,
        centerDialogVisible: false, //新建对话框
        dialogFatherMenu: false, //选择父级节点的对话框
        fatherMenu: {
          menuPid: 0,//父节点的id
        },
        father: [], //选择菜单作为父亲节点
        validateForm: {
          mid: 0,
          menuTitle: '',
          menuLevel: 0, //0为父级，1为子级
          menuPath: '', //菜单路径
          menuIcon: '', //菜单图标
          roles: [],
          role: [],
        },
        //校验规则
        rules: {
          menuTitle: [
            {required: true, message: '请输入菜单名称', trigger: 'blur'},
            {min: 3, max: 16, message: '长度必须大于3小于16', trigger: 'blur'}
          ],
          menuLevel: [
            {required: true, message: '请选择菜单的层级', trigger: 'change'}
          ],
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
      handleSelectionChange(val) {
        this.multipleSelection = [];
        val.forEach(res => {
          this.multipleSelection.push(res.mid);
        });
      },
      //删除菜单
      deleteMenu() {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMenuHelper();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteMenuHelper() {
        this.$axios.delete('/apis/management/manage/menu', {data: this.multipleSelection}).then(res => {
          if (res.data.code === 200) {
            this.$getMessage('菜单删除成功', 'success');
            setTimeout(() => {
              this.$router.go(0)
            }, 1500);
          }
        }).catch(err => {
          console.log(err.response.data);
        })
      },
      showDelete(selection) {
        if (selection.length !== 0) {
          this.isDelete = false;
        } else {
          this.isDelete = true;
        }
      },
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.selectAllMenu();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.selectAllMenu();
      },
      //查询所有的菜单栏
      selectAllMenu() {
        let param = {
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        };
        this.$axios.get('/apis/management/manage/menus', {
          params: param
        }).then(res => {
            this.tableData = res.data.data.records;
            this.totalSize = res.data.data.total;
        }).catch(err => {
          console.log(err.response);
        })
      },
      //创建菜单
      createMenu() {
        this.diaogTitle = '新建菜单';
        this.centerDialogVisible = true;
        this.validateForm.mid = 0;
        this.validateForm.menuTitle = '';
        this.validateForm.menuIcon = '';
        this.validateForm.menuPath = '';
        this.validateForm.menuLevel = 0;
        this.fatherMenu.menuPid = 0;
        this.validateForm.role = [];
        this.createOrUpdate();
      },
      //查询当前的角色
      createOrUpdate() {
        this.$axios.get('/apis/management/manage/role').then(res => {
          this.validateForm.roles = res.data.data;
        }).catch(err => {
          console.log(err.response.data);
        })
      },
      //选择菜单等级时还需要弹出一个选择框
      levelMenu() {
        //如果为子级，就需要选择自己的父级节点
        if (this.validateForm.menuLevel === 1) {
          this.dialogFatherMenu = true;
          this.$axios.get('/apis/management/manage/menu/3').then(res => {
            this.father = res.data.data;
          }).catch(err => {
            this.$getMessage(err.response.data, 'error')
          })
        } else {
          this.fatherMenu.menuPid = 0;
        }
      },
      //确认选择父级节点
      fatherSub() {
        if (this.fatherMenu.menuPid !== 0) {
          this.$getMessage('选择成功', 'success');
          this.dialogFatherMenu = false;
        } else {
          this.$getMessage('请先选择父节点', 'warning');
        }
      },
      //父级节点关闭对话框系列
      dioagClose() {
        this.dialogFatherMenu = false;
        this.validateForm.menuLevel = 0;
        this.fatherMenu.menuPid = 0;
      },
      //关闭新建菜单的对话框
      dioagClose1() {
        this.centerDialogVisible = false;
        this.validateForm.menuLevel = 0;
        this.fatherMenu.menuPid = 0;
      },
      fatherChange() {
        console.log(this.fatherMenu.menuPid);
      },
      //创建一个新的菜单
      buildMenu() {
        let menu = {
          menuTitle: this.validateForm.menuTitle,
          menuLevel: this.validateForm.menuLevel,
          menuPath: this.validateForm.menuPath,
          menuIcon: this.validateForm.menuIcon,
          menuPid: this.fatherMenu.menuPid,
          role: this.validateForm.role,
        };
        if (this.validateForm.mid === 0) {
          this.$axios.post('/apis/management/manage/menu', menu).then(res => {
            if (res.data.code === 200) {
              this.$getMessage('新建菜单成功', 'success');
              setTimeout(() => {
                this.$router.go(0)
              }, 1500);
            } else {
              this.$getMessage(res.data.data, 'error');
            }
          }).catch(err => {
            console.log(err.response.data);
            this.$getMessage(err.response.data, 'error');
          });
        } else {
          Vue.set(menu, 'mid', this.validateForm.mid);
          this.$axios.put('/apis/management/manage/menu', menu).then(res => {
            console.log(res.data);
            this.$getMessage('修改菜单成功', 'success');
            setTimeout(() => {
              this.$router.go(0)
            }, 1500);
          }).catch(err => {
            this.$getMessage(err.response.data, 'error');
          })
        }


      },
      //编辑菜单信息
      updateMenu(row) {
        console.log(row);
        this.diaogTitle = '修改菜单';
        this.centerDialogVisible = true;
        this.validateForm.mid = row.mid;
        this.validateForm.menuTitle = row.menuTitle;
        this.validateForm.menuIcon = row.menuIcon;
        this.validateForm.menuPath = row.menuPath;
        this.validateForm.menuLevel = row.menuLevel;
        this.fatherMenu.menuPid = row.menuPid;
        this.createOrUpdate();
        this.$axios.get('/apis/management/manage/roleMenu/' + row.mid).then(res => {
          console.log(res.data);
          this.validateForm.role = res.data.data;
        }).catch(err => {
          console.log(err.response);
          this.$getMessage(err.response.data, 'error');
        })
      }

    },
    mounted() {
      this.selectAllMenu();
    }
  }
</script>

<style scoped>

</style>
