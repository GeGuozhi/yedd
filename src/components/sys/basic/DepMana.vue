<template>
  <div style="width: 500px">
    <el-input placeholder="请输入部门名称进行搜索..."
              v-model="filterText"
              prefix-icon="el-icon-search"
              class="searchInput">
    </el-input>

    <el-tree
        class="filter-tree"
        :data="deps"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
       <span class="custom-tree-node" slot-scope="{ node, data }"
             style="display: flex; justify-content: space-between; width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
              type="primary"
              size="mini"
              class="depBtn"
              @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button
              type="danger"
              size="mini"
              class="depBtn"
              @click="() => deleteDep(node, data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
      <div>
        <table>
          <tr>
            <td style="padding-right: 20px">
              <el-tag>上级部门</el-tag>
            </td>
            <td style="padding-left: 10px">
              {{ parentName }}
            </td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="doAddDep">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogVisible: false,
      dep: {
        name: '',
        parentId: -1
      },
      parentName: ''
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    removeDepFromDeps(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);
          if (0 == deps.length) {
            p.isParent = false;
          }
          return;
        } else {
          this.removeDepFromDeps(d, d.children, id);
        }
      }
    },
    addDep2Deps(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          // if(d.children)
          d.children = d.children.concat(dep);
          if (d.children.length > 0) {
            d.isParent = true;
          }
          return;
        } else {
          this.addDep2Deps(d.children, dep);
        }
      }
    },
    //初始化Dialog框内容
    initDep() {
      this.dep = {
        name: '',
        parentId: ''
      };
      this.parentName = ''
    },
    doAddDep() {
      if (this.dep.name) {
        this.postRequest('/system/basic/department/addDep', this.dep).then(resp => {
          if (resp) {
            this.addDep2Deps(this.deps, resp.obj);
            this.initDep();
            this.dialogVisible = false;
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '添加失败,部门名不可为空！'
        });
      }
    },
    showAddDep(data) {
      this.dep.parentId = data.id;
      this.parentName = data.name;
      this.dialogVisible = true;
    },
    deleteDep(node, data) {
      if (data.isParent) {
        this.$message.error('父部门删除失败！')
      } else {
        this.$confirm('此操作将删除该[' + data.name + ']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/department/deleteDep/' + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(null, this.deps, data.id);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    initDeps() {
      this.getRequest('/system/basic/department/getAllDepartments').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
}
</script>

<style>

.depBtn {
  padding: 5px;
}

.searchInput {
  margin-bottom: 10px;
}

</style>