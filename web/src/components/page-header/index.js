import { useTab } from 'utils/hooks'
import { PageHeaderComponent } from './page-header.component'

export default props => {
  const { title, subTitle, children } = props
  const [tabButtonType, tabButtonComponent] = useTab({ title, subTitle })
  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          paddingBottom: 10,
          backgroundColor: '#f0f2f5',
        }}
      >
        <PageHeaderComponent {...props} />
      </div>
      {children ? (
        <div
          style={{ padding: tabButtonType === 'modal' ? 0 : '0 8px 8px 8px' }}
        >
          {children}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
