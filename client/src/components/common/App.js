import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import '../../style/index.less';

import SiderCustom from './SiderCustom';
import HeaderCustom from './HeaderCustom';
import noMatch from './404';
import AuthForm from 'pages/system/auth/Form'
import GroupForm from 'pages/system/group/Form'
import UserForm from 'pages/system/user/Form'
import MenuForm from 'pages/system/menu/Form'
import Welcome from 'pages/system/welcome/Welcome'

import {getUserInfo} from "api/User";
import { message } from 'antd';
const {Content, Footer} = Layout;

export default class App extends Component {
    state = {
        collapsed: false,
        username:''
    };
    componentDidMount(){


        //用户信息
        getUserInfo().then(res=>{
            let code =res.code;
            if(code=='000000'){
                this.setState({
                    username: res.data.username,
                });
            }else{
                message.error(res.msg);
            }
        },err=>{
            message.error(err);
        });



    }


    render() {
        const {username} = this.state;

        if (localStorage.getItem("accessToken") === null) {
            return <Redirect to="/login"/>
        }

        return (
            <Layout className="ant-layout-has-sider" style={{height: '100%'}}>
                <SiderCustom />
                <Layout>
                    <HeaderCustom   username={username}/>
                    <Content style={{margin: '0 16px'}}>
                        <Switch>

                            <Route exact path={'/app'} component={Welcome} />
                            <Route exact path={'/app/system/auth'} component={AuthForm} />
                            <Route exact path={'/app/system/group'} component={GroupForm} />
                            <Route exact path={'/app/system/user'} component={UserForm} />
                            <Route exact path={'/app/system/menu'} component={MenuForm} />
                            <Route exact path={'/form'} component={AuthForm} />
                            <Route component={noMatch} />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        SPA ©2017-2018 Created by WZ
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}
