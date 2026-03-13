const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TableOfContents,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak } = require('docx');

const BRAND="FF6B35",GRAY="666666",HBG="E8E8E8";
const bd={style:BorderStyle.SINGLE,size:1,color:"CCCCCC"};
const cb={top:bd,bottom:bd,left:bd,right:bd};

function cl(t,o={}){
  return new TableCell({borders:cb,
    width:o.w?{size:o.w,type:WidthType.DXA}:undefined,
    shading:o.bg?{fill:o.bg,type:ShadingType.CLEAR}:undefined,
    verticalAlign:VerticalAlign.CENTER,
    children:[new Paragraph({alignment:o.a||AlignmentType.LEFT,spacing:{before:40,after:40},
      children:[new TextRun({text:t||'',bold:!!o.b,size:o.s||20,font:'Arial'})]})]});
}
function hr(ts,ws){return new TableRow({tableHeader:true,children:ts.map((t,i)=>cl(t,{b:1,w:ws[i],bg:HBG,a:AlignmentType.CENTER}))});}
function dr(ts,ws){return new TableRow({children:ts.map((t,i)=>cl(t,{w:ws[i]}))});}
function T(rows,ws){return new Table({columnWidths:ws,rows:rows.map((r,i)=>i===0?hr(r,ws):dr(r,ws))});}
function T2(rows){return T(rows,[3000,6360]);}

function H1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:200},children:[new TextRun(t)]});}
function H2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:280,after:160},children:[new TextRun(t)]});}
function H3(t){return new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:200,after:120},children:[new TextRun(t)]});}
function P(t,o={}){return new Paragraph({spacing:{before:80,after:80},alignment:o.a,
  children:[new TextRun({text:t,bold:o.b,italics:o.i,size:o.s||22,color:o.c,font:'Arial'})]});}
function PB(){return new Paragraph({children:[new PageBreak()]});}
function BL(t){return new Paragraph({numbering:{reference:"bl",level:0},spacing:{before:40,after:40},
  children:[new TextRun({text:t,size:22,font:'Arial'})]});}

module.exports={cl,hr,dr,T,T2,H1,H2,H3,P,PB,BL,BRAND,GRAY,HBG,
  Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,
  Header,Footer,AlignmentType,LevelFormat,TableOfContents,
  HeadingLevel,BorderStyle,WidthType,ShadingType,VerticalAlign,
  PageNumber,PageBreak,fs};
