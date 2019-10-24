<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div style="opacity: 0;">0</div>
      </el-col>
      <el-col :span="3">
        <span>新增权限</span>
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
      </el-col>
      <el-col :span="6">
        <span>删除权限</span>
        <el-button :disabled="isDelete" type="danger" icon="el-icon-delete" circle></el-button>
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
            label="权限名称"
            width="120"
            prop="name">
          </el-table-column>
          <el-table-column
            prop="descript"
            label="权限描述"
            width="120">
          </el-table-column>
          <el-table-column
            prop="url"
            label="权限对应的url"
            width="250"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block" style="margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          name: 'add',
          descript: '增加的权限',
          url: '/user/add'
        }, {
          name: 'select',
          descript: '查询的权限',
          url: '/user/select'
        }, {
          name: 'update',
          descript: '修改的权限',
          url: '/user/update',
        }, {
          name: 'delete',
          descript: '删除的权限',
          url: '/user/delete'
        }

        ],
        multipleSelection: [],
        username: '',
        currentPage: 4, //分页时定义的页数
        isDelete: true,
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
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style scoped>

</style>
