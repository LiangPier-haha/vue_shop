<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row class="addCate">
				<el-col>
					<el-button type="primary" @click="addCateDialog">添加分类</el-button>
				</el-col>
			</el-row>
			<tree-table :data="cateList" :columns="columns" :selection-type="false" show-index index-text="#" :show-row-hover="false" :expand-type="false" border>
				<template slot="isok" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
					<i class="el-icon-error" v-else style="color: red"></i>
				</template>
				<template slot="order" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
				</template>
				<template slot="operation" slot-scope="scope">
					<el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete-solid">删除</el-button>
				</template>
			</tree-table>
			<div class="pagination">
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="queryInfo.pagenum"
						:page-sizes="[2, 3, 5, 7]"
						:page-size="queryInfo.pagesize"
						layout="total, sizes, prev, pager, next, jumper"
						:total="total">
				</el-pagination>
			</div>
		</el-card>
		<el-dialog
				title="添加分类"
				:visible.sync="addCateDialogVisible"
				width="30%" @close="addCateDialogClose">
			<el-form :model="addCateForm" label-width="80px" :rules="addCateFormRules" ref="addCateFormRef">
				<el-form-item label="分类名称" prop="cat_name">
					<el-input v-model="addCateForm.cat_name"></el-input>
				</el-form-item>
				<el-form-item label="父级分类">
					<el-cascader
							v-model="selectedKeys"
							:options="fatherCate"
							@change="handleChange"
							:props="{label:'cat_name',value: 'cat_id',expandTrigger: 'hover',checkStrictly:true}"
							clearable
									>
					</el-cascader>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addCateDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCate">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
        name: "Cate",
		data() {
            return {
                queryInfo: {
                    type: "",
                    pagenum: 1,
                    pagesize: 5
				},
				cateList: [],
				total: 0,
                columns: [
                    {
                        label: "分类名称",
                        prop: "cat_name"
                    },
					{
					    label: "是否有效",
						type: "template",
						template: "isok"
					},
					{
					    label: "排序",
						type: "template",
						template: "order"
					},
					{
					    label: "操作",
						type: "template",
						template: 'operation'
					}
				],
                addCateDialogVisible: false,
                addCateFormRules: {
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
					]
				},
                addCateForm: {
                    cat_name: "",
                    cat_pid: 0,
                    cat_level: 0
				},
				selectedKeys: [],
                fatherCate: []
			}
		},
		created() {
			this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data:res} = await this.$http.get("categories",{params:this.queryInfo})
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
				this.cateList = res.data.result
				this.total = res.data.total
			},
            handleCurrentChange(pagenum) {
                this.queryInfo.pagenum = pagenum
				this.getCateList()
			},
            handleSizeChange(pagesize) {
                this.queryInfo.pagesize = pagesize
				this.getCateList()
			},
            async addCateDialog() {
                const {data:res} = await this.$http.get('categories',{params:{type:2}})
				if (res.meta.status !== 200) return this.$message.error("获取父级分类列表失败")
				this.fatherCate = res.data
                this.addCateDialogVisible = true
			},
            handleChange(data) {
				if (this.selectedKeys.length > 0){
				    this.addCateForm.cat_level = this.selectedKeys.length
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
				} else {
				    this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
				console.log(this.addCateForm)
			},
            addCateDialogClose() {
                this.$refs.addCateFormRef.resetFields()
				this.selectedKeys = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			},
            addCate() {
                this.$refs.addCateFormRef.validate(async valid => {
					if (valid) {
                        const {data:res} = await this.$http.post('categories',this.addCateForm)
                        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
                        this.getCateList()
                        this.addCateDialogVisible = false
					}
				})
			}

		}
    }
</script>

<style scoped>
	.addCate {
		margin-bottom: 7px;
	}
</style>