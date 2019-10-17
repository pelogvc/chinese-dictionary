import React from 'react'
import { PageHeader } from 'antd'
import './TemplateMain.scss'

type TemplateMainProps = {
    title: string
    subTitle?: string
    children: any
}
function TemplateMain({ title, subTitle, children } : TemplateMainProps) {
    return (
        <div>
            <PageHeader
                style={{
                    borderBottom: '1px solid rgb(235, 237, 240)',
                }}
                title={title}
                subTitle={subTitle}
            />
            <div className="TemplateMain-contents">
                {children}
            </div>
        </div>
    )
}

export default TemplateMain
