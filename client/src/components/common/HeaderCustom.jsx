import React, { Component } from 'react';
import { Layout, Icon, Menu, Badge } from 'antd';
import { Link } from 'react-router-dom';
import history from './history';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class HeaderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: false,
        }
        this.logout = this.logout.bind(this);
    }


    logout(){
        localStorage.removeItem("mspa_user");
        localStorage.removeItem("token");
        history.push('/login');
    }
    render(){
        return(
            <Header style={{ background: '#fff', padding: 0 }} className="header">

                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                   {/* <Menu.Item key="schedule">
                        <Link to="/app/header/Calendars">
                            <Badge count={3} overflowCount={99} style={{height:'15px',lineHeight:'15px'}}>
                                <Icon type="schedule" style={{fontSize:16, color: '#1DA57A' }}/>
                            </Badge>
                        </Link>
                    </Menu.Item>*/}
                    <SubMenu 
                        title={<span>
                            <Icon type="user" style={{fontSize:16, color: '#1DA57A' }}/>{this.props.username}
                        </span>}
                        >
                        <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                            <span onClick={this.logout}>退出登录</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
} 