import React from 'react'
import { Menu, Icon } from 'antd'
import './Header.scss';
import logo from '../../assets/logo.png'
import useSetPage from '../../hooks/useSetPage';
import usePage from '../../hooks/usePage';

function Header() {

    const setPage = useSetPage();
    const page = usePage();

    const onSetPage = (name: string): void => {
        setPage(name)
    }

    return (
        <div className="Header">
                <div className='Header-logo'>
                    <img src={logo} alt="logo" />
                    <span>네이버중국어사전</span>
                </div>
                <Menu
                    style={{ width: 256, height: '100%' }}
                    defaultSelectedKeys={[ page.id ]}
                    defaultOpenKeys={['sub1']}
                    mode={'vertical'}
                    theme={'dark'}
                >
                    <Menu.Item key='wordbook' onClick={() => onSetPage('wordbook')}>
                        <Icon type="book" />
                        단어장
                    </Menu.Item>
                </Menu>
        </div>
    )
}

export default Header
