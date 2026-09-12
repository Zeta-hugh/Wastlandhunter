const VEHICLES=[
 {name:'破风巡逻车',max:360,spd:142,armor:4,load:12,body:'#6c745f',turret:'round',track:'light'},
 {name:'沙狐 Mk.I',max:520,spd:160,armor:6,load:15,body:'#858d5e',turret:'low',track:'light'},
 {name:'赤角突击车',max:690,spd:150,armor:8,load:18,body:'#9d4c40',turret:'wedge',track:'medium'},
 {name:'白鸽救护战车',max:760,spd:146,armor:9,load:19,body:'#d8ddd7',turret:'box',track:'medium'},
 {name:'矿鼹钻地车',max:930,spd:132,armor:12,load:22,body:'#6b5f50',turret:'drill',track:'heavy'},
 {name:'绯红竞技战车',max:1080,spd:165,armor:13,load:23,body:'#ad433b',turret:'wedge',track:'medium'},
 {name:'风葬者',max:1220,spd:180,armor:13,load:22,body:'#526f68',turret:'aa',track:'light'},
 {name:'白夜雪虎机',max:1450,spd:154,armor:17,load:27,body:'#a6b8bb',turret:'round',track:'snow'},
 {name:'炼城火蜥',max:1690,spd:148,armor:20,load:30,body:'#8a5d37',turret:'flame',track:'heavy'},
 {name:'天穹轨炮车',max:1940,spd:151,armor:22,load:32,body:'#667287',turret:'rail',track:'heavy'},
 {name:'零号荒神',max:2450,spd:158,armor:27,load:36,body:'#434b50',turret:'fortress',track:'heavy'}
];
const BOSS_STATS=[
 {hp:330,atk:24,bounty:900},{hp:560,atk:36,bounty:1500},{hp:820,atk:49,bounty:2300},{hp:1160,atk:63,bounty:3500},{hp:1540,atk:77,bounty:5200},{hp:2020,atk:92,bounty:7600},{hp:2500,atk:108,bounty:10500},{hp:3100,atk:126,bounty:14500},{hp:3850,atk:148,bounty:20000},{hp:5200,atk:176,bounty:32000}
];

