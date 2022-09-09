print('migrate subject start')
const subjects = [
  {
    "subject_type": "资产",
    "key": "1001",
    "parent_key": "0",
    "name": "现金",
    "number": "1"
  },
  {
    "subject_type": "资产",
    "key": "1002",
    "parent_key": "0",
    "name": "银行",
    "number": "111"
  },
  {
    "subject_type": "资产",
    "key": "1002.01",
    "parent_key": "111",
    "name": "农业银行",
    "number": "1111"
  },
  {
    "subject_type": "资产",
    "key": "1002.02",
    "parent_key": "111",
    "name": "建设银行",
    "number": "11111"
  },
  {
    "subject_type": "资产",
    "key": "1003",
    "parent_key": "0",
    "name": "应收票据",
    "number": "111111"
  },
  {
    "subject_type": "资产",
    "key": "1004",
    "parent_key": "0",
    "name": "应收账款",
    "number": "1111111"
  },
  {
    "subject_type": "资产",
    "key": "1002.03",
    "parent_key": "111",
    "name": "平安银行",
    "number": "111111115"
  },
  {
    "subject_type": "资产",
    "key": "1002.04",
    "parent_key": "111",
    "name": "772卡",
    "number": "111111116"
  },
  {
    "subject_type": "资产",
    "key": "1002.05",
    "parent_key": "111",
    "name": "领隆平安银行",
    "number": "111111118"
  },
  {
    "subject_type": "资产",
    "key": "1005",
    "parent_key": "0",
    "name": "应收利息",
    "number": "111111119"
  },
  {
    "subject_type": "资产",
    "key": "1006",
    "parent_key": "0",
    "name": "其他应收款",
    "number": "111111120"
  },
  {
    "subject_type": "资产",
    "key": "1007",
    "parent_key": "0",
    "name": "固定资产",
    "number": "111111121"
  },
  {
    "subject_type": "资产",
    "key": "1008",
    "parent_key": "0",
    "name": "实收资本",
    "number": "111111227"
  },
  {
    "subject_type": "资产",
    "key": "1004.01",
    "parent_key": "1111111",
    "name": "2045 安微兆堃建筑科枝集团有限公司",
    "number": "111111282"
  },
  {
    "subject_type": "资产",
    "key": "1004.02",
    "parent_key": "1111111",
    "name": "2050 4*4方管【扣件合作公司】",
    "number": "111111283"
  },
  {
    "subject_type": "资产",
    "key": "1004.03",
    "parent_key": "1111111",
    "name": "3027 杨祖礼【中八南京城隍庙】",
    "number": "111111284"
  },
  {
    "subject_type": "资产",
    "key": "1004.04",
    "parent_key": "1111111",
    "name": "3029 陈举【中建八局海宁渡假村】",
    "number": "111111285"
  },
  {
    "subject_type": "资产",
    "key": "1004.05",
    "parent_key": "1111111",
    "name": "3036 潘金文【中八装饰宁波国际会议中心】",
    "number": "111111286"
  },
  {
    "subject_type": "资产",
    "key": "1004.06",
    "parent_key": "1111111",
    "name": "3037 潘金文【金典装饰上海艾力斯总部】",
    "number": "111111287"
  },
  {
    "subject_type": "资产",
    "key": "1004.07",
    "parent_key": "1111111",
    "name": "3039 潘金文【中八装饰上海西藏南路】",
    "number": "111111288"
  },
  {
    "subject_type": "资产",
    "key": "1004.08",
    "parent_key": "1111111",
    "name": "3047 上海誉良【中建八局南京NO.2019G61地块】",
    "number": "111111289"
  },
  {
    "subject_type": "资产",
    "key": "1004.09",
    "parent_key": "1111111",
    "name": "3048 上海誉良【中建八局南京湖滨路68号地块】",
    "number": "111111290"
  },
  {
    "subject_type": "资产",
    "key": "1004.10",
    "parent_key": "1111111",
    "name": "3054 上海兴鹏建筑工程有限公司【谢凤东】",
    "number": "111111291"
  },
  {
    "subject_type": "资产",
    "key": "1004.11",
    "parent_key": "1111111",
    "name": "4002 曾国民",
    "number": "111111292"
  },
  {
    "subject_type": "资产",
    "key": "1004.12",
    "parent_key": "1111111",
    "name": "4011 陈永忠（梓墨）",
    "number": "111111293"
  },
  {
    "subject_type": "资产",
    "key": "1004.13",
    "parent_key": "1111111",
    "name": "4012 陈志鹏",
    "number": "111111294"
  },
  {
    "subject_type": "资产",
    "key": "1004.14",
    "parent_key": "1111111",
    "name": "4016 郭兆兵",
    "number": "111111295"
  },
  {
    "subject_type": "资产",
    "key": "1004.15",
    "parent_key": "1111111",
    "name": "4031 上海苏辰",
    "number": "111111296"
  },
  {
    "subject_type": "资产",
    "key": "1004.16",
    "parent_key": "1111111",
    "name": "4033 上海枝星",
    "number": "111111297"
  },
  {
    "subject_type": "资产",
    "key": "1004.17",
    "parent_key": "1111111",
    "name": "4045 杨伙明",
    "number": "111111298"
  },
  {
    "subject_type": "资产",
    "key": "1004.18",
    "parent_key": "1111111",
    "name": "4049 叶肖均",
    "number": "111111299"
  },
  {
    "subject_type": "资产",
    "key": "1004.19",
    "parent_key": "1111111",
    "name": "4066 李智明",
    "number": "111111300"
  },
  {
    "subject_type": "资产",
    "key": "1004.20",
    "parent_key": "1111111",
    "name": "4072 俞洪松",
    "number": "111111301"
  },
  {
    "subject_type": "资产",
    "key": "1004.21",
    "parent_key": "1111111",
    "name": "5004 上海各都【嘉定城北居】",
    "number": "111111302"
  },
  {
    "subject_type": "资产",
    "key": "1004.22",
    "parent_key": "1111111",
    "name": "5011 上海盛轲",
    "number": "111111303"
  },
  {
    "subject_type": "资产",
    "key": "1004.23",
    "parent_key": "1111111",
    "name": "5012 上海盛轲【南通五建】",
    "number": "111111304"
  },
  {
    "subject_type": "资产",
    "key": "1004.24",
    "parent_key": "1111111",
    "name": "5013 上海盛轲【张家港】",
    "number": "111111305"
  },
  {
    "subject_type": "资产",
    "key": "1004.25",
    "parent_key": "1111111",
    "name": "5019 中建八局【徐泾28-02地块】方管合作",
    "number": "111111306"
  },
  {
    "subject_type": "资产",
    "key": "1004.26",
    "parent_key": "1111111",
    "name": "5022 中建八局【世博绿谷盘扣】",
    "number": "111111307"
  },
  {
    "subject_type": "资产",
    "key": "1004.27",
    "parent_key": "1111111",
    "name": "5028 中建三局【虹桥博万兰韵】盘扣",
    "number": "111111308"
  },
  {
    "subject_type": "资产",
    "key": "1004.28",
    "parent_key": "1111111",
    "name": "5028 中建三局【虹桥博万兰韵】轮扣",
    "number": "111111309"
  },
  {
    "subject_type": "资产",
    "key": "1004.29",
    "parent_key": "1111111",
    "name": "5035 中建三局【杭州鲁能国际】方管合作",
    "number": "111111310"
  },
  {
    "subject_type": "资产",
    "key": "1004.30",
    "parent_key": "1111111",
    "name": "5041 中建三局【杭州深蓝国际】",
    "number": "111111311"
  },
  {
    "subject_type": "资产",
    "key": "1004.31",
    "parent_key": "1111111",
    "name": "5045 中建三局【银城路船厂】",
    "number": "111111312"
  },
  {
    "subject_type": "资产",
    "key": "1004.32",
    "parent_key": "1111111",
    "name": "5046 中建三局【中信泰富】轮扣",
    "number": "111111313"
  },
  {
    "subject_type": "资产",
    "key": "1004.33",
    "parent_key": "1111111",
    "name": "5046 中建三局【中信泰富】盘扣",
    "number": "111111314"
  },
  {
    "subject_type": "资产",
    "key": "1004.34",
    "parent_key": "1111111",
    "name": "5053 中建三局【鄞州新城华侨城】",
    "number": "111111315"
  },
  {
    "subject_type": "资产",
    "key": "1004.35",
    "parent_key": "1111111",
    "name": "5054 中建三局【杭州临安青山湖】轮扣",
    "number": "111111316"
  },
  {
    "subject_type": "资产",
    "key": "1004.36",
    "parent_key": "1111111",
    "name": "5055 中建三局【杭州临安青山湖】盘扣",
    "number": "111111317"
  },
  {
    "subject_type": "资产",
    "key": "1004.37",
    "parent_key": "1111111",
    "name": "5059 中建八局【宿迁万达方管】",
    "number": "111111318"
  },
  {
    "subject_type": "资产",
    "key": "1004.38",
    "parent_key": "1111111",
    "name": "5061 上海盛轲【宝山顾村】",
    "number": "111111319"
  },
  {
    "subject_type": "资产",
    "key": "1004.39",
    "parent_key": "1111111",
    "name": "5063 中建八局【南京档案馆盘扣】",
    "number": "111111320"
  },
  {
    "subject_type": "资产",
    "key": "1004.40",
    "parent_key": "1111111",
    "name": "5070 河南鑫泰【余姚泗门嘉蜕城】",
    "number": "111111321"
  },
  {
    "subject_type": "资产",
    "key": "1004.41",
    "parent_key": "1111111",
    "name": "5077 中建三局【嘉善云帆大厦】",
    "number": "111111322"
  },
  {
    "subject_type": "资产",
    "key": "1004.42",
    "parent_key": "1111111",
    "name": "5078 中建三局【苏州苏地16号】",
    "number": "111111323"
  },
  {
    "subject_type": "资产",
    "key": "1004.43",
    "parent_key": "1111111",
    "name": "5079 中建三局【泰康人寿二期】",
    "number": "111111324"
  },
  {
    "subject_type": "资产",
    "key": "1004.44",
    "parent_key": "1111111",
    "name": "5082 中建三局【聚威工程】",
    "number": "111111325"
  },
  {
    "subject_type": "资产",
    "key": "1004.45",
    "parent_key": "1111111",
    "name": "5083 许平主【龙元建设集团富阳安置小区】",
    "number": "111111326"
  },
  {
    "subject_type": "资产",
    "key": "1004.46",
    "parent_key": "1111111",
    "name": "5085 上海坚固【清河湾三期动迁安置房】",
    "number": "111111327"
  },
  {
    "subject_type": "资产",
    "key": "1004.47",
    "parent_key": "1111111",
    "name": "5086 陈东明【中铁集团吉安庐陵人文谷】",
    "number": "111111328"
  },
  {
    "subject_type": "资产",
    "key": "1004.48",
    "parent_key": "1111111",
    "name": "5087 陈东明【中铁集团盐城站前】",
    "number": "111111329"
  },
  {
    "subject_type": "资产",
    "key": "1004.49",
    "parent_key": "1111111",
    "name": "5088 陈东明【中铁集团上海名车】",
    "number": "111111330"
  },
  {
    "subject_type": "资产",
    "key": "1004.50",
    "parent_key": "1111111",
    "name": "5091 帅乐煦【龙元建设集团】",
    "number": "111111331"
  },
  {
    "subject_type": "资产",
    "key": "1004.51",
    "parent_key": "1111111",
    "name": "5094 浙江中天【松江集成环保项目】",
    "number": "111111332"
  },
  {
    "subject_type": "资产",
    "key": "1004.52",
    "parent_key": "1111111",
    "name": "5096 上海建工【四方城27-1】",
    "number": "111111333"
  },
  {
    "subject_type": "资产",
    "key": "1004.53",
    "parent_key": "1111111",
    "name": "5097 中建铁路投资【湖州丝绸小镇】",
    "number": "111111334"
  },
  {
    "subject_type": "资产",
    "key": "1004.54",
    "parent_key": "1111111",
    "name": "5099 陈东明【中铁集团南京无线谷】",
    "number": "111111335"
  },
  {
    "subject_type": "资产",
    "key": "1004.55",
    "parent_key": "1111111",
    "name": "5100 陈东明【中铁集团淮安大同路国际社区】",
    "number": "111111336"
  },
  {
    "subject_type": "资产",
    "key": "1004.56",
    "parent_key": "1111111",
    "name": "5101 李德芳【龙元建设集团国际生态商务区】",
    "number": "111111337"
  },
  {
    "subject_type": "资产",
    "key": "1004.57",
    "parent_key": "1111111",
    "name": "5102 张义国【松江岳阳街道SJC10012单元】",
    "number": "111111338"
  },
  {
    "subject_type": "资产",
    "key": "1004.58",
    "parent_key": "1111111",
    "name": "5103 中建铁路投资【嘉善枫惠学校】",
    "number": "111111339"
  },
  {
    "subject_type": "资产",
    "key": "1004.59",
    "parent_key": "1111111",
    "name": "5104 上海誉良【中建八局福州滨海新城】",
    "number": "111111340"
  },
  {
    "subject_type": "资产",
    "key": "1004.60",
    "parent_key": "1111111",
    "name": "5105 鲁剑[华美达广场装修工程]",
    "number": "111111341"
  },
  {
    "subject_type": "资产",
    "key": "1004.61",
    "parent_key": "1111111",
    "name": "5106 张义国【中丽精工】",
    "number": "111111342"
  },
  {
    "subject_type": "资产",
    "key": "1004.62",
    "parent_key": "1111111",
    "name": "5107 李月飞",
    "number": "111111343"
  },
  {
    "subject_type": "资产",
    "key": "1004.63",
    "parent_key": "1111111",
    "name": "5108 陈小燕",
    "number": "111111344"
  },
  {
    "subject_type": "资产",
    "key": "1004.64",
    "parent_key": "1111111",
    "name": "5109 胡仁寿（鼎超架业）【人才公寓及小学】",
    "number": "111111345"
  },
  {
    "subject_type": "资产",
    "key": "1004.65",
    "parent_key": "1111111",
    "name": "5110 上海晓铂实业有限公司【张俊国】",
    "number": "111111346"
  },
  {
    "subject_type": "资产",
    "key": "1004.66",
    "parent_key": "1111111",
    "name": "5111 滁州市华乐建筑劳务有限公司【新桥镇明华路铁路下穿工程】",
    "number": "111111347"
  },
  {
    "subject_type": "资产",
    "key": "1004.67",
    "parent_key": "1111111",
    "name": "5116 上海凛盛实业有限公司【曾新生】",
    "number": "111111348"
  },
  {
    "subject_type": "资产",
    "key": "1004.68",
    "parent_key": "1111111",
    "name": "5117 上海建工五建集团【崇明长兴岛凤凰镇】",
    "number": "111111349"
  },
  {
    "subject_type": "资产",
    "key": "1004.69",
    "parent_key": "1111111",
    "name": "5118 张义国【中铁十五九亭小学】",
    "number": "111111350"
  },
  {
    "subject_type": "资产",
    "key": "1004.70",
    "parent_key": "1111111",
    "name": "5119 上海家树【嘉兴经开2021-03地块】",
    "number": "111111351"
  },
  {
    "subject_type": "资产",
    "key": "1004.71",
    "parent_key": "1111111",
    "name": "5120 上海家树【镜湖新区凤林西路8号地块】",
    "number": "111111352"
  },
  {
    "subject_type": "资产",
    "key": "1004.72",
    "parent_key": "1111111",
    "name": "5121 上海丰耀建设工程有限公司【丁茂恒】",
    "number": "111111353"
  },
  {
    "subject_type": "资产",
    "key": "1004.73",
    "parent_key": "1111111",
    "name": "5124 王文元",
    "number": "111111354"
  },
  {
    "subject_type": "资产",
    "key": "1004.74",
    "parent_key": "1111111",
    "name": "5126 李开端【中国安能集团有限公司】沃团沃丽酒店",
    "number": "111111355"
  },
  {
    "subject_type": "资产",
    "key": "1004.75",
    "parent_key": "1111111",
    "name": "5127 上海简良【日光铜业生产用房改扩建】",
    "number": "111111356"
  },
  {
    "subject_type": "资产",
    "key": "1004.76",
    "parent_key": "1111111",
    "name": "5128 潘金文【松江工地】",
    "number": "111111357"
  },
  {
    "subject_type": "资产",
    "key": "1004.77",
    "parent_key": "1111111",
    "name": "5130 上海家树【嘉兴市南湖渔里未来社区一期二标】",
    "number": "111111358"
  },
  {
    "subject_type": "资产",
    "key": "1004.78",
    "parent_key": "1111111",
    "name": "5131 中建一局【英诺赛科苏州项目】",
    "number": "111111359"
  },
  {
    "subject_type": "资产",
    "key": "1004.79",
    "parent_key": "1111111",
    "name": "5132 朱小波【松江区永丰街道类集建区01-02号动迁安置房】",
    "number": "111111360"
  },
  {
    "subject_type": "资产",
    "key": "1004.80",
    "parent_key": "1111111",
    "name": "5137 任丘市锦澳建筑器材有限公司【任少川】",
    "number": "111111361"
  },
  {
    "subject_type": "资产",
    "key": "1004.81",
    "parent_key": "1111111",
    "name": "5125 厦门博亿翔设备租赁有限公司【朱立星】",
    "number": "111111362"
  },
  {
    "subject_type": "负债",
    "key": "2001",
    "parent_key": "0",
    "name": "无息借款",
    "number": "111111122"
  },
  {
    "subject_type": "负债",
    "key": "2001.01",
    "parent_key": "111111122",
    "name": "许开仙",
    "number": "111111123"
  },
  {
    "subject_type": "负债",
    "key": "2002",
    "parent_key": "0",
    "name": "应付账款",
    "number": "111111127"
  },
  {
    "subject_type": "负债",
    "key": "2003",
    "parent_key": "0",
    "name": "应付工资",
    "number": "111111128"
  },
  {
    "subject_type": "负债",
    "key": "2004",
    "parent_key": "0",
    "name": "应交税费",
    "number": "111111129"
  },
  {
    "subject_type": "负债",
    "key": "2004.01",
    "parent_key": "111111129",
    "name": "应交增值税-进项税",
    "number": "111111130"
  },
  {
    "subject_type": "负债",
    "key": "2004.02",
    "parent_key": "111111129",
    "name": "应交增值税-销项税",
    "number": "111111131"
  },
  {
    "subject_type": "负债",
    "key": "2004.03",
    "parent_key": "111111129",
    "name": "附加税",
    "number": "111111132"
  },
  {
    "subject_type": "负债",
    "key": "2004.04",
    "parent_key": "111111129",
    "name": "个人所得税",
    "number": "111111133"
  },
  {
    "subject_type": "负债",
    "key": "2005",
    "parent_key": "0",
    "name": "应付利息",
    "number": "111111134"
  },
  {
    "subject_type": "负债",
    "key": "2005.01",
    "parent_key": "111111134",
    "name": "陈秋鲤",
    "number": "111111135"
  },
  {
    "subject_type": "负债",
    "key": "2005.02",
    "parent_key": "111111134",
    "name": "陈秋松",
    "number": "111111136"
  },
  {
    "subject_type": "负债",
    "key": "2005.03",
    "parent_key": "111111134",
    "name": "陈丽霞",
    "number": "111111137"
  },
  {
    "subject_type": "负债",
    "key": "2005.04",
    "parent_key": "111111134",
    "name": "谢庆华",
    "number": "111111138"
  },
  {
    "subject_type": "负债",
    "key": "2005.05",
    "parent_key": "111111134",
    "name": "王兴荣",
    "number": "111111139"
  },
  {
    "subject_type": "负债",
    "key": "2005.06",
    "parent_key": "111111134",
    "name": "张静",
    "number": "111111140"
  },
  {
    "subject_type": "负债",
    "key": "2005.07",
    "parent_key": "111111134",
    "name": "张琳",
    "number": "111111141"
  },
  {
    "subject_type": "负债",
    "key": "2005.08",
    "parent_key": "111111134",
    "name": "包国新",
    "number": "111111142"
  },
  {
    "subject_type": "负债",
    "key": "2005.09",
    "parent_key": "111111134",
    "name": "王育新",
    "number": "111111143"
  },
  {
    "subject_type": "负债",
    "key": "2005.10",
    "parent_key": "111111134",
    "name": "内部员工",
    "number": "111111144"
  },
  {
    "subject_type": "负债",
    "key": "2005.11",
    "parent_key": "111111134",
    "name": "张春辉",
    "number": "111111145"
  },
  {
    "subject_type": "负债",
    "key": "2005.12",
    "parent_key": "111111134",
    "name": "张正富",
    "number": "111111146"
  },
  {
    "subject_type": "负债",
    "key": "2005.13",
    "parent_key": "111111134",
    "name": "陈秋旗",
    "number": "111111147"
  },
  {
    "subject_type": "负债",
    "key": "2005.14",
    "parent_key": "111111134",
    "name": "张志良",
    "number": "111111148"
  },
  {
    "subject_type": "负债",
    "key": "2005.15",
    "parent_key": "111111134",
    "name": "吴良立",
    "number": "111111149"
  },
  {
    "subject_type": "负债",
    "key": "2005.16",
    "parent_key": "111111134",
    "name": "张玉华",
    "number": "111111150"
  },
  {
    "subject_type": "负债",
    "key": "2005.17",
    "parent_key": "111111134",
    "name": "薛国坤",
    "number": "111111151"
  },
  {
    "subject_type": "负债",
    "key": "2005.18",
    "parent_key": "111111134",
    "name": "王莉",
    "number": "111111153"
  },
  {
    "subject_type": "负债",
    "key": "2005.19",
    "parent_key": "111111134",
    "name": "潘金文",
    "number": "111111154"
  },
  {
    "subject_type": "负债",
    "key": "2005.20",
    "parent_key": "111111134",
    "name": "唐胜良",
    "number": "111111155"
  },
  {
    "subject_type": "负债",
    "key": "2005.21",
    "parent_key": "111111134",
    "name": "林明星",
    "number": "111111156"
  },
  {
    "subject_type": "负债",
    "key": "2005.22",
    "parent_key": "111111134",
    "name": "张正芦",
    "number": "111111157"
  },
  {
    "subject_type": "负债",
    "key": "2005.23",
    "parent_key": "111111134",
    "name": "俞建兴",
    "number": "111111158"
  },
  {
    "subject_type": "负债",
    "key": "2006",
    "parent_key": "0",
    "name": "有息借款",
    "number": "111111159"
  },
  {
    "subject_type": "负债",
    "key": "2006.01",
    "parent_key": "111111159",
    "name": "陈秋鲤",
    "number": "111111160"
  },
  {
    "subject_type": "负债",
    "key": "2006.02",
    "parent_key": "111111159",
    "name": "陈秋松",
    "number": "111111161"
  },
  {
    "subject_type": "负债",
    "key": "2006.03",
    "parent_key": "111111159",
    "name": "陈丽霞",
    "number": "111111162"
  },
  {
    "subject_type": "负债",
    "key": "2006.04",
    "parent_key": "111111159",
    "name": "谢庆华",
    "number": "111111163"
  },
  {
    "subject_type": "负债",
    "key": "2006.05",
    "parent_key": "111111159",
    "name": "王兴荣",
    "number": "111111164"
  },
  {
    "subject_type": "负债",
    "key": "2006.06",
    "parent_key": "111111159",
    "name": "张琳",
    "number": "111111165"
  },
  {
    "subject_type": "负债",
    "key": "2006.07",
    "parent_key": "111111159",
    "name": "包国新",
    "number": "111111166"
  },
  {
    "subject_type": "负债",
    "key": "2006.08",
    "parent_key": "111111159",
    "name": "王育新",
    "number": "111111167"
  },
  {
    "subject_type": "负债",
    "key": "2006.09",
    "parent_key": "111111159",
    "name": "内部员工",
    "number": "111111168"
  },
  {
    "subject_type": "负债",
    "key": "2006.10",
    "parent_key": "111111159",
    "name": "张春辉",
    "number": "111111169"
  },
  {
    "subject_type": "负债",
    "key": "2006.11",
    "parent_key": "111111159",
    "name": "张正富",
    "number": "111111170"
  },
  {
    "subject_type": "负债",
    "key": "2006.12",
    "parent_key": "111111159",
    "name": "陈秋旗",
    "number": "111111171"
  },
  {
    "subject_type": "负债",
    "key": "2006.13",
    "parent_key": "111111159",
    "name": "张志良",
    "number": "111111172"
  },
  {
    "subject_type": "负债",
    "key": "2006.14",
    "parent_key": "111111159",
    "name": "吴良立",
    "number": "111111173"
  },
  {
    "subject_type": "负债",
    "key": "2006.15",
    "parent_key": "111111159",
    "name": "张玉华",
    "number": "111111174"
  },
  {
    "subject_type": "负债",
    "key": "2006.16",
    "parent_key": "111111159",
    "name": "薛国坤",
    "number": "111111175"
  },
  {
    "subject_type": "负债",
    "key": "2006.17",
    "parent_key": "111111159",
    "name": "王莉",
    "number": "111111177"
  },
  {
    "subject_type": "负债",
    "key": "2006.18",
    "parent_key": "111111159",
    "name": "潘金文",
    "number": "111111178"
  },
  {
    "subject_type": "负债",
    "key": "2006.19",
    "parent_key": "111111159",
    "name": "张静",
    "number": "111111179"
  },
  {
    "subject_type": "负债",
    "key": "2006.20",
    "parent_key": "111111159",
    "name": "唐胜良",
    "number": "111111180"
  },
  {
    "subject_type": "负债",
    "key": "2006.21",
    "parent_key": "111111159",
    "name": "林明星",
    "number": "111111181"
  },
  {
    "subject_type": "负债",
    "key": "2006.22",
    "parent_key": "111111159",
    "name": "张正芦",
    "number": "111111182"
  },
  {
    "subject_type": "负债",
    "key": "2006.23",
    "parent_key": "111111159",
    "name": "张春敏",
    "number": "111111183"
  },
  {
    "subject_type": "负债",
    "key": "2007",
    "parent_key": "0",
    "name": "应付运费",
    "number": "111111216"
  },
  {
    "subject_type": "负债",
    "key": "2008",
    "parent_key": "0",
    "name": "应付票据",
    "number": "111111217"
  },
  {
    "subject_type": "负债",
    "key": "2009",
    "parent_key": "0",
    "name": "合同押金",
    "number": "111111226"
  },
  {
    "subject_type": "负债",
    "key": "2006.24",
    "parent_key": "111111159",
    "name": "农行贷款",
    "number": "111111232"
  },
  {
    "subject_type": "负债",
    "key": "2006.25",
    "parent_key": "111111159",
    "name": "建行贷款",
    "number": "111111233"
  },
  {
    "subject_type": "负债",
    "key": "2006.26",
    "parent_key": "111111159",
    "name": "红旗车贷",
    "number": "111111234"
  },
  {
    "subject_type": "负债",
    "key": "2006.27",
    "parent_key": "111111159",
    "name": "深圳前海微众银行股份有限公司（贷款）",
    "number": "111111235"
  },
  {
    "subject_type": "负债",
    "key": "2002.01",
    "parent_key": "111111127",
    "name": "2004 陈丽霞固租",
    "number": "111111236"
  },
  {
    "subject_type": "负债",
    "key": "2002.02",
    "parent_key": "111111127",
    "name": "2010 黄朝扬固租",
    "number": "111111237"
  },
  {
    "subject_type": "负债",
    "key": "2002.03",
    "parent_key": "111111127",
    "name": "2019 内部员工固租",
    "number": "111111238"
  },
  {
    "subject_type": "负债",
    "key": "2002.04",
    "parent_key": "111111127",
    "name": "2022 齐国林固租",
    "number": "111111239"
  },
  {
    "subject_type": "负债",
    "key": "2002.05",
    "parent_key": "111111127",
    "name": "2025 唐胜良固租",
    "number": "111111240"
  },
  {
    "subject_type": "负债",
    "key": "2002.06",
    "parent_key": "111111127",
    "name": "2027 王兴荣固租",
    "number": "111111241"
  },
  {
    "subject_type": "负债",
    "key": "2002.07",
    "parent_key": "111111127",
    "name": "2034 张玉华固租",
    "number": "111111242"
  },
  {
    "subject_type": "负债",
    "key": "2002.08",
    "parent_key": "111111127",
    "name": "2036 郑进九固租",
    "number": "111111243"
  },
  {
    "subject_type": "负债",
    "key": "2002.09",
    "parent_key": "111111127",
    "name": "2040 张正富固租",
    "number": "111111244"
  },
  {
    "subject_type": "负债",
    "key": "2002.10",
    "parent_key": "111111127",
    "name": "2041 张春敏固租",
    "number": "111111245"
  },
  {
    "subject_type": "负债",
    "key": "2002.11",
    "parent_key": "111111127",
    "name": "2046 张正芦固租",
    "number": "111111246"
  },
  {
    "subject_type": "负债",
    "key": "2002.12",
    "parent_key": "111111127",
    "name": "2047 佘锐",
    "number": "111111247"
  },
  {
    "subject_type": "负债",
    "key": "2002.13",
    "parent_key": "111111127",
    "name": "2048 林金同",
    "number": "111111248"
  },
  {
    "subject_type": "负债",
    "key": "2002.14",
    "parent_key": "111111127",
    "name": "2049 佘剑仁",
    "number": "111111249"
  },
  {
    "subject_type": "负债",
    "key": "2002.15",
    "parent_key": "111111127",
    "name": "3055 4*4方管【方管合作公司】",
    "number": "111111251"
  },
  {
    "subject_type": "负债",
    "key": "2002.16",
    "parent_key": "111111127",
    "name": "4001 蔡建华",
    "number": "111111252"
  },
  {
    "subject_type": "负债",
    "key": "2002.17",
    "parent_key": "111111127",
    "name": "4006 陈建新",
    "number": "111111253"
  },
  {
    "subject_type": "负债",
    "key": "2002.18",
    "parent_key": "111111127",
    "name": "4015 郭洪辉",
    "number": "111111254"
  },
  {
    "subject_type": "负债",
    "key": "2002.19",
    "parent_key": "111111127",
    "name": "4017 黄国华",
    "number": "111111255"
  },
  {
    "subject_type": "负债",
    "key": "2002.20",
    "parent_key": "111111127",
    "name": "4019 蒋志强",
    "number": "111111256"
  },
  {
    "subject_type": "负债",
    "key": "2002.21",
    "parent_key": "111111127",
    "name": "4020 林国灿",
    "number": "111111257"
  },
  {
    "subject_type": "负债",
    "key": "2002.22",
    "parent_key": "111111127",
    "name": "4028 上海灵瑞",
    "number": "111111258"
  },
  {
    "subject_type": "负债",
    "key": "2002.23",
    "parent_key": "111111127",
    "name": "4034 佘剑佳",
    "number": "111111259"
  },
  {
    "subject_type": "负债",
    "key": "2002.24",
    "parent_key": "111111127",
    "name": "4041 吴鸿鸣",
    "number": "111111260"
  },
  {
    "subject_type": "负债",
    "key": "2002.25",
    "parent_key": "111111127",
    "name": "4042 肖金城",
    "number": "111111261"
  },
  {
    "subject_type": "负债",
    "key": "2002.26",
    "parent_key": "111111127",
    "name": "4045 杨伙明",
    "number": "111111262"
  },
  {
    "subject_type": "负债",
    "key": "2002.27",
    "parent_key": "111111127",
    "name": "4051 张荣贵",
    "number": "111111263"
  },
  {
    "subject_type": "负债",
    "key": "2002.28",
    "parent_key": "111111127",
    "name": "4055 郑清林",
    "number": "111111264"
  },
  {
    "subject_type": "负债",
    "key": "2002.29",
    "parent_key": "111111127",
    "name": "4058 厦门三九盘扣工程枝术有限公司【朱立星】",
    "number": "111111265"
  },
  {
    "subject_type": "负债",
    "key": "2002.30",
    "parent_key": "111111127",
    "name": "4060 上海玉湖【陈】",
    "number": "111111266"
  },
  {
    "subject_type": "负债",
    "key": "2002.31",
    "parent_key": "111111127",
    "name": "4069 张琳",
    "number": "111111267"
  },
  {
    "subject_type": "负债",
    "key": "2002.32",
    "parent_key": "111111127",
    "name": "4070 苏一新",
    "number": "111111268"
  },
  {
    "subject_type": "负债",
    "key": "2002.33",
    "parent_key": "111111127",
    "name": "4071 王才兴",
    "number": "111111269"
  },
  {
    "subject_type": "负债",
    "key": "2002.34",
    "parent_key": "111111127",
    "name": "4074 上海诚泉脚手架租赁",
    "number": "111111270"
  },
  {
    "subject_type": "负债",
    "key": "2002.35",
    "parent_key": "111111127",
    "name": "4075 上海朋江钢镆租赁有限公司",
    "number": "111111271"
  },
  {
    "subject_type": "负债",
    "key": "2002.36",
    "parent_key": "111111127",
    "name": "5009 上海家树【无锡万科】",
    "number": "111111272"
  },
  {
    "subject_type": "负债",
    "key": "2002.37",
    "parent_key": "111111127",
    "name": "5048 中建三局【租赁站】",
    "number": "111111273"
  },
  {
    "subject_type": "负债",
    "key": "2002.38",
    "parent_key": "111111127",
    "name": "5075 陈东明【中铁集团福建段房建二标】",
    "number": "111111274"
  },
  {
    "subject_type": "负债",
    "key": "2002.39",
    "parent_key": "111111127",
    "name": "5098 张义国【江苏荣达特安电子1#2#3】",
    "number": "111111275"
  },
  {
    "subject_type": "负债",
    "key": "2002.40",
    "parent_key": "111111127",
    "name": "5112 王莉",
    "number": "111111276"
  },
  {
    "subject_type": "负债",
    "key": "2002.41",
    "parent_key": "111111127",
    "name": "5113 张静",
    "number": "111111277"
  },
  {
    "subject_type": "负债",
    "key": "2002.42",
    "parent_key": "111111127",
    "name": "5114 陈杰",
    "number": "111111278"
  },
  {
    "subject_type": "负债",
    "key": "2002.43",
    "parent_key": "111111127",
    "name": "5122 陈斌",
    "number": "111111279"
  },
  {
    "subject_type": "负债",
    "key": "2002.44",
    "parent_key": "111111127",
    "name": "5123 王建展",
    "number": "111111280"
  },
  {
    "subject_type": "负债",
    "key": "2002.45",
    "parent_key": "111111127",
    "name": "5129 闽候县祥丰实验仪器销售中心【朱立星】",
    "number": "111111281"
  },
  {
    "subject_type": "负债",
    "key": "2002.46",
    "parent_key": "111111127",
    "name": "张正富（报销）",
    "number": "111111363"
  },
  {
    "subject_type": "损益",
    "key": "4001",
    "parent_key": "0",
    "name": "主营业务收入",
    "number": "111111187"
  },
  {
    "subject_type": "损益",
    "key": "4001.01",
    "parent_key": "111111187",
    "name": "租金",
    "number": "111111188"
  },
  {
    "subject_type": "损益",
    "key": "4002",
    "parent_key": "0",
    "name": "其他业务收入",
    "number": "111111189"
  },
  {
    "subject_type": "损益",
    "key": "4003",
    "parent_key": "0",
    "name": "营业外收入",
    "number": "111111190"
  },
  {
    "subject_type": "损益",
    "key": "4004",
    "parent_key": "0",
    "name": "主营业务成本",
    "number": "111111191"
  },
  {
    "subject_type": "损益",
    "key": "4004.01",
    "parent_key": "111111191",
    "name": "运费",
    "number": "111111192"
  },
  {
    "subject_type": "损益",
    "key": "4004.02",
    "parent_key": "111111191",
    "name": "租金",
    "number": "111111193"
  },
  {
    "subject_type": "损益",
    "key": "4004.03",
    "parent_key": "111111191",
    "name": "低值易耗品",
    "number": "111111194"
  },
  {
    "subject_type": "损益",
    "key": "4004.04",
    "parent_key": "111111191",
    "name": "过路费",
    "number": "111111195"
  },
  {
    "subject_type": "损益",
    "key": "4005",
    "parent_key": "0",
    "name": "其他业务成本",
    "number": "111111196"
  },
  {
    "subject_type": "损益",
    "key": "4006",
    "parent_key": "0",
    "name": "营业税金及附加",
    "number": "111111197"
  },
  {
    "subject_type": "损益",
    "key": "4007",
    "parent_key": "0",
    "name": "管理费用",
    "number": "111111198"
  },
  {
    "subject_type": "损益",
    "key": "4007.01",
    "parent_key": "111111198",
    "name": "办公费",
    "number": "111111199"
  },
  {
    "subject_type": "损益",
    "key": "4007.02",
    "parent_key": "111111198",
    "name": "水电费",
    "number": "111111200"
  },
  {
    "subject_type": "损益",
    "key": "4007.03",
    "parent_key": "111111198",
    "name": "油费",
    "number": "111111201"
  },
  {
    "subject_type": "损益",
    "key": "4007.04",
    "parent_key": "111111198",
    "name": "房租费",
    "number": "111111204"
  },
  {
    "subject_type": "损益",
    "key": "4007.05",
    "parent_key": "111111198",
    "name": "个人所得税",
    "number": "111111205"
  },
  {
    "subject_type": "损益",
    "key": "4007.06",
    "parent_key": "111111198",
    "name": "社保",
    "number": "111111207"
  },
  {
    "subject_type": "损益",
    "key": "4007.07",
    "parent_key": "111111198",
    "name": "公积金",
    "number": "111111208"
  },
  {
    "subject_type": "损益",
    "key": "4007.08",
    "parent_key": "111111198",
    "name": "场地租赁费",
    "number": "111111209"
  },
  {
    "subject_type": "损益",
    "key": "4007.09",
    "parent_key": "111111198",
    "name": "诉讼费",
    "number": "111111210"
  },
  {
    "subject_type": "损益",
    "key": "4007.10",
    "parent_key": "111111198",
    "name": "咨询费",
    "number": "111111211"
  },
  {
    "subject_type": "损益",
    "key": "4007.11",
    "parent_key": "111111198",
    "name": "车船税",
    "number": "111111214"
  },
  {
    "subject_type": "损益",
    "key": "4007.12",
    "parent_key": "111111198",
    "name": "折旧费",
    "number": "111111215"
  },
  {
    "subject_type": "损益",
    "key": "4008",
    "parent_key": "0",
    "name": "易耗品",
    "number": "111111218"
  },
  {
    "subject_type": "损益",
    "key": "4009",
    "parent_key": "0",
    "name": "财务费用",
    "number": "111111219"
  },
  {
    "subject_type": "损益",
    "key": "4010",
    "parent_key": "0",
    "name": "差旅费",
    "number": "111111220"
  },
  {
    "subject_type": "损益",
    "key": "4011",
    "parent_key": "0",
    "name": "福利费",
    "number": "111111221"
  },
  {
    "subject_type": "损益",
    "key": "4012",
    "parent_key": "0",
    "name": "工具机械",
    "number": "111111222"
  },
  {
    "subject_type": "损益",
    "key": "4013",
    "parent_key": "0",
    "name": "其他费用",
    "number": "111111223"
  },
  {
    "subject_type": "损益",
    "key": "4014",
    "parent_key": "0",
    "name": "业务费用",
    "number": "111111224"
  },
  {
    "subject_type": "损益",
    "key": "4015",
    "parent_key": "0",
    "name": "挂靠费",
    "number": "111111225"
  }
]

const result = []
subjects.forEach(subject => {
  if (subject.parent_key === '0') {
    result.push({
      type: subject.subject_type,
      name: subject.name,
      id: subject.key,
      parentId: '-1',
    })
  } else {
    const parentId = subjects.find(item => item.number === subject.parent_key).key
    result.push({
      type: subject.subject_type,
      name: subject.name,
      id: subject.key,
      parentId: parentId,
    })
  }
})
print(JSON.stringify(result, null, 4))
db.subjects.insertMany(result)
print('migrate subject done.')