import React from 'react'
import { Menu, Icon, Switch } from 'antd'
import './Header.scss';
import logo from '../../assets/logo.png'

function Header() {
    return (
        <div className="Header">
                <div className='Header-logo'>
                    <img src={logo} />
                    <span>네이버중국어사전</span>
                </div>
                <Menu
                    style={{ width: 256, height: '100%' }}
                    defaultSelectedKeys={[]}
                    defaultOpenKeys={['sub1']}
                    mode={'vertical'}
                    theme={'dark'}
                >
                    <Menu.Item key="1">
                        <Icon type="book" />
                        단어장
                    </Menu.Item>
                </Menu>
        </div>
    )
}

export default Header