const PARTS={
 main:[
  {id:'m0',name:'57mm 旧式炮',power:38,weight:2.6,acc:88,crit:4,rarity:0},
  {id:'m1',name:'豺狼 75mm 炮',power:56,weight:3.1,acc:90,crit:7,rarity:1},
  {id:'m2',name:'赤角穿甲炮',power:78,weight:4.0,acc:87,crit:8,rarity:2},
  {id:'m3',name:'塞壬脉冲炮',power:101,weight:4.3,acc:94,crit:9,rarity:2},
  {id:'m4',name:'矿鼹钻芯炮',power:132,weight:5.8,acc:86,crit:12,rarity:3},
  {id:'m5',name:'绯红 120mm',power:168,weight:6.5,acc:91,crit:13,rarity:3},
  {id:'m6',name:'风葬高射炮',power:196,weight:6.1,acc:96,crit:10,rarity:3},
  {id:'m7',name:'白夜冷凝炮',power:230,weight:7.4,acc:93,crit:11,rarity:4},
  {id:'m8',name:'火蜥燃烧炮',power:272,weight:8.2,acc:89,crit:12,rarity:4},
  {id:'m9',name:'天穹磁轨炮',power:335,weight:9.5,acc:97,crit:18,rarity:5},
  {id:'m10',name:'荒神 220mm',power:430,weight:11.8,acc:94,crit:20,rarity:5}
 ],
 sub:[
  {id:'s0',name:'旧式机枪',power:20,weight:1.1,acc:92,crit:3,rarity:0},{id:'s1',name:'双联机枪',power:31,weight:1.4,acc:93,crit:4,rarity:1},{id:'s2',name:'盐砂链炮',power:44,weight:1.9,acc:92,crit:5,rarity:1},{id:'s3',name:'医疗警戒枪',power:58,weight:2.0,acc:97,crit:5,rarity:2},{id:'s4',name:'碎石六管炮',power:72,weight:2.5,acc:90,crit:6,rarity:2},{id:'s5',name:'竞技连射炮',power:92,weight:2.8,acc:94,crit:8,rarity:3},{id:'s6',name:'风暴链炮',power:112,weight:2.9,acc:97,crit:7,rarity:3},{id:'s7',name:'白夜自动炮',power:134,weight:3.4,acc:96,crit:8,rarity:4},{id:'s8',name:'耐热链炮',power:158,weight:3.8,acc:93,crit:9,rarity:4},{id:'s9',name:'磁轨近防炮',power:188,weight:4.1,acc:98,crit:11,rarity:5},{id:'s10',name:'荒神蜂巢炮',power:230,weight:4.7,acc:96,crit:13,rarity:5}
 ],
 se:[
  {id:'e0',name:'土制火箭',power:50,weight:2.0,acc:82,crit:8,rarity:0},{id:'e1',name:'豺狼导弹',power:76,weight:2.4,acc:86,crit:9,rarity:1},{id:'e2',name:'盐爆火箭',power:104,weight:3.1,acc:84,crit:10,rarity:2},{id:'e3',name:'音爆 SE',power:136,weight:3.0,acc:91,crit:11,rarity:2},{id:'e4',name:'钻地爆弹',power:170,weight:4.2,acc:85,crit:14,rarity:3},{id:'e5',name:'竞技蜂群',power:210,weight:4.0,acc:92,crit:13,rarity:3},{id:'e6',name:'风葬导弹巢',power:245,weight:4.4,acc:95,crit:12,rarity:4},{id:'e7',name:'冰爆弹',power:286,weight:5.0,acc:91,crit:14,rarity:4},{id:'e8',name:'凝胶燃烧弹',power:335,weight:5.4,acc:88,crit:15,rarity:4},{id:'e9',name:'天穹拦截弹',power:392,weight:5.8,acc:96,crit:17,rarity:5},{id:'e10',name:'零号歼灭弹',power:480,weight:6.8,acc:94,crit:20,rarity:5}
 ],
 engine:[
  {id:'eng0',name:'旧式 V6',capacity:4,weight:1.8},{id:'eng1',name:'沙狐涡轮',capacity:7,weight:2.0},{id:'eng2',name:'赤角柴油机',capacity:10,weight:2.4},{id:'eng3',name:'白鸽静音机',capacity:12,weight:2.3},{id:'eng4',name:'矿鼹重扭矩机',capacity:16,weight:3.4},{id:'eng5',name:'绯红竞技引擎',capacity:18,weight:3.1},{id:'eng6',name:'风葬轻量涡轮',capacity:20,weight:2.8},{id:'eng7',name:'白夜低温机',capacity:23,weight:3.7},{id:'eng8',name:'火蜥耐热机',capacity:26,weight:4.0},{id:'eng9',name:'天穹磁悬机',capacity:30,weight:4.4},{id:'eng10',name:'零号融合机',capacity:36,weight:5.2}
 ],
 cunit:[
  {id:'c0',name:'民用 C 装置',acc:0,crit:0,boss:0},{id:'c1',name:'猎犬追踪器',acc:2,crit:1,boss:3},{id:'c2',name:'盐风测距仪',acc:3,crit:1,boss:4},{id:'c3',name:'塞壬滤波器',acc:5,crit:2,boss:4},{id:'c4',name:'矿脉扫描仪',acc:3,crit:3,boss:6},{id:'c5',name:'竞技预测器',acc:4,crit:4,boss:5},{id:'c6',name:'风场弹道核',acc:6,crit:3,boss:6},{id:'c7',name:'白夜热成像',acc:5,crit:4,boss:7},{id:'c8',name:'火控耐热核',acc:4,crit:5,boss:8},{id:'c9',name:'天穹火控阵列',acc:8,crit:6,boss:9},{id:'c10',name:'零号预测核心',acc:10,crit:8,boss:12}
 ],
 armor:[
  {id:'a0',name:'焊接钢板',hp:0,def:0,weight:1.0},{id:'a1',name:'沙狐侧裙甲',hp:70,def:1,weight:1.4},{id:'a2',name:'赤角复合甲',hp:110,def:2,weight:1.8},{id:'a3',name:'白鸽缓冲甲',hp:150,def:2,weight:1.9},{id:'a4',name:'矿鼹岩甲',hp:210,def:4,weight:2.8},{id:'a5',name:'绯红竞技甲',hp:260,def:4,weight:2.7},{id:'a6',name:'风葬轻型甲',hp:280,def:4,weight:2.2},{id:'a7',name:'白夜夹层甲',hp:360,def:6,weight:3.1},{id:'a8',name:'火蜥陶瓷甲',hp:430,def:7,weight:3.4},{id:'a9',name:'天穹电磁甲',hp:520,def:8,weight:3.8},{id:'a10',name:'零号主动甲',hp:680,def:11,weight:4.6}
 ]
};
const PART_TYPES=['main','sub','se','engine','cunit','armor'];
const PART_LABEL={main:'主炮',sub:'副炮',se:'SE',engine:'发动机',cunit:'C 装置',armor:'装甲模块'};
const BOSS_DROPS=['m1','eng2','c3','m4','s5','se6','a7','se8','m9','c10'];
