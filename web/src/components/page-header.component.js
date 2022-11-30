import { ClearOutlined, EditOutlined, ExportOutlined, PlusCircleOutlined, PrinterOutlined, SaveOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Dropdown, Form, Input, Menu, PageHeader, Row, Space } from 'antd'
import _ from 'lodash'
import React, { useState } from 'react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTab } from 'utils/hooks'
import { isUpdatable } from '../utils'
import { genFormContent } from '../utils/antd'
import ModalFormButton from './button/modal-form.button'
import ModalPrintPreviewButton from './button/modal-print-preview.button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from '../utils/hooks'

export default ({
  title,
  subTitle,
  onCreate,
  onCreateMenu,
  onEdit,
  children,
  onPrintPreview,
  onPrint,
  searchInfo,
  search,
  onSave,
  searchForm,
  description,
  descriptions,
  extra
}) => {
  const [filterValues, setFilterValues] = useState({})
  const { user, store } = useSelector(state => ({
    user: state.system.user,
    store: state.system.store,
  }))
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const tabButton = useTab({ title })
  const recentItems = []
  const actions = []

  const searchMeta = useMemo(() => {
    if (search && search.schema) {
      const initialValues = {}
      const formItems = genFormContent(search.schema, 3, form, initialValues)
      return { formItems, initialValues }
    }
  }, [search && search.schema])
  if (tabButton && tabButton !== 'modal') {
    actions.push(tabButton)
  }
  if (extra) {
    actions.push(...extra)
  }
  if (onPrintPreview) {
    if (onPrintPreview.content) {
      actions.push(<ModalPrintPreviewButton
        key='onPrintPreview' 
        content={onPrintPreview.content}
        title={onPrintPreview.title}
        type='default' 
        icon={<PrinterOutlined />}>打印预览</ModalPrintPreviewButton>)
    } else {
      actions.push(<Button key='onPrintPreview' type='default' onClick={onPrintPreview} icon={<PrinterOutlined />}>打印预览</Button>)
    }
  }
  if (onCreate) {
    // TODO 有没有更合适的判断方式，这里的依据是创建要么以对话框，要么是以页面
    if (onCreate.schema) {
      actions.push(
        <ModalFormButton
          key='onCreate'
          type='primary'
          icon={<PlusCircleOutlined />}
          title={onCreate.title}
          initialValues={onCreate.initialValues}
          onSubmit={onCreate.onSubmit}
          schema={onCreate.schema}
        >新增</ModalFormButton>
      )
    } else {
      actions.push(<Button key='onCreate' type='primary' onClick={onCreate} icon={<PlusCircleOutlined />}>新增</Button>)
    }
  }
  if (onCreateMenu) {
    actions.push(
      <Dropdown
        key='onCreateMenu' 
        menu={{ items: onCreateMenu }}
        placement='bottomLeft' 
        trigger={['click']}>
        <Button type='primary' onClick={onCreate} icon={<PlusCircleOutlined />}>新增</Button>
      </Dropdown>
    )
  }
  if (onSave) {
    actions.push(<Button key='onSave' type='primary' onClick={onSave} icon={<SaveOutlined />}>保存</Button>)
  }
  if (isUpdatable(store, user) && onEdit) {
    if (Array.isArray(onEdit) && onEdit.length > 1) {
      actions.push(<Dropdown.Button key='onEdit' type='primary' onClick={onEdit[0].onClick} menu={{ items: onEdit.slice(1) }} >
        <EditOutlined />编辑
      </Dropdown.Button>)
    } else {
      actions.push(<Button key='onEdit' type='primary' onClick={onEdit} icon={<EditOutlined />}>编辑</Button>)
    }
  }
  if (onPrint) {
    actions.push(<Button key='onPrint' type='primary' onClick={onPrint} icon={<PrinterOutlined />}>打印</Button>)
  }
  const mSearchForm = React.createRef()
  const forms = []
  if (searchForm) {
    const { Form: SearchForm, initialValues, onSubmit, onExcelExport, ...otherSearchFormProps } = searchForm
    actions.push(<Button key='onReset' onClick={() => mSearchForm.current.reset()} icon={<ClearOutlined />}>重置</Button>)
    if (onExcelExport) {
      actions.push(<Button key='onExcelExport' onClick={onExcelExport} icon={<ExportOutlined />}>导出 Excel</Button>)
    }
    actions.push(<Button key='onSearch' type='primary' onClick={() => mSearchForm.current.submit()} icon={<SearchOutlined />}>查询</Button>)
    forms.push(
      <searchForm.Form key='searchForm' initialValues={searchForm.initialValues} ref={mSearchForm} onSubmit={searchForm.onSubmit} {...otherSearchFormProps} />
    )
  }
  if (searchMeta) {
      actions.push(<Button key='onReset' onClick={() => form.resetFields()} icon={<ClearOutlined />}>重置</Button>)
      actions.push(<Button key='onSearch' type='primary' onClick={() => form.submit()} icon={<SearchOutlined />}>查询</Button>)
  }
  return <>
  {tabButton === 'modal' 
  ? 
  <>
      {search && searchMeta
        ? (
          <Form colon={false} form={form} onFinish={search.onSubmit} initialValues={searchMeta.initialValues}>{searchMeta.formItems}</Form>
        )
        : <></>
      }
      {description ?
        <Descriptions>
          <Descriptions.Item label='出库项目'>abc</Descriptions.Item>
          <Descriptions.Item label='入库项目'>abc</Descriptions.Item>
        </Descriptions>
        : <></>}
      {descriptions ?
        <Descriptions size="small" column={3}>
          {descriptions.map(item => <Descriptions.Item key={item.label} label={item.label}>{item.children}</Descriptions.Item>)}
        </Descriptions>
        : null}
      {forms}
    </>
  :
    <PageHeader
      title={title}
      subTitle={subTitle}
      ghost={false}
      extra={<Space>{actions}</Space>}
    >
      <Helmet>
        <title>{subTitle ? `${subTitle} - ${title} - 赫拉管理系统` : `${title} - 赫拉管理系统`}</title>
      </Helmet>
      {search && searchMeta
        ? (
          <Form colon={false} form={form} onFinish={search.onSubmit} initialValues={searchMeta.initialValues}>{searchMeta.formItems}</Form>
        )
        : <></>
      }
      {description ?
        <Descriptions>
          <Descriptions.Item label='出库项目'>abc</Descriptions.Item>
          <Descriptions.Item label='入库项目'>abc</Descriptions.Item>
        </Descriptions>
        : <></>}
      {descriptions ?
        <Descriptions size="small" column={3}>
          {descriptions.map(item => <Descriptions.Item key={item.label} label={item.label}>{item.children}</Descriptions.Item>)}
        </Descriptions>
        : null}
      {forms}
    </PageHeader>
  }
    {searchInfo ?
      <Card bordered={false}>
        <Form
          onFinish={values => setFilterValues(values)}
          onReset={() => setFilterValues({})}
          form={form}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="名称"
                name="name"
              >
                <Input autoComplete='off' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space size="middle">
                <Button type='primary' htmlType='submit'>查询</Button>
                <Button htmlType='reset'>重置</Button>
              </Space>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Space>
                <span>最近搜索过：</span>
                {recentItems.map(item => (
                  <Button type='dashed' key={item}
                    onClick={() => {
                      form.setFieldsValue({ name: item })
                      form.submit()
                    }}
                  >{item}</Button>
                ))}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
      : <></>}
    {children ?
      <div style={{ padding: tabButton === 'modal' ? 0 : '8px' }}>
        {children}
      </div>
      : <></>}
  </>
}