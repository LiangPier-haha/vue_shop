<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-alert
					title="添加商品信息"
					type="info" show-icon center>
			</el-alert>
			<el-steps :active="activeStep - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-position="top" class="demo-ruleForm">
				<el-tabs v-model="activeStep" tab-position="left" :before-leave="beforeLeave" @tab-click="tabClicked">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addGoodForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addGoodForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addGoodForm.goods_number" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader
									v-model="addGoodForm.goods_cat"
									:options="cateList"
									:props="cateProps"
									@change="handleChange"></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border=""></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<el-form-item>
							<el-upload
									:action="upLoadUrl+'upload'"
									:on-preview="handlePreview"
									:on-remove="handleRemove"
									list-type="picture" :headers="headers" :on-success="upLoadSuccess">
								<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<quill-editor
								v-model="addGoodForm.goods_introduce"
						/>
						<el-button type="primary" class="addgood" @click="addGood">添加商品</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<el-dialog
				title="图片预览"
				:visible.sync="previewVisible"
				width="50%">
			<img :src="previewUrl" alt="" class="previewpic">
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'
    export default {
        name: "AddGood",
		data() {
            return {
                activeStep: '0',
                addGoodForm: {
                    goods_name: "",
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    goods_cat: [],
					 pics: [],
                    goods_introduce: "",
					attrs: []
				},
                addGoodFormRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' },
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' },
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' },
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' },
                    ]
				},
                selectedKeys: [],
				cateList: [],
				cateProps: {
                    expandTrigger: 'hover',
					label: 'cat_name',
					value: 'cat_id'

				},
				manyTableData: [],
				onlyTableData: [],
				upLoadUrl: 'http://123.56.255.138:8888/api/private/v1/',
                headers: {
                    Authorization: window.sessionStorage.getItem("token")
				},
                previewUrl: "",
                previewVisible: false
			}
		},
		created() {
          this.getCateList()
		},
		computed: {
          cataId() {
              if (this.addGoodForm.goods_cat.length === 3){
                  return this.addGoodForm.goods_cat[2]
			  }
              return null
		  }
		},
		methods: {
            async getCateList() {
                const {data:res} = await this.$http.get('categories',{params:{type:3}})
				console.log(res)
				if (res.meta.status !== 200) return this.$message.error(res.meta.mgs)
				this.cateList = res.data
			},
            handleChange() {
				if (this.addGoodForm.goods_cat.length < 3) return this.addGoodForm.goods_cat = []
			},
            beforeLeave(activeName,oldActiveName) {
                if (oldActiveName === '0'){
                    if (this.addGoodForm.goods_cat.length < 3){
                        this.$message.error("请先选择商品分类")
                        return false
					}
                    return true
				}
			},
            async tabClicked(tabName) {
                if (tabName.name === "1") {
                     const {data:res} = await this.$http.get(`categories/${this.cataId}/attributes`,{params:{sel: "many"}})
					res.data.forEach(item => {
					    item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
					})
					this.manyTableData = res.data
					console.log(this.manyTableData)
				}
                if (tabName.name === "2") {
                    const {data:res} = await this.$http.get(`categories/${this.cataId}/attributes`,{params:{sel: "only"}})
                    this.onlyTableData = res.data
					console.log(this.onlyTableData)
                }
			},
            handlePreview(file) {
				this.previewUrl = file.response.data.url
				console.log(this.previewUrl)
				this.previewVisible = true
			},
            handleRemove(file) {
				const tem_path = file.response.data.tmp_path
				const i = this.addGoodForm.pics.findIndex(item => {
				    if (item.pic === tem_path) {
				        return true
					}
				})
				this.addGoodForm.pics.splice(i,1)
				console.log(this.addGoodForm)
			},
            upLoadSuccess(res) {
                const picInfo = {
                    pic: res.data.tmp_path
				}
                this.addGoodForm.pics.push(picInfo)
				console.log(this.addGoodForm)
			},
            addGood() {
                this.$refs.addGoodFormRef.validate(async valid => {
                    if (!valid) return this.$message.error("请填写必要的商品信息")
					 this.manyTableData.forEach(item => {
					     const attr = {attr_id: item.attr_id,attr_value: item.attr_vals === [] ? '': item.attr_vals.join(',')}
					     this.addGoodForm.attrs.push(attr)
					 })
                    this.onlyTableData.forEach(item => {
                        const attr = {attr_id: item.attr_id,attr_value: item.attr_vals}
                        this.addGoodForm.attrs.push(attr)
                    })
					const form = _.cloneDeep(this.addGoodForm)
					form.goods_cat = form.goods_cat.join(',')
					console.log(form)
					const {data:res} = await this.$http.post('goods',form)
					console.log(res)
					if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
					this.$message.success(res.meta.msg)
					this.$router.push('/goods')
				})
			}
		}
    }
</script>

<style lang="less" scoped>
.el-step__title {
	font-size: 7px;
}
.el-steps {
	margin: 10px 5px;
}
.el-checkbox{
	margin: 0px 5px 0px 0px !important;
}
.previewpic {
	width: 100%;
	height: 80%;
}
.addgood {
	margin-top: 7px;
}
</style>