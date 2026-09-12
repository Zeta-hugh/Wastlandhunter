const PORTRAIT_META={
 liuyan:{name:'柳焰',src:'assets/legacy/asset-01.webp',accent:'#c84e42'},
 lincheng:{name:'林澄',src:'assets/legacy/asset-02.webp',accent:'#6db0ad'},
 taoyao:{name:'桃夭',src:'assets/legacy/asset-03.webp',accent:'#d26c3b'}
};
const PORTRAITS={};
for(const [k,m] of Object.entries(PORTRAIT_META)){const im=new Image();im.src=m.src;PORTRAITS[k]=im}
function portraitForSpeaker(name){if(name==='柳焰')return'liuyan';if(name==='林澄')return'lincheng';if(name==='桃夭')return'taoyao';return null}
function dialogueLine(speaker,text,portrait=null){return{speaker,text,portrait:portrait||portraitForSpeaker(speaker)}}
function normalizeDialogueLine(line){return Array.isArray(line)?dialogueLine(line[0],line[1]):{speaker:line.speaker||'系统',text:line.text||'',portrait:line.portrait||portraitForSpeaker(line.speaker)}}

