import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { Table, Select, Collapse } from 'antd'
// import { format, parse } from 'date-fns'

import './index.less'

const { Panel } = Collapse;
const { Option } = Select;

export const TradingHistory = (props) => {
    const { isAuth, authToken } = useSelector((state) => {
        return {
            isAuth: state.auth.isAuth,
            authToken: state.auth.authToken
        }
    }, shallowEqual)
    const { onRowTdHis } = props;
    // const TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'
    const [size, setSize] = React.useState('default');
    const [tdHistoryDataSource, SetTdHistoryDataSource] = useState()
    const tableColumnsTdHistory = [
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            className: ''
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    function handleChange(value) {
        console.log(`Selected: ${value}`);
    }
    const children = [];
    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    useEffect(() => {
        let tdHistoryData = []
        let num = 20;
        // let valA = parse(a.time, TIME_FORMAT, new Date())

        for (let idx = 1; idx <= num; idx++) {
            tdHistoryData[idx] = {
                price: 0.1234 * (idx + num),
                quantity: idx,
                date: new Date(),
                key: idx,
            }
        }
        SetTdHistoryDataSource(tdHistoryData)
    }, [])
    return (
        <Collapse className='css_td_his_collapse' defaultActiveKey={['1']} >
            <Panel className='css_td_his_panel' header="Trading History" key="1">
                {/* <Select className='css_td_his_select' size={size} defaultValue="a1" onChange={handleChange} >
                    {children}
                </Select> */}
                <Table className='css_td_his_tab' size="small" pagination={false} bordered scroll={{ x: 100, y: 200 }} dataSource={tdHistoryDataSource} columns={tableColumnsTdHistory}
                    onRow={onRowTdHis} />
            </Panel>
        </Collapse>
    )
}