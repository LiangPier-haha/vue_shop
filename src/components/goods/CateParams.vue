<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-alert
					title="注意：只允许为第三级分类设置相关参数！"
					type="warning"
					show-icon>
			</el-alert>
			<el-row class="cat-opt">
				<el-col>
					<span>选择商品分类:</span>
					<el-cascader v-model="selectedKeys"
									 :options="cataList"
									 :props="cateCascaderProps"
									 @change="handleChange"
									 clearable>
						</el-cascader>
				</el-col>

			</el-row>
			<el-tabs @tab-click="handleClick" v-model="activeName">
				<el-tab-pane label="动态参数" name="many">
					<el-button :disabled="isBtnDisable" type="primary" @click="addDialogVisible=true">添加参数</el-button>
					<el-table :data="manyTableData" border>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag
										:key="tag"
										v-for="(tag,i) in scope.row.attr_vals"
										closable
										:disable-transitions="false"
										@close="handleClose(i,scope.row)">
									{{tag}}
								</el-tag>
								<el-input
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="addTagValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" index-text="#"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="静态属性" name="only">
					<el-button :disabled="isBtnDisable" type="primary" @click="addDialogVisible=true">添加属性</el-button>
					<el-table :data="onlyTableData" border>
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag
										:key="tag"
										v-for="(tag,i) in scope.row.attr_vals"
										closable
										:disable-transitions="false"
										@close="handleClose(i,scope.row)">
									{{tag}}
								</el-tag>
								<el-input
										class="input-new-tag"
										v-if="scope.row.inputVisible"
										v-model="addTagValue"
										ref="saveTagInput"
										size="small"
										@keyup.enter.native="handleInputConfirm(scope.row)"
										@blur="handleInputConfirm(scope.row)">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<el-table-column type="index" index-text="#"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit" @click="editDialog(scope.row.attr_id)">编辑</el-button>
								<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParam(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<el-dialog
				:title="'添加'+ addTitle"
				:visible.sync="addDialogVisible"
				width="50%" @close="addDialogClose">
			<el-form :model="addParamForm" :rules="addParamFormRule" ref="addParamFormRef" label-width="100px">
				<el-form-item :label="addTitle" prop="attr_name">
					<el-input v-model="addParamForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
				:title="'编辑'+ addTitle"
				:visible.sync="editDialogVisible"
				width="50%" @close="editDialogClose">
			<el-form :model="editParamForm" :rules="editParamFormRule" ref="editParamFormRef" label-width="100px">
				<el-form-item :label="addTitle" prop="attr_name">
					<el-input v-model="editParamForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
    export default {
        name: "CateParams",
		data() {
            return {
                cataList: [],
				selectedKeys: [],
				cateCascaderProps: {
                    expandTrigger: 'hover',
					label: 'cat_name',
                    value: 'cat_id',
                    children: 'children'
				},
                activeName: 'many',
                manyTableData: [],
                onlyTableData: [],
				addTagValue: '',
                inputVisible: false,
                addDialogVisible: false,
                addParamForm: {
                    attr_name: ""
				},
                addParamFormRule: {
                    attr_name: [
						{ required: true, message: "请输入名称" , trigger: "blur"}
					]
				},
                editDialogVisible: false,
                editParamForm: {
                    attr_name: ''
				},
                editParamFormRule: {
                    attr_name: [
                        { required: true, message: "请输入名称" , trigger: "blur"}
                    ]
                },
                editId:''
		}},
		created() {
            this.getCateList()
        },
		computed: {
            isBtnDisable() {
                return this.selectedKeys.length !== 3
			},
			cateid() {
                return this.selectedKeys.length === 3 ? this.selectedKeys[2] : null
			},
			addTitle() {
                if (this.activeName === 'many') {
                    return "动态参数"
				}
                return "静态属性"
			}
		},
		methods: {
            async getCateList() {
                const {data:res} = await this.$http.get('categories',{params:{type:3}})
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.cataList = res.data
			},
            handleChange(data) {
				if (this.selectedKeys.length < 3) {
				    this.selectedKeys = []
					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				this.getParamsData()
			},
            handleClick(tab, event) {
                if (this.cateid){
                    this.getParamsData()
                }
			},
			async getParamsData() {
                const {data:res} = await this.$http.get(`categories/${this.cateid}/attributes`,{params:{sel:this.activeName}})
                console.log(res)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				res.data.forEach(item => {
				    item.attr_vals = item.attr_vals === "" ? [] : item.attr_vals.split(',')
					item.inputVisible = false
				})
				console.log(res)
				if (this.activeName === "many") {
				    this.manyTableData = res.data
				}else {
				    this.onlyTableData = res.data
				}
            },
            addDialogClose() {
                console.log(this.activeName)
                this.$refs.addParamFormRef.resetFields()
			},
            addParams() {
                this.$refs.addParamFormRef.validate(async valid => {
                    if (!valid) return
					const {data:res} = await this.$http.post(`categories/${this.cateid}/attributes`,{attr_name:this.addParamForm.attr_name,attr_sel:this.activeName})
					console.log(res)
					if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
					this.getParamsData()
					this.addDialogVisible = false
				})
			},
            editDialogClose() {
                this.$refs.editParamFormRef.resetFields()
			},
            editParams() {
                this.$refs.editParamFormRef.validate(async valid => {
                    if (!valid) return
					const {data:res} = await this.$http.put(`categories/${this.cateid}/attributes/${this.editParamForm.attr_id}`,
						{attr_name:this.editParamForm.attr_name,attr_sel:this.activeName,attr_vals:this.editParamForm.attr_vals})
					if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					this.$message.success(res.meta.msg)
					this.getParamsData()
					this.editDialogVisible = false

				})
               this.editDialogVisible = false
			},
            async editDialog(id) {
                this.editId = id
				const {data:res} = await this.$http.get(`categories/${this.cateid}/attributes/${id}`)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.editParamForm = res.data
				console.log(res)
                this.editDialogVisible = true
			},
            async removeParam(id) {
                const confirm =await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
				console.log(confirm)
				if (confirm !== 'confirm') return this.$message.info("已取消删除")
				const {data:res} = await this.$http.delete(`categories/${this.cateid}/attributes/${id}`)
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.$message.success(res.meta.msg)
				this.getParamsData()
			},
            handleInputConfirm(row) {
                if (!this.addTagValue.trim()) return
                row.inputVisible = false
                row.attr_vals.push(this.addTagValue.trim())
                this.savaAttrTag(row)
			},
			async savaAttrTag(row) {
                const {data:res} = await this.$http.put(`categories/${this.cateid}/attributes/${row.attr_id}`,
                    {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')})
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
			},
            showInput(row) {
                this.addTagValue = ''
                row.inputVisible = true
                this.$nextTick(_ =>{
                    this.$refs.saveTagInput.$refs.input.focus();
                })
			},
            handleClose(i,row){
				row.attr_vals.splice(i,1)
				this.savaAttrTag(row)
            },

		}
    }
</script>

<style lang="less" scoped>
.cat-opt {
	margin-top: 15px;
}
.el-cascader {
	margin-left: 7px;
}
.el-tabs {
	margin-top: 7px;
}
.el-tag {
	margin: 10px 5px;
}
.el-table {
	margin-top: 7px;
}
.input-new-tag {
	width: 100px;
}
</style>