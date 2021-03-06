import React, { Component } from 'react';
import './form.less';

import moment from 'moment';
import { Row, Col, Input, Icon, Button, Popconfirm,message } from 'antd';

import BreadcrumbCustom from 'components/common/BreadcrumbCustom';
import CollectionCreateForm from './CustomizedForm';
import FormTable from './FormTable';

import {ReadUser,UpdateUser,DeleteUser,AddUser} from "api/system";

const Search = Input.Search;

//数组中是否包含某项
function isContains(arr, item){
    arr.map(function (ar) {
        if(ar === item){
            return true;
        }
    });
    return false;
}
//找到对应元素的索引
function catchIndex(arr, key){ //获取INDEX
    var i=0;
    arr.map(function (ar, index) {
        if(ar.user_id==key){
            i=index;
        }
    });
    return i;
}
//替换数组的对应项
function replace(arr, item, place){ //arr 数组,item 数组其中一项, place 替换项
    arr.map(function (ar) {
        if(ar.key === item){
            arr.splice(arr.indexOf(ar),1,place)
        }
    });
    return arr;
}

export default class UForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            count: 0,
            selectedRowKeys: [],
            selectedRows:[],
            tableRowKey: 0,
            isUpdate: false,
            loading: true,
            page:1,
        };
    }
    //getData
    getData = () => {

        ReadUser({page:this.state.page,name:this.state.userName}).then(res=>{
            let code =res.code;
            if(code=='000000'){

                var list=res.data.list;

                for(let i=0;i<list.length;i++){
                    list[i]['key']=list[i]['user_id']
                }
                this.setState({
                    dataSource: list,
                    loading:false
                })
            }else{
                message.error(res.msg);
            }
        },err=>{
            message.error(err);
        });

    };


    //用户名输入
    onChangeUserName = (e) => {
        const value = e.target.value;
        this.setState({
            userName: value,
        })
    };



    //渲染
    componentDidMount(){
        this.getData();
    }
    //搜索按钮
    btnSearch_Click = () => {
        this.getData();
    };

    //新建信息弹窗
    CreateItem = () => {
        this.setState({
            visible: true,
            isUpdate: false,
        });
        const form = this.form;
        form.resetFields();
    };
    //接受新建表单数据
    saveFormRef = (form) => {

        this.form = form;
    };
    //填充表格行
    handleCreate = () => {
        const { dataSource, count } = this.state;
        const form = this.form;
        form.validateFields((err, values) => {

            if (err) {
                return;
            }
            values.user_id=0;

            AddUser(values).then(res=>{
                  let code =res.code;
                  if(code=='000000'){


                      message.success(res.status);
                      this.setState({ visible: false },()=>{
                          this.getData();

                      });
                  }else{
                      message.error(res.msg);
                  }
              },err=>{
                  message.error(err);
              });
        });
    };
    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };
    //批量删除
    MinusClick = () => {
        const { dataSource, selectedRowKeys } = this.state;

        console.log(selectedRowKeys);

    };
    //单个删除
    onDelete = (key) => {

            let obj={
                'user_id':key
            };

           DeleteUser(obj).then(res=>{
               let code =res.code;
               if(code=='000000'){

                    message.success(res.status);
               }else{
                   message.error(res.msg);
               }
           },err=>{
               message.error(err);
           });
    };
    //点击修改
    editClick = (key) => {

        const form = this.form;
        const { dataSource } = this.state;

        const index = catchIndex(dataSource, key);

        form.setFieldsValue({
            user_id: key,
            username: dataSource[index].username,
            password: dataSource[index].password,
            nickname: dataSource[index].nickname,
            phone: dataSource[index].phone,
            group_id: dataSource[index].group_id,
            status: dataSource[index].status,
        });
        this.setState({
            visible: true,
            tableRowKey: key,
            isUpdate: true,
        });
    };

    componentDidUpdate (){
    //    this.getData();
    }

    //更新修改
    handleUpdate = () => {
        const form = this.form;
     //   const { dataSource, tableRowKey } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            UpdateUser(values).then(res=>{
              let code =res.code;
              if(code=='000000'){

                  this.setState({
                      visible: false,
                  },()=>{
                      message.success(res.status);
                      this.getData();
                  });
              }else{
                  message.error(res.msg);
              }
          },err=>{
              message.error(err);
          });



        });
    };
    //单选框改变选择
    checkChange = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
        });

    };
    render(){
        const { userName,  dataSource, visible, isUpdate, loading } = this.state;

        return(
            <div>
                <BreadcrumbCustom paths={['系统管理','管理员管理']}/>
                <div className='formBody'>
                    <Row gutter={16}>
                        <Col className="gutter-row" sm={8}>
                            <Search
                                placeholder="请输入名称"
                                prefix={<Icon type="user" />}
                                value={userName}
                                onChange={this.onChangeUserName}
                            />
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <div className='plus' onClick={this.CreateItem}>
                            <Icon type="plus-circle" />
                        </div>
                        <div className='minus'>
                            <Popconfirm title="确定要批量删除吗?" onConfirm={this.MinusClick}>
                                <Icon type="minus-circle" />
                            </Popconfirm>
                        </div>
                        <div className='btnOpera'>
                            <Button type="primary" onClick={this.btnSearch_Click} style={{marginRight:'10px'}}>查询</Button>
                        </div>
                    </Row>
                    <FormTable
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        editClick={this.editClick}
                        loading={loading}
                    />
                    {isUpdate?
                        <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleUpdate} title="修改信息" okText="更新" isUpdate={true}
                    /> : <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleCreate} title="新建信息" okText="创建" isUpdate={false}
                    />}
                </div>
            </div>
        )
    }
}