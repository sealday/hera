import React from 'react'
import dayjs from 'dayjs'

/**
 * 购销打印头部
 * @param {*} param0 
 */
export const PurchasePrintHeader = ({
  name, seller, buyer, outDate, number, carNumber, originalOrder
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>销售单位：{seller}</td>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
          <tr>
            <td>采购单位：{buyer}</td>
            <td>车号：{carNumber}</td>
            <td>原始单号：{originalOrder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const PurchasePrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>销售单位（签名）：</td>
          <td>采购单位（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

  export const PurchasePrintLaw = ({
    name
  }) => (
      <>
        <span>说明：如供需双方未签正式合同，本{name}经供需双方代表签字确认后，将作为合同</span>
        <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。双方须核对</span>
        <span>以上产品规格、数量等信息确认后可签字认可。</span>
      </>
  )



/**
 * 盘点打印头部
 * @param {*} param0 
 */
export const StocktakingPrintHeader = ({
  name, outDate, number
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const StocktakingPrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>盘点人（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

export const StocktakingPrintLaw = () => (
  <>
    <span>说明：请确认仓库盘点数据正常，确认后可签名。</span>
  </>
)

/**
 * 维修打印头部
 * @param {*} param0 
 */
export const RepairPrintHeader = ({
  name, seller, buyer, outDate, number, carNumber, originalOrder
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>销售单位：{seller}</td>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
          <tr>
            <td>采购单位：{buyer}</td>
            <td>车号：{carNumber}</td>
            <td>原始单号：{originalOrder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const RepairPrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>销售单位（签名）：</td>
          <td>采购单位（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

  export const RepairPrintLaw = ({
    name
  }) => (
      <>
        <span>说明：如供需双方未签正式合同，本{name}经供需双方代表签字确认后，将作为合同</span>
        <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。双方须核对</span>
        <span>以上产品规格、数量等信息确认后可签字认可。</span>
      </>
  )

/**
 * 赔偿打印头部
 * @param {*} param0 
 */
export const RedressPrintHeader = ({
  name, seller, buyer, outDate, number, carNumber, originalOrder
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>销售单位：{seller}</td>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
          <tr>
            <td>采购单位：{buyer}</td>
            <td>车号：{carNumber}</td>
            <td>原始单号：{originalOrder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const RedressPrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>销售单位（签名）：</td>
          <td>采购单位（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

  export const RedressPrintLaw = ({
    name
  }) => (
      <>
        <span>说明：如供需双方未签正式合同，本{name}经供需双方代表签字确认后，将作为合同</span>
        <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。双方须核对</span>
        <span>以上产品规格、数量等信息确认后可签字认可。</span>
      </>
  )

/**
 * 暂存打印头部
 * @param {*} param0 
 */
export const FreeTransferPrintHeader = ({
  name, seller, buyer, outDate, number, carNumber, originalOrder
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>出库单位：{seller}</td>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
          <tr>
            <td>入库单位：{buyer}</td>
            <td>车号：{carNumber}</td>
            <td>原始单号：{originalOrder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const FreeTransferPrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>暂存入库单位（签名）：</td>
          <td>暂存出库单位（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

  export const FreeTransferPrintLaw = ({
    name
  }) => (
      <>
        <span>说明：如供需双方未签正式合同，本{name}经供需双方代表签字确认后，将作为合同</span>
        <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。双方须核对</span>
        <span>以上产品规格、数量等信息确认后可签字认可。</span>
      </>
  )

/**
 * 调拨打印头部
 * @param {*} param0 
 */
export const TransferPrintHeader = ({
  name, seller, buyer, outDate, number, carNumber, originalOrder
}) => (
    <>
      <h4 className="text-center">{name}</h4>
      <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
        <colgroup>
          <col style={{ width: '50%' }} />
        </colgroup>
        <tbody>
          <tr>
            <td>销售单位：{seller}</td>
            <td>日期：{dayjs(outDate).format('YYYY-MM-DD')}</td>
            <td>流水号：{number}</td>
          </tr>
          <tr>
            <td>采购单位：{buyer}</td>
            <td>车号：{carNumber}</td>
            <td>原始单号：{originalOrder}</td>
          </tr>
        </tbody>
      </table>
    </>
  )

export const TransferPrintFooter = ({
  username
}) => (
    <table style={{ tableLayout: 'fixed', fontSize: '11px', width: '100%' }}>
      <tbody>
        <tr>
          <td>制单人：{username}</td>
          <td>销售单位（签名）：</td>
          <td>采购单位（签名）：</td>
        </tr>
      </tbody>
    </table>
  )

  export const TransferPrintLaw = ({
    name
  }) => (
      <>
        <span>说明：如供需双方未签正式合同，本{name}经供需双方代表签字确认后，将作为合同</span>
        <span>及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。双方须核对</span>
        <span>以上产品规格、数量等信息确认后可签字认可。</span>
      </>
  )