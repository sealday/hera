## 审批需求


### 一期审批

#### 背景说明

审批是一个长久以来的需求，是一种将大量企业口头动作落到系统中的一个重要途径。通过引入审批功能，我们可以规范化大家使用系统，合理使用系统，并且提供大量的使用数据
提供给决策使用。

实现基础的审批功能，主要是针对原本有的调拨单、采购单、销售单等，增加可选的审批流程，新增费用审批单，新增调拨计划单、采购计划单、销售计划单等

审批中包含的类型

费用、出差、采购、加班、用车、用章、外出、合同、物品领用、付款、物品维修、会议室预定等，在一期审批中，我们计划增加审批页面，第一期中直接
对不同的审批类型做特化处理。引入统一的审批界面，引入审批用通知界面。

在一期审批需求中，我们对审批对象的指定，审批的内容的指定，均使用固定指定的方式，不考虑任意级别的审批，不考虑支持模板审批，包含特定于调拨单、
采购单和销售单等内容的审批。

#### 实现

一期审批将引入审批用字段，为了简化开发流程，我们不引入审批用的表格，使用统一的字段名称，对多个 collection 中的审批进行归并处理。从一期审批开始，
我们引入客户端的支持，客户端使用 react native，在这个期间，我们对网络请求进行改造，在 web 端和客户端上，对基础库进行复用。

#### 界面
