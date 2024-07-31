import { Table } from 'antd';
import React from 'react'

const Options = ({ options }) => {
    console.log("in opt comp", options);
    const columns = [
        // {
        //     title: 'Id',
        //     dataIndex: 'id',
        // },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '25%',
        },
        {
            title: 'Correct',
            dataIndex: 'correct',
            // render: (typeof value === 'boolean') => renderBoolean(value)
            render: (text) => String(text),
            width: '25%',
        }
    ];
    return (
        <Table
            pagination={false}
            columns={columns}
            rowKey={(record) => {
                // console.log(record.id);
                return record.id
            }}
            dataSource={options}
            // expandable={{
            //   expandedRowRender: (record) => (
            //     <Options options={record.optionSet} />
            //   ),

            //   onExpand: (expanded, record) =>
            //     console.log("onExpand: ", record, expanded),
            // }}
            style={{ maxHeight: 'inherit', overflowX: 'auto' }}
            scroll={{ x: 'calc(100vh - 8em)' }}


        />
    )
}

export default Options