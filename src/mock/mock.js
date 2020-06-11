import Mock from 'mockjs'
import getMockData from './data/demoList'

Mock.setup({
    timeout: '200-600'
});

const BaseUrl = 'http://123.56.255.138:8888/api/private/v1/'

const goodlist = {
    code:'200',
    message:"商品列表请求成功",
    data:getMockData
    }

Mock.mock(BaseUrl+'goods/goodlist', 'get',goodlist)

