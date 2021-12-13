import React, { useState, useEffect, useRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { Select, Card } from 'antd'

import { ChartEcharts } from '@/components/ChartEcharts'

import "./index.less"

const { Option } = Select;

export const QuotationsCard = React.memo((props) => {
    const { apiData, quotationData } = useSelector((state) => {
        return {
            quotationData: state?.apiData?.quotation,
        }
    }, shallowEqual)
    const [bestPrice, setBestPrice] = useState(props.bestPrice || 0)
    const [quotationsData, setQuotationsData] = useState()
    const chartEchartsRef = useRef()

    const updateQuotesView = (data) => {
        setBestPrice(Number(data))
    }
    // getQuotations
    useEffect(async () => {
        if (quotationData) {
            chartEchartsRef?.current?.updateChartOption(quotationData)
        }
    }, [quotationData])

    return (
        <Card className="css_card" title={(
            <div className="css_card_title">
                <Select
                    className="css_card_title_pair_select"
                    size="small"
                    showSearch
                    defaultValue="1"
                    style={{ width: 200 }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                >
                    <Option value="1">ICP/WICP</Option>
                    <Option value="2">Others</Option>
                </Select>
                <div className="css_card_title_price">price:{bestPrice}</div>
            </div>
        )} bordered={false}>
            {/* <ChartComponent data={quotationsData} /> */}
            {/* <ChartEcharts ref={chartEchartsRef} data={quotationsData} /> */}
            <ChartEcharts ref={chartEchartsRef} />
        </Card>
    )
})