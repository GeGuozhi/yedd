<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addJobInput1"
          placeholder="添加职称等级..."
          v-model="jl.name">
      </el-input>
      <el-select
          size="small"
          class="addJobInput2"
          placeholder="职称等级"
          v-model="jl.titleLevel">
        <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item"></el-option>

      </el-select>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addJoblevel">添加</el-button>

      <div class="JobManaMain">
        <el-table
            :data="jls"
            size="small"
            stripe
            border
            @selection-change="handleSelectionChange"
            style="width: 100%">

          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column
              prop="id"
              label="编号"
              width="50">
          </el-table-column>
          <el-table-column
              prop="name"
              label="职称名称"
              width="150">
          </el-table-column>
          <el-table-column
              prop="titleLevel"
              label="职称等级"
              width="150">
          </el-table-column>
          <el-table-column
              prop="createDate"
              label="创建时间"
              width="150">
          </el-table-column>

          <el-table-column
              prop="enabled"
              label="是否启用"
              width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
              <el-tag v-else type="danger">未启用</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="showEditView(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <el-button size="small" style="margin-top: 8px" type="danger"
                 :disabled="this.multipleSelection.length==0"
                 @click="deleteMany">
        批量删除
      </el-button>

      <div>
        <el-dialog
            title="编辑职称"
            :visible.sync="dialogVisible"
            width="30%">
          <table>
            <tr>
              <td>
                <el-tag>职称名称</el-tag>
              </td>
              <td>
                <el-input v-model="updateJob.name" class="updateJobInput2" size="small"></el-input>
              </td>
            </tr>

            <tr>
              <td>
                <el-tag>职称等级</el-tag>
              </td>
              <td>
                <el-select
                    size="small"
                    class="updateJobLevelInput"
                    placeholder="职称等级"
                    v-model="updateJob.titleLevel">
                  <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>
                <el-tag>是否启用</el-tag>
              </td>
              <td>
                <el-switch
                    style="display: block;margin-left: 5px"
                    v-model="updateJob.enabled"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="已启用"
                    inactive-text="未启用">
                </el-switch>
              </td>
            </tr>
          </table>

          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "JobMana",
  data() {
    return {
      jl: {
        name: '',
        titleLevel: ''
      },
      titleLevels: [
        '正高级', '副高级', '中级', '初级', '员级'
      ],
      jls: [],
      dialogVisible: false,
      updateJob: {
        name: '',
        titleLevel: '',
        enabled: []
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.initjls();
  },
  methods: {
    formatter(row, index) {
      if (row.enabled == true) {
        row.enabled = "已启用"
      }
      if (row.enabled == false) {
        row.enabled = "未启用"
      }
      return row.enabled
    },

    deleteMany() {
      this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&'
        })
        this.deleteRequest('/system/basic/delJoblevelsByIds' + ids).then(resp => {
          if (resp) {
            this.initjls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    doUpdate() {
      this.putRequest('/system/basic/updateJoblevel', this.updateJob).then(resp => {
        if (resp) {
          this.initjls();
          this.dialogVisible = false;
        }
      })
    },

    initjls() {
      this.getRequest('/system/basic/getAllJoblevels').then(resp => {
        if (resp) {
          this.jls = resp;
        }
      })
    },

    addJoblevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/system/basic/addJoblevel', this.jl).then(resp => {
          if (resp) {
            this.initjls();
            this.jl.name = '';
            this.jl.titleLevel = '';
          }
        })
      } else {
        this.$message.error('职称名称以及等级不能为空！')
      }
    },
    showEditView(index, data) {
      Object.assign(this.updateJob, data);
      this.updateJob.createDate = '';
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除[' + data.name + ']该职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/system/basic/delJoblevel/' + data.id).then(resp => {
          if (resp) {
            this.initjls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style>
.addJobInput1 {
  width: 180px;
  margin-right: 8px;
}

.addJobInput2 {
  width: 180px;
  margin-left: 6px;
  margin-right: 6px;
}

.JobManaMain {
  margin-top: 10px;
}

.updateJobInput2 {
  width: 200px;
  margin-left: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.updateJobLevelInput {
  width: 200px;
  margin-left: 8px;
  margin-top: 5px;
  margin-bottom: 5px;
}

</style>