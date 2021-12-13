import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import ReactEcharts from 'echarts-for-react';  // or var ReactECharts = require('echarts-for-react');

import './index.less';

const upColor = '#00da3c';
const downColor = '#ec0000';

const splitData = (rawData) => {
    let categoryData = [];
    let values = [];
    let volumes = [];
    for (let i = 0; i < rawData?.length || 0; i++) {
        let tmp = rawData[i];
        categoryData.push(tmp.date)
        values.push([tmp.open, tmp.close, tmp.low, tmp.high, tmp.volume]);
        volumes.push([i, tmp.volume, tmp.open > tmp.close ? 1 : -1]);
    }
    return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
    };
}
const calculateMA = (dayCount, data) => {
    var result = [];
    for (var i = 0, len = data?.values?.length || 0; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += data.values[i - j][1];
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    return result;
}
const getOption = (inData) => {
    // console.log('in-------getOption:',inData);
    // var data = fetch("https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/stock-DJI.json")
    // .then(response => response.json())
    // .then(data => this.splitData(data))
    var _data = splitData(inData);
    const option = {
        animation: false,
        legend: {
            bottom: 10,
            left: 'center',
            data: ['Dow-Jones index', 'MA5']
            // data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
                const obj = {
                    top: 10
                };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
            // extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: [
                {
                    xAxisIndex: 'all'
                }
            ],
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [
                {
                    value: 1,
                    color: downColor
                },
                {
                    value: -1,
                    color: upColor
                }
            ]
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '63%',
                height: '16%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: _data.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: _data.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                },
                min: function (value) {
                    return value.min - 0.5
                },
                max: function (value) {
                    return value.max + 0.5;
                },
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 50,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 50,
                end: 100
            }
        ],
        series: [
            {
                name: 'Dow-Jones index',
                type: 'candlestick',
                data: _data.values,
                itemStyle: {
                    color: upColor,
                    color0: downColor,
                    borderColor: undefined,
                    borderColor0: undefined
                },
                tooltip: {
                    formatter: function (param) {
                        param = param[0];
                        return [
                            'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            'Open: ' + param.data[0] + '<br/>',
                            'Close: ' + param.data[1] + '<br/>',
                            'Lowest: ' + param.data[2] + '<br/>',
                            'Highest: ' + param.data[3] + '<br/>'
                        ].join('');
                    }
                }
            },
            {
                name: 'MA5',
                type: 'line',
                data: calculateMA(5, _data),
                smooth: true,
                lineStyle: {
                    opacity: 0.5
                }
            },
            // {
            //     name: 'MA10',
            //     type: 'line',
            //     data: calculateMA(10, _data),
            //     smooth: true,
            //     lineStyle: {
            //         opacity: 0.5
            //     }
            // },
            // {
            //     name: 'MA20',
            //     type: 'line',
            //     data: calculateMA(20, _data),
            //     smooth: true,
            //     lineStyle: {
            //         opacity: 0.5
            //     }
            // },
            // {
            //     name: 'MA30',
            //     type: 'line',
            //     data: calculateMA(30, _data),
            //     smooth: true,
            //     lineStyle: {
            //         opacity: 0.5
            //     }
            // },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: _data.volumes
            }
        ]
    };

    return option;
}
export const ChartEcharts = forwardRef((props, ref) => {
    // const [sourceData, setSourceData] = useState(props.data || [])
    const [option, setOption] = useState(getOption())

    const onChartClick = (param, echarts) => {
        console.log('onChartClick:', param)
    }
    const onChartLegendselectchanged = (param, echarts) => {
        console.log('onChartLegendselectchanged:', param)
    }
    const onEvents = () => {
        return {
            'click': onChartClick.bind(this),
            'legendselectchanged': onChartLegendselectchanged.bind(this)
        }
    }
    useImperativeHandle(ref, () => ({
        updateChartOption: (data) => {
            // console.log('updateChartOption:',data);
            if (data) {
                setOption(getOption(data))    
            }
        }
    }))
    useEffect(() => {
    }, [])
    return (
        <div className="echartsRadar">
            <ReactEcharts
                option={option}
                notMerge={false}
                lazyUpdate={false}
                onEvents={onEvents()}
                style={{ width: '100%', height: '500px' }}
            />
        </div>
    )
})
