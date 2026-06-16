import { useState, useRef, useEffect } from "react";

// ── 팔레트 ─────────────────────────────────────────────
var BG="#F3F0EB",WHITE="#FFFFFF",BLACK="#111111",SUB="#5C5650",MUTED="#A09890",BORDER="#E6E0D8";
var SHD="0 2px 8px rgba(0,0,0,0.06),0 0 0 1px rgba(0,0,0,0.04)",RD=100;

// ── 사주 계산 ──────────────────────────────────────────
function getJDN(y,m,d){var yr=y,mo=m;if(mo<=2){yr--;mo+=12;}var A=Math.floor(yr/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(yr+4716))+Math.floor(30.6001*(mo+1))+d+B-1524;}
function calcElFromDate(y,m,d){var gz=(getJDN(y,m,d)+49)%60,s=gz%10;var ELS=["mok","mok","hwa","hwa","to","to","geum","geum","su","su"];var CG=["갑","을","병","정","무","기","경","신","임","계"];return{elId:ELS[s],stem:CG[s]};}
var CYCLE=["mok","hwa","to","geum","su"];
var CG_EL=["mok","mok","hwa","hwa","to","to","geum","geum","su","su"];
var CG_LBL=["갑","을","병","정","무","기","경","신","임","계"];
var JJ_LBL=["자","축","인","묘","진","사","오","미","신","유","술","해"];
var BASE_D=new Date(2024,0,1);
function getIljin(){var diff=Math.floor((new Date()-BASE_D)/86400000),ci=((diff)%10+10)%10,ji=((4+diff)%12+12)%12;return{elId:CG_EL[ci],label:CG_LBL[ci]+JJ_LBL[ji]+"일"};}
function getRelation(a,b){var mi=CYCLE.indexOf(a),ti=CYCLE.indexOf(b);if(mi===ti)return"same";if(CYCLE[(mi+1)%5]===b)return"gen_me";if(CYCLE[(mi+4)%5]===b)return"i_gen";if(CYCLE[(mi+3)%5]===b)return"kills_me";return"i_kill";}

var YEARS=Array.from({length:75},function(_,i){return 2010-i;});
var MON={KO:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],EN:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],JP:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]};

// ── 오행 데이터 ────────────────────────────────────────
var EL={
  mok:{hanja:"木",emoji:"🌿",name:{KO:"목 (木)",EN:"Wood (木)",JP:"木 (もく)"},type:{KO:"초록 숲 에너지",EN:"Green Forest Energy",JP:"緑の森エネルギー"},desc:{KO:"성장하고 뻗어나가는 기운. 자유롭고 창의적입니다.",EN:"Endlessly growing energy. Creative and free-spirited.",JP:"成長し広がる気運。自由で創造的です。"},colors:{KO:["포레스트그린","올리브","민트"],EN:["Forest Green","Olive","Mint"],JP:["フォレストグリーン","オリーブ","ミント"]},hex:["#3D6B4F","#6A9A70","#7BBFB5"],avoid:{KO:"화이트 계열",EN:"White tones",JP:"ホワイト系"},mat:{KO:"린넨 · 면 · 오가닉",EN:"Linen · Cotton · Organic",JP:"リネン・コットン・オーガニック"},styles:{KO:["와이드 팬츠","린넨 셔츠","맥시 원피스","오버핏 자켓"],EN:["Wide Pants","Linen Shirt","Maxi Dress","Oversized Jacket"],JP:["ワイドパンツ","リネンシャツ","マキシワンピース","オーバーサイズジャケット"]},
    products:[{KO:"올리브 와이드 팬츠",EN:"Olive Wide Pants",JP:"オリーブワイドパンツ",price:"₩49,000",tag:{KO:"핵심 추천",EN:"Top Pick",JP:"イチ推し"},kw:"olive wide pants"},{KO:"포레스트 맥시 원피스",EN:"Forest Maxi Dress",JP:"フォレストマキシワンピース",price:"₩65,000",tag:{KO:"베스트",EN:"Best",JP:"ベスト"},kw:"green maxi dress"},{KO:"민트 린넨 셔츠",EN:"Mint Linen Shirt",JP:"ミントリネンシャツ",price:"₩38,000",tag:{KO:"데일리",EN:"Daily",JP:"デイリー"},kw:"mint linen shirt"}],
    frag:"KIUN 01",fragNotes:{KO:"삼나무 · 베티버 · 그린티",EN:"Cedarwood · Vetiver · Green Tea",JP:"シダー · ベチバー · グリーンティー"},fragStory:{KO:"숲의 기운을 두르다",EN:"Wear the forest spirit",JP:"森の気運を纏う"},fragPrice:"₩89,000"},
  hwa:{hanja:"火",emoji:"🔥",name:{KO:"화 (火)",EN:"Fire (火)",JP:"火 (か)"},type:{KO:"불꽃 에너지",EN:"Flame Energy",JP:"炎エネルギー"},desc:{KO:"열정적이고 강렬한 기운. 어디서든 존재감을 발휘합니다.",EN:"Passionate and intense energy. You radiate presence wherever you go.",JP:"情熱的で強烈な気運。どこでも存在感を発揮します。"},colors:{KO:["버밀리온레드","코랄","핫핑크"],EN:["Vermilion Red","Coral","Hot Pink"],JP:["バーミリオン","コーラル","ホットピンク"]},hex:["#CC3333","#E8704A","#D63B7A"],avoid:{KO:"블랙·딥네이비",EN:"Black · Deep Navy",JP:"ブラック · ディープネイビー"},mat:{KO:"새틴 · 실크 · 광택소재",EN:"Satin · Silk · Glossy Fabric",JP:"サテン · シルク · 光沢素材"},styles:{KO:["레드 코트","오프숄더 탑","미니 스커트","새틴 블라우스"],EN:["Red Coat","Off-Shoulder Top","Mini Skirt","Satin Blouse"],JP:["レッドコート","オフショルダートップ","ミニスカート","サテンブラウス"]},
    products:[{KO:"버밀리온 테일러드 코트",EN:"Vermilion Tailored Coat",JP:"バーミリオンコート",price:"₩129,000",tag:{KO:"시그니처",EN:"Signature",JP:"シグネチャー"},kw:"red tailored coat"},{KO:"코랄 새틴 블라우스",EN:"Coral Satin Blouse",JP:"コーラルサテンブラウス",price:"₩55,000",tag:{KO:"핵심 추천",EN:"Top Pick",JP:"イチ推し"},kw:"coral satin blouse"},{KO:"레드 미니 스커트",EN:"Red Mini Skirt",JP:"レッドミニスカート",price:"₩42,000",tag:{KO:"베스트",EN:"Best",JP:"ベスト"},kw:"red mini skirt"}],
    frag:"KIUN 02",fragNotes:{KO:"블랙페퍼 · 장미 · 앰버",EN:"Black Pepper · Rose · Amber",JP:"ブラックペッパー · ローズ · アンバー"},fragStory:{KO:"불꽃의 기운을 내뿜다",EN:"Radiate the flame spirit",JP:"炎の気運を放つ"},fragPrice:"₩89,000"},
  to:{hanja:"土",emoji:"🌍",name:{KO:"토 (土)",EN:"Earth (土)",JP:"土 (ど)"},type:{KO:"대지 에너지",EN:"Earth Energy",JP:"大地エネルギー"},desc:{KO:"안정적이고 신뢰감 있는 기운. 모든 것의 중심이 됩니다.",EN:"Stable and trustworthy energy. You are the anchor people rely on.",JP:"安定感と信頼感のある気運。皆の中心となります。"},colors:{KO:["카멜","베이지","머스타드"],EN:["Camel","Beige","Mustard"],JP:["キャメル","ベージュ","マスタード"]},hex:["#B5783A","#D4B896","#C8A020"],avoid:{KO:"초록 계열",EN:"Green tones",JP:"グリーン系"},mat:{KO:"울 · 코듀로이 · 데님",EN:"Wool · Corduroy · Denim",JP:"ウール · コーデュロイ · デニム"},styles:{KO:["트렌치코트","슬랙스 세트업","울 니트","카디건"],EN:["Trench Coat","Set-up Slacks","Wool Knit","Cardigan"],JP:["トレンチコート","セットアップスラックス","ウールニット","カーディガン"]},
    products:[{KO:"카멜 클래식 트렌치코트",EN:"Camel Trench Coat",JP:"キャメルトレンチコート",price:"₩159,000",tag:{KO:"시그니처",EN:"Signature",JP:"シグネチャー"},kw:"camel trench coat"},{KO:"베이지 세트업 슬랙스",EN:"Beige Set-up Slacks",JP:"ベージュセットアップスラックス",price:"₩72,000",tag:{KO:"핵심 추천",EN:"Top Pick",JP:"イチ推し"},kw:"beige set up slacks"},{KO:"머스타드 울 니트",EN:"Mustard Wool Knit",JP:"マスタードウールニット",price:"₩58,000",tag:{KO:"베스트",EN:"Best",JP:"ベスト"},kw:"mustard knit sweater"}],
    frag:"KIUN 03",fragNotes:{KO:"카다몸 · 샌달우드 · 바닐라",EN:"Cardamom · Sandalwood · Vanilla",JP:"カルダモン · サンダルウッド · バニラ"},fragStory:{KO:"대지의 기운을 품다",EN:"Embrace the earth spirit",JP:"大地の気運を抱く"},fragPrice:"₩89,000"},
  geum:{hanja:"金",emoji:"🪙",name:{KO:"금 (金)",EN:"Metal (金)",JP:"金 (きん)"},type:{KO:"백금 에너지",EN:"Metal Energy",JP:"白金エネルギー"},desc:{KO:"정제되고 날카로운 기운. 완벽함을 추구합니다.",EN:"Refined and sharp energy. You cut through noise with precision.",JP:"洗練された鋭い気運。完璧を追求します。"},colors:{KO:["오프화이트","실버그레이","샴페인골드"],EN:["Off-White","Silver Gray","Champagne Gold"],JP:["オフホワイト","シルバーグレー","シャンパンゴールド"]},hex:["#F0EDE4","#A8A8A8","#C8A96E"],avoid:{KO:"레드·오렌지",EN:"Red · Orange",JP:"レッド · オレンジ"},mat:{KO:"가죽 · 메탈릭 패브릭",EN:"Leather · Metallic Fabric",JP:"レザー · メタリックファブリック"},styles:{KO:["테일러드 수트","슬림 슬랙스","미니멀 재킷","실버 액세서리"],EN:["Tailored Suit","Slim Slacks","Minimal Jacket","Silver Accessories"],JP:["テーラードスーツ","スリムスラックス","ミニマルジャケット","シルバーアクセサリー"]},
    products:[{KO:"오프화이트 테일러드 재킷",EN:"Off-White Tailored Jacket",JP:"オフホワイトジャケット",price:"₩138,000",tag:{KO:"시그니처",EN:"Signature",JP:"シグネチャー"},kw:"white tailored jacket"},{KO:"실버 체인 목걸이",EN:"Silver Chain Necklace",JP:"シルバーチェーンネックレス",price:"₩28,000",tag:{KO:"액세서리",EN:"Accessory",JP:"アクセサリー"},kw:"silver chain necklace"},{KO:"아이보리 슬림 슬랙스",EN:"Ivory Slim Slacks",JP:"アイボリースリムスラックス",price:"₩62,000",tag:{KO:"베스트",EN:"Best",JP:"ベスト"},kw:"ivory slim slacks"}],
    frag:"KIUN 04",fragNotes:{KO:"화이트티 · 아이리스 · 화이트머스크",EN:"White Tea · Iris · White Musk",JP:"ホワイトティー · アイリス · ホワイトムスク"},fragStory:{KO:"정제된 기운을 새기다",EN:"Engrave the refined spirit",JP:"洗練された気運を刻む"},fragPrice:"₩89,000"},
  su:{hanja:"水",emoji:"💧",name:{KO:"수 (水)",EN:"Water (水)",JP:"水 (すい)"},type:{KO:"심해 에너지",EN:"Deep Sea Energy",JP:"深海エネルギー"},desc:{KO:"깊고 신비로운 기운. 지혜롭고 유연합니다.",EN:"Deep and mysterious energy. You flow with wisdom and grace.",JP:"深く神秘的な気運。賢く柔軟です。"},colors:{KO:["딥네이비","차콜","인디고"],EN:["Deep Navy","Charcoal","Indigo"],JP:["ディープネイビー","チャコール","インディゴ"]},hex:["#1A2D4F","#3A3A3A","#2E3A6E"],avoid:{KO:"베이지·노랑",EN:"Beige · Yellow",JP:"ベージュ · イエロー"},mat:{KO:"벨벳 · 쉬폰 · 실크혼방",EN:"Velvet · Chiffon · Silk Blend",JP:"ベルベット · シフォン · シルクブレンド"},styles:{KO:["드레이프 원피스","플리츠 스커트","벨벳 자켓","다크 레이어링"],EN:["Drape Dress","Pleated Skirt","Velvet Jacket","Dark Layering"],JP:["ドレープワンピース","プリーツスカート","ベルベットジャケット","ダークレイヤリング"]},
    products:[{KO:"딥네이비 드레이프 원피스",EN:"Deep Navy Drape Dress",JP:"ディープネイビードレープワンピース",price:"₩88,000",tag:{KO:"시그니처",EN:"Signature",JP:"シグネチャー"},kw:"navy drape dress"},{KO:"차콜 플리츠 롱스커트",EN:"Charcoal Pleated Skirt",JP:"チャコールプリーツスカート",price:"₩55,000",tag:{KO:"핵심 추천",EN:"Top Pick",JP:"イチ推し"},kw:"charcoal pleated skirt"},{KO:"블랙 벨벳 크롭 자켓",EN:"Black Velvet Crop Jacket",JP:"ブラックベルベットクロップジャケット",price:"₩98,000",tag:{KO:"베스트",EN:"Best",JP:"ベスト"},kw:"black velvet jacket"}],
    frag:"KIUN 05",fragNotes:{KO:"아쿠아틱 · 바이올렛 · 앰버그리스",EN:"Aquatic · Violet · Ambergris",JP:"アクアティック · バイオレット · アンバーグリス"},fragStory:{KO:"깊은 기운을 흐르다",EN:"Flow with the deep spirit",JP:"深い気運を流れる"},fragPrice:"₩89,000"},
};

var CELEBS={
  mok:[{name:"V",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1995.12.30",stem:"乙"},{name:"Jin",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1992.12.04",stem:"甲"},{name:"J-Hope",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1994.02.18",stem:"乙"},{name:"Jisoo",group:{KO:"BLACKPINK",EN:"BLACKPINK",JP:"BLACKPINK"},birth:"1995.01.03",stem:"甲"},{name:"Rosé",group:{KO:"BLACKPINK",EN:"BLACKPINK",JP:"BLACKPINK"},birth:"1997.02.11",stem:"甲"}],
  hwa:[{name:"IU",group:{KO:"솔로",EN:"Solo",JP:"ソロ"},birth:"1993.05.16",stem:"丁"},{name:"Jungkook",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1997.09.01",stem:"丙"},{name:"Jimin",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1995.10.13",stem:"丁"}],
  to: [{name:"Suga",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1993.03.09",stem:"己"},{name:"Lisa",group:{KO:"BLACKPINK",EN:"BLACKPINK",JP:"BLACKPINK"},birth:"1997.03.27",stem:"戊"},{name:"Minji",group:{KO:"NewJeans",EN:"NewJeans",JP:"NewJeans"},birth:"2004.05.19",stem:"戊"}],
  geum:[{name:"RM",group:{KO:"BTS",EN:"BTS",JP:"BTS"},birth:"1994.09.12",stem:"辛"},{name:"Hyun Bin",group:{KO:"배우",EN:"Actor",JP:"俳優"},birth:"1982.09.25",stem:"辛"}],
  su:  [{name:"Jennie",group:{KO:"BLACKPINK",EN:"BLACKPINK",JP:"BLACKPINK"},birth:"1996.01.16",stem:"壬"},{name:"Bong Joon-ho",group:{KO:"감독",EN:"Director",JP:"監督"},birth:"1969.09.14",stem:"壬"}],
};

var REL_BADGE={same:{KO:"⚡ 기운 배가",EN:"⚡ Energy Doubled",JP:"⚡ 気運倍増"},gen_me:{KO:"🌱 기운 상승",EN:"🌱 Energy Rising",JP:"🌱 気運上昇"},i_gen:{KO:"✨ 안정된 기운",EN:"✨ Stable Energy",JP:"✨ 安定した気運"},kills_me:{KO:"⚠ 기운 주의",EN:"⚠ Energy Caution",JP:"⚠ 気運注意"},i_kill:{KO:"🔥 지배하는 기운",EN:"🔥 Dominant Energy",JP:"🔥 支配する気運"}};
var REL_MSG={same:{KO:"내 기운이 두 배인 날. 오행 컬러를 과감하게 써도 좋아요.",EN:"Your energy doubles today. Go bold with your element colors.",JP:"自分の気運が2倍の日。五行カラーを大胆に使いましょう。"},gen_me:{KO:"하늘이 돕는 날. 오늘의 기운 컬러를 포인트로 더해요.",EN:"Heaven supports you today. Add today's energy color as an accent.",JP:"天が助ける日。今日の気運カラーをポイントに加えましょう。"},i_gen:{KO:"여유 있고 안정된 날. 평소 내 스타일을 유지해요.",EN:"A calm, stable day. Keep your usual style comfortably.",JP:"穏やかで安定した日。いつものスタイルをキープしましょう。"},kills_me:{KO:"기운이 눌리는 날. 내 오행 컬러로 에너지를 보호해요.",EN:"Energy is suppressed today. Protect it with your element colors.",JP:"気運が抑えられる日。五行カラーでエネルギーを守りましょう。"},i_kill:{KO:"당신이 오늘 하늘보다 강해요. 선명하고 강한 스타일로 드러내요.",EN:"You're stronger than heaven today. Show it with a bold, vivid style.",JP:"今日はあなたが天より強い。鮮明で力強いスタイルを。"}};
var REL_POW={same:5,gen_me:4,i_gen:3,kills_me:1,i_kill:4};

var EL_REL={
  mok:{gen:"su",kills:"geum",genDesc:{KO:"수(水)가 목(木)을 키워요",EN:"Water nourishes Wood",JP:"水が木を育てます"},killDesc:{KO:"금(金)이 목(木)을 베어요",EN:"Metal cuts through Wood",JP:"金が木を切ります"},genStyle:{KO:"딥네이비 · 차콜이 나에게 힘을 줘요",EN:"Deep navy & charcoal empower you",JP:"ディープネイビー・チャコールが力をくれます"},killStyle:{KO:"실버 · 아이보리 계열은 오늘 기운을 약화시킬 수 있어요",EN:"Silver & off-white may weaken your energy",JP:"シルバー・オフホワイト系は気運を弱める可能性があります"}},
  hwa:{gen:"mok",kills:"su",genDesc:{KO:"목(木)이 화(火)를 키워요",EN:"Wood feeds the Flame",JP:"木が火を燃やします"},killDesc:{KO:"수(水)가 화(火)를 꺼요",EN:"Water extinguishes Fire",JP:"水が火を消します"},genStyle:{KO:"초록 · 올리브 컬러가 나의 열정을 북돋아요",EN:"Green & olive colors fuel your passion",JP:"グリーン・オリーブが情熱を高めます"},killStyle:{KO:"네이비 · 블랙 계열은 기운을 가라앉힐 수 있어요",EN:"Navy & black may dampen your fire energy",JP:"ネイビー・ブラック系は気運を抑える可能性があります"}},
  to:{gen:"hwa",kills:"mok",genDesc:{KO:"화(火)가 토(土)를 만들어요",EN:"Fire creates the Earth",JP:"火が土を生み出します"},killDesc:{KO:"목(木)이 토(土)를 뚫어요",EN:"Wood penetrates the Earth",JP:"木が土を貫きます"},genStyle:{KO:"레드 · 코랄 컬러가 나의 안정감을 높여줘요",EN:"Red & coral colors strengthen your grounding",JP:"レッド・コーラルが安定感を高めます"},killStyle:{KO:"포레스트그린 · 올리브 계열은 피하는 게 좋아요",EN:"Forest green & olive may disrupt your energy",JP:"フォレストグリーン・オリーブ系は避けましょう"}},
  geum:{gen:"to",kills:"hwa",genDesc:{KO:"토(土)가 금(金)을 만들어요",EN:"Earth produces Metal",JP:"土が金を生み出します"},killDesc:{KO:"화(火)가 금(金)을 녹여요",EN:"Fire melts the Metal",JP:"火が金を溶かします"},genStyle:{KO:"카멜 · 베이지 컬러가 나의 정제된 기운을 완성해요",EN:"Camel & beige colors refine your energy",JP:"キャメル・ベージュが洗練された気運を高めます"},killStyle:{KO:"레드 · 오렌지 계열은 오늘 기운과 충돌할 수 있어요",EN:"Red & orange may clash with your energy today",JP:"レッド・オレンジ系は今日の気運と衝突する可能性があります"}},
  su:{gen:"geum",kills:"to",genDesc:{KO:"금(金)이 수(水)를 담아줘요",EN:"Metal holds the Water",JP:"金が水を湛えます"},killDesc:{KO:"토(土)가 수(水)를 막아요",EN:"Earth absorbs the Water",JP:"土が水を吸収します"},genStyle:{KO:"실버 · 아이보리 컬러가 나의 깊은 기운을 강화해요",EN:"Silver & ivory colors deepen your water energy",JP:"シルバー・アイボリーが深い気運を強化します"},killStyle:{KO:"카멜 · 베이지 · 머스타드 계열은 기운을 흡수할 수 있어요",EN:"Camel, beige & mustard may absorb your energy",JP:"キャメル・ベージュ・マスタード系は気運を吸収する可能性があります"}},
};

var ACC={
  mok:{items:{KO:["그린 재스퍼 팔찌","나뭇잎 이어링","올리브 비즈 목걸이","우드 뱅글"],EN:["Green Jasper Bracelet","Leaf Motif Earrings","Olive Bead Necklace","Wood Bangle"],JP:["グリーンジャスパーブレスレット","リーフモチーフピアス","オリーブビーズネックレス","ウッドバングル"]},prints:{KO:["리프 프린트","보타니컬","버티컬 스트라이프"],EN:["Leaf Print","Botanical","Vertical Stripe"],JP:["リーフプリント","ボタニカル","縦ストライプ"]},stone:{KO:"녹색 계열 자연석 · 옥(玉)",EN:"Green natural stone · Jade",JP:"グリーン天然石 · 翡翠"},kw:{KO:["그린 이어링","나뭇잎 목걸이","우드 팔찌"],EN:["green jasper bracelet","leaf earrings","olive necklace"],JP:["グリーンピアス","リーフネックレス","ウッドブレスレット"]}},
  hwa:{items:{KO:["코랄 드롭 이어링","레드 비즈 팔찌","골드 체인 레이어드","루비 컬러 브로치"],EN:["Coral Drop Earrings","Red Bead Bracelet","Gold Chain Layered","Ruby-tone Brooch"],JP:["コーラルドロップピアス","レッドビーズブレスレット","ゴールドチェーンレイヤード","ルビーカラーブローチ"]},prints:{KO:["기하학 패턴","볼드 플로럴","애니멀 프린트"],EN:["Geometric Pattern","Bold Floral","Animal Print"],JP:["ジオメトリックパターン","ボールドフローラル","アニマルプリント"]},stone:{KO:"레드 계열 보석 · 가넷 · 루비",EN:"Red gemstones · Garnet · Ruby",JP:"レッド系宝石 · ガーネット · ルビー"},kw:{KO:["코랄 이어링","레드 팔찌","골드 체인"],EN:["coral earrings","red bracelet","gold chain necklace"],JP:["コーラルピアス","レッドブレスレット","ゴールドチェーン"]}},
  to:{items:{KO:["카멜 가죽 벨트","황동 뱅글","베이지 패브릭 스카프","타이거아이 팔찌"],EN:["Camel Leather Belt","Brass Bangle","Beige Fabric Scarf","Tiger Eye Bracelet"],JP:["キャメルレザーベルト","ブラスバングル","ベージュファブリックスカーフ","タイガーアイブレスレット"]},prints:{KO:["체크 패턴","헤링본","자카드"],EN:["Check Pattern","Herringbone","Jacquard"],JP:["チェックパターン","ヘリンボーン","ジャカード"]},stone:{KO:"황토 계열 자연석 · 타이거아이",EN:"Earth-tone stones · Tiger Eye",JP:"アース系天然石 · タイガーアイ"},kw:{KO:["카멜 벨트","황동 뱅글","베이지 스카프"],EN:["camel leather belt","brass bangle","beige scarf"],JP:["キャメルベルト","ブラスバングル","ベージュスカーフ"]}},
  geum:{items:{KO:["실버 체인 목걸이","미니멀 골드 이어링","화이트 진주 귀걸이","메탈릭 클러치"],EN:["Silver Chain Necklace","Minimal Gold Earrings","White Pearl Earrings","Metallic Clutch"],JP:["シルバーチェーンネックレス","ミニマルゴールドピアス","ホワイトパールピアス","メタリッククラッチ"]},prints:{KO:["심플 라인","미니멀 도트","은색 자카드"],EN:["Simple Line","Minimal Dot","Silver Jacquard"],JP:["シンプルライン","ミニマルドット","シルバージャカード"]},stone:{KO:"화이트 쿼츠 · 문스톤 · 진주",EN:"White Quartz · Moonstone · Pearl",JP:"ホワイトクォーツ · ムーンストーン · パール"},kw:{KO:["실버 목걸이","골드 이어링","진주 귀걸이"],EN:["silver chain necklace","gold earrings","pearl earrings"],JP:["シルバーネックレス","ゴールドピアス","パールピアス"]}},
  su:{items:{KO:["진주 이어링","네이비 패브릭 스카프","블랙 가죽 파우치","아쿠아마린 팔찌"],EN:["Pearl Earrings","Navy Fabric Scarf","Black Leather Pouch","Aquamarine Bracelet"],JP:["パールピアス","ネイビーファブリックスカーフ","ブラックレザーポーチ","アクアマリンブレスレット"]},prints:{KO:["추상 웨이브","타이다이","워터컬러 패턴"],EN:["Abstract Wave","Tie-dye","Watercolor Pattern"],JP:["アブストラクトウェーブ","タイダイ","水彩パターン"]},stone:{KO:"아쿠아마린 · 블랙 오닉스 · 진주",EN:"Aquamarine · Black Onyx · Pearl",JP:"アクアマリン · ブラックオニキス · パール"},kw:{KO:["진주 이어링","네이비 스카프","아쿠아마린"],EN:["pearl earrings","navy scarf","aquamarine bracelet"],JP:["パールピアス","ネイビースカーフ","アクアマリン"]}},
};
var ACC_GUIDE={same:{KO:"내 기운이 가장 강한 날. 내 오행 컬러 장신구를 과감하게 착용하세요.",EN:"Your energy is at its peak. Wear your element accessories boldly.",JP:"自分の気運が最も強い日。五行カラーのアクセサリーを大胆に着けましょう。"},gen_me:{KO:"하늘이 돕는 날. 오늘 일진 컬러 액세서리를 포인트로 더하면 기운이 증폭돼요.",EN:"Heaven supports you. Add a small accent in today's energy color to amplify.",JP:"天が助ける日。今日の日辰カラーのアクセサリーをポイントに加えましょう。"},i_gen:{KO:"기운이 빠져나가는 날. 내 오행 컬러 장신구로 중심을 잡으세요.",EN:"Your energy drains today. Ground yourself with your element accessories.",JP:"気運が流れ出る日。五行カラーのアクセサリーで中心を保ちましょう。"},kills_me:{KO:"기운이 눌리는 날. 내 오행 컬러 장신구가 방패가 되어 보호해줘요.",EN:"Your energy is suppressed. Your element accessories act as a protective shield.",JP:"気運が抑えられる日。五行カラーのアクセサリーが盾となって守ります。"},i_kill:{KO:"오늘 당신이 가장 강해요. 선명하고 존재감 있는 장신구로 기운을 표현하세요.",EN:"You are the strongest today. Show your power with a striking accessory.",JP:"今日はあなたが最強。存在感のあるアクセサリーで気運を表現しましょう。"}};

// ── 쇼핑 플랫폼 (언어별) ───────────────────────────────
var PLT_KO=[
  {name:"무신사",url:function(q,id){return id?"https://www.musinsa.com/search/goods?q="+q+"&utm_source=kiun&utm_campaign="+id:"https://www.musinsa.com/search/goods?q="+q;}},
  {name:"29CM",  url:function(q,id){return id?"https://shop.29cm.co.kr/search?query="+q+"&utm_source=kiun&utm_campaign="+id:"https://shop.29cm.co.kr/search?query="+q;}},
  {name:"쿠팡",  url:function(q,id){return id?"https://link.coupang.com/a/"+id+"?searchKeyword="+q:"https://www.coupang.com/np/search?q="+q;}},
  {name:"에이블리",url:function(q,id){return"https://m.a-bly.com/search?query="+q+(id?"&ref="+id:"");}},
];
var PLT_EN=[
  {name:"ASOS",    url:function(q){return"https://www.asos.com/search/?q="+q;}},
  {name:"Zara",    url:function(q){return"https://www.zara.com/en/search?searchTerm="+q;}},
  {name:"H&M",     url:function(q){return"https://www.hm.com/search?q="+q;}},
  {name:"Musinsa", url:function(q){return"https://www.musinsa.com/search/goods?q="+q;},note:"🇰🇷 Korean fashion"},
];
var PLT_JP=[
  {name:"ZOZOTOWN",url:function(q){return"https://zozo.jp/search/?p="+q;}},
  {name:"Zara",    url:function(q){return"https://www.zara.com/jp/search?searchTerm="+q;}},
  {name:"ASOS",    url:function(q){return"https://www.asos.com/search/?q="+q;}},
  {name:"Musinsa", url:function(q){return"https://www.musinsa.com/search/goods?q="+q;},note:"🇰🇷 韓国ファッション"},
];

var AFF_PLATFORMS=[
  {key:"musinsa",name:"무신사",comm:"2~8%",ph:"kiun_partner_001",guide:"partners.musinsa.com"},
  {key:"cm29",   name:"29CM",  comm:"3~7%",ph:"kiun29_2024",    guide:"29CM 파트너센터"},
  {key:"coupang",name:"쿠팡",  comm:"1~3%",ph:"af1234567",      guide:"partners.coupang.com"},
  {key:"ably",   name:"에이블리",comm:"2~5%",ph:"kiun_ably",    guide:"에이블리 파트너스"},
];

function getPlatforms(lang,affIds){
  var list=lang==="EN"?PLT_EN:lang==="JP"?PLT_JP:PLT_KO;
  return list.map(function(p){
    var id=(lang==="KO"&&affIds)?affIds[p.name==="무신사"?"musinsa":p.name==="29CM"?"cm29":p.name==="쿠팡"?"coupang":"ably"]:"";
    return{name:p.name,url:p.url(encodeURIComponent(""),id),note:p.note||"",active:!!id};
  });
}
function getSearchUrl(kw,lang,affIds){
  var q=encodeURIComponent(kw);
  if(lang==="EN")return PLT_EN[0].url(q);
  if(lang==="JP")return PLT_JP[0].url(q);
  var id=affIds&&affIds.musinsa;
  return PLT_KO[0].url(q,id);
}
function get29cmUrl(kw,affIds){var q=encodeURIComponent(kw);var id=affIds&&affIds.cm29;return PLT_KO[1].url(q,id);}

// ── AI 프롬프트 ────────────────────────────────────────
function buildAIPrompt(myElId,tdElId,rel,situation,lang,gender){
  var e=EL[myElId],td=EL[tdElId],rb=REL_BADGE[rel][lang];
  var gKO=gender==="F"?"여성":"남성";
  var gEN=gender==="F"?"Female":"Male";
  var gJP=gender==="F"?"女性":"男性";

  if(lang==="EN"){
    return "You are KIUN, a Korean saju-based fashion stylist. Write ALL values in English.\n\n"+
      "User info:\n"+
      "- Gender: "+gEN+"\n"+
      "- My element: "+e.name.EN+" ("+e.type.EN+")\n"+
      "- Today's iljin: "+td.name.EN+"\n"+
      "- Energy relation: "+rb+"\n"+
      "- Today's situation: \""+situation+"\"\n\n"+
      "Write personalized "+gEN.toLowerCase()+"'s fashion styling advice based on this saju reading.\n"+
      "Return ONLY a JSON object. No markdown, no explanation outside JSON.\n"+
      "Example format (replace ALL values with real content for a "+gEN.toLowerCase()+"):\n"+
      '{"headline":"A calm day to show your elegance","energyMsg":"Your Metal energy meets Earth today, creating a stable refined flow. Perfect for making strong impressions.","keywords":["refined","confident","elegant"],"wardrobeColors":"Ivory, silver gray, champagne gold","wardrobeItems":["tailored ivory blazer","slim gray slacks","silver accessories"],"wardrobeTip":"Layer a silk blouse under your blazer for extra polish","avoidColor":"Red and orange","avoidReason":"Fire clashes with your Metal energy today","keyItem":"Silver chain necklace","keyItemReason":"Amplifies your Metal energy and adds presence","situationTip":"Your sharp Metal intuition peaks today — trust your first impressions","shoppingKeyword":"ivory blazer"}';
  }

  if(lang==="JP"){
    return "あなたはKIUN、韓国四柱命理学ベースのファッションスタイリストです。すべての値を日本語で書いてください。\n\n"+
      "ユーザー情報:\n"+
      "- 性別: "+gJP+"\n"+
      "- 私の五行: "+e.name.JP+" ("+e.type.JP+")\n"+
      "- 今日の日辰: "+td.name.JP+"\n"+
      "- 気運の関係: "+rb+"\n"+
      "- 今日の状況: \""+situation+"\"\n\n"+
      gJP+"向けのファッションスタイリングアドバイスをJSON形式で書いてください。マークダウンなし。\n"+
      '{"headline":"今日は品格を輝かせる一日","energyMsg":"金の気運が土と出会い、安定した洗練された流れを作ります。","keywords":["洗練","自信","エレガント"],"wardrobeColors":"オフホワイト、シルバーグレー","wardrobeItems":["テーラードジャケット","スリムスラックス","シルバーアクセサリー"],"wardrobeTip":"シルクブラウスを重ねると上品さが増します","avoidColor":"レッドとオレンジ","avoidReason":"火が金の気運と衝突します","keyItem":"シルバーチェーンネックレス","keyItemReason":"金の気運を増幅します","situationTip":"今日は直感を信じてください","shoppingKeyword":"テーラードジャケット"}';
  }

  return "당신은 KIUN 사주 패션 스타일리스트입니다. 모든 값을 한국어로 작성하세요.\n\n"+
    "사용자 정보:\n"+
    "- 성별: "+gKO+"\n"+
    "- 나의 오행: "+e.name.KO+" ("+e.type.KO+")\n"+
    "- 오늘 일진: "+td.name.KO+"\n"+
    "- 기운 관계: "+rb+"\n"+
    "- 오늘 상황: \""+situation+"\"\n\n"+
    gKO+" 패션 스타일링 조언을 아래 JSON 형식으로 작성하세요. 마크다운 없이 JSON만.\n"+
    '{"headline":"흙의 기운으로 차분하게 나아가세요","energyMsg":"토(土) 기운이 오늘 일진과 만나 안정적인 흐름을 만들어요.","keywords":["안정적","신뢰감","차분한"],"wardrobeColors":"카멜, 베이지, 머스타드","wardrobeItems":["카멜 트렌치코트","베이지 슬랙스","울 니트"],"wardrobeTip":"중간 톤의 베이지 계열로 톤온톤 코디를 완성하세요","avoidColor":"초록 계열","avoidReason":"목(木)이 토(土)를 뚫어 기운이 흩어져요","keyItem":"황동 뱅글","keyItemReason":"토(土) 기운을 강화하고 중심을 잡아줘요","situationTip":"오늘 미팅에서는 안정적인 카멜 컬러가 신뢰감을 높여줄 거예요","shoppingKeyword":"카멜 트렌치코트"}';
}
function buildShareText(elId,lang){
  var e=EL[elId];
  var names=CELEBS[elId].slice(0,2).map(function(c){return c.name;}).join(" & ");
  if(lang==="KO")return"나의 K-에너지 타입은 "+e.emoji+" "+e.name.KO+"!\n"+names+"와 같은 기운이에요.\nKIUN 氣運\n#KEnergy #사주패션 #KIUN";
  if(lang==="JP")return"私のK-エネルギータイプは "+e.emoji+" "+e.name.JP+"！\n"+names+"と同じ気運！\nKIUN 氣運\n#Kエネルギー #KIUN";
  return"My K-Energy type is "+e.emoji+" "+e.name.EN+"!\nSame energy as "+names+"!\nDiscover yours → KIUN 氣運\n#KEnergy #KoreanSaju #WhatIsMyKEnergyType";
}
function doShare(text){
  if(navigator.share){
    return navigator.share({title:"KIUN · 氣運",text:text}).then(function(){return"shared";}).catch(function(){return"cancelled";});
  }
  return navigator.clipboard.writeText(text).then(function(){return"copied";}).catch(function(){return"fail";});
}

// ── 번역 (컴포넌트 외부) ───────────────────────────────
var TX={
  KO:{tabt:"오늘의 기운",tabs:"오행 쇼핑",tabf:"기운 오브젝트",rediag:"재진단",affbtn:"제휴",myEl:"나의 기운",tdEl:"오늘의 일진",fixEl:"일간(日干) 기준",dayEl:"일진 (매일 변함)",pow:"기운 강도",stem:function(s){return"일간 "+s;},celebTitle:"나와 같은 기운을 가진 K스타는 누구?",celebNote:"* 공개 생년월일 기준",chatTitle:"오늘 어떤 하루인가요?",chatSub:"오행과 오늘의 기운을 더해 최적의 스타일을 찾아드려요",placeholder:"오늘 상황을 편하게 말씀해주세요.\n예: 오후에 중요한 미팅이 있어요.",voiceOn:"🎤 음성 입력",voiceOff:"⏹ 중지",voiceNo:"음성 미지원",generate:"오늘의 스타일링 받기",generating:"기운을 읽는 중...",retry:"↺ 다시 받기",wdTitle:"오늘 옷장에서 찾을 것",wdColors:"추천 컬러",wdItems:"추천 아이템",wdTip:"활용 팁",avoidTitle:"오늘 피할 것",keyTitle:"오늘의 핵심 아이템",sitTip:"기운 팁",shopTitle:"기운이 부족하다면",shopTabBtn:"오행 쇼핑 →",hint:"상황을 구체적으로 적을수록 더 정확해요",shareBtn:"나의 에너지 공유하기",cguide:"쇼핑 컬러 기준",matLbl:"추천 소재",avoidLbl:"피할 컬러",items:"기운 맞춤 추천 아이템",noId:"제휴 ID를 등록하면 구매 시 수수료가 발생해요",affSet:"등록하기",activeAff:function(n){return n+"개 플랫폼 활성화";},shopHere:"여기서 찾기 →",shopPlatforms:"쇼핑 플랫폼",accTitle:"오늘 기운 보완 — 액세서리 & 프린트",accSug:"액세서리 제안",prtSug:"프린트 제안",stoneLbl:"보완 소재 · 보석",search:"검색 →",elRelTitle:"어울리는 오행 & 피해야 할 오행",goodEl:"✦ 나에게 힘을 주는 오행",badEl:"✕ 피해야 할 오행",sameEl:function(n){return n+" 같은 기운끼리는 서로를 강화해요";},objTitle:"KIUN 기운 오브젝트",objSub:"당신의 오행 기운을 일상으로 가져오는 오브젝트들이에요. 하나씩 준비되는 중이에요.",fnote:"노트",comingSoon:"준비 중",soonTag:"준비 중",notifyLbl:"출시 알림 받기",sajuBtn:"사주(四柱)란?"},
  EN:{tabt:"Today's Energy",tabs:"Element Shop",tabf:"Energy Objects",rediag:"Re-diagnose",affbtn:"Affiliate",myEl:"My K-Energy",tdEl:"Today's Fortune",fixEl:"Day Stem (日干)",dayEl:"Changes daily",pow:"Energy Level",stem:function(s){return"Day Stem "+s;},celebTitle:"Which K-Star shares your energy?",celebNote:"* Based on public birth dates",chatTitle:"What's today like for you?",chatSub:"We'll combine your K-Energy and today's fortune to find your perfect style",placeholder:"Describe your day freely.\nE.g. I have an important meeting this afternoon.",voiceOn:"🎤 Voice",voiceOff:"⏹ Stop",voiceNo:"Voice not supported",generate:"Get Today's Styling",generating:"Reading your energy...",retry:"↺ Try Again",wdTitle:"Look for in Your Wardrobe",wdColors:"Recommended Colors",wdItems:"Recommended Items",wdTip:"Wardrobe Tip",avoidTitle:"Avoid Today",keyTitle:"Today's Key Item",sitTip:"Energy Tip",shopTitle:"Need something new?",shopTabBtn:"Shop Your Energy →",hint:"The more specific, the more personalized your styling",shareBtn:"Share My Energy",cguide:"Shopping Color Guide",matLbl:"Materials",avoidLbl:"Avoid",items:"Curated Items for Your Energy",noId:"Register affiliate IDs to earn commission",affSet:"Set up",activeAff:function(n){return n+" platforms active";},shopHere:"Shop here →",shopPlatforms:"Shopping Platforms",accTitle:"Energy Boost — Accessories & Prints",accSug:"Accessory Suggestions",prtSug:"Print Suggestions",stoneLbl:"Complementary Materials",search:"Search →",elRelTitle:"Compatible & Conflicting Elements",goodEl:"✦ Empowering Element",badEl:"✕ Conflicting Element",sameEl:function(n){return"Same "+n+" energy amplifies yours";},objTitle:"KIUN Energy Objects",objSub:"Objects that bring your ohaeng energy into everyday life. Each one is being prepared.",fnote:"Notes",comingSoon:"Coming Soon",soonTag:"Soon",notifyLbl:"Notify me",sajuBtn:"What is Saju?"},
  JP:{tabt:"今日の気運",tabs:"五行スタイル",tabf:"気運コレクション",rediag:"再診断",affbtn:"提携",myEl:"私のK-エネルギー",tdEl:"今日の日辰",fixEl:"日干 基準",dayEl:"毎日変わる",pow:"気運強度",stem:function(s){return"日干 "+s;},celebTitle:"同じ気運のK-スターは誰？",celebNote:"* 公開された生年月日による日干計算",chatTitle:"今日はどんな一日ですか？",chatSub:"五行と今日の気運を組み合わせて最適なスタイリングをご提案します",placeholder:"今日の状況を気軽にお話しください。\n例：午後に重要な会議があります。",voiceOn:"🎤 音声",voiceOff:"⏹ 停止",voiceNo:"音声非対応",generate:"今日のスタイリングを受け取る",generating:"気運を読んでいます...",retry:"↺ 再生成",wdTitle:"クローゼットで探すもの",wdColors:"おすすめカラー",wdItems:"おすすめアイテム",wdTip:"活用ヒント",avoidTitle:"今日避けること",keyTitle:"今日のキーアイテム",sitTip:"気運ヒント",shopTitle:"新しいものが必要なら",shopTabBtn:"気運ショッピング →",hint:"状況を具体的に書くほど、より正確なスタイリングが得られます",shareBtn:"私のエネルギーをシェア",cguide:"ショッピングカラー基準",matLbl:"おすすめ素材",avoidLbl:"避けるカラー",items:"気運に合ったおすすめアイテム",noId:"提携IDを登録するとリンクから手数料が発生します",affSet:"設定",activeAff:function(n){return n+"プラットフォーム提携中";},shopHere:"ショップへ →",shopPlatforms:"ショッピングプラットフォーム",accTitle:"今日の気運補完 — アクセサリー & プリント",accSug:"アクセサリー提案",prtSug:"プリント提案",stoneLbl:"補完素材 · 宝石",search:"検索 →",elRelTitle:"相性の良い五行 & 避けるべき五行",goodEl:"✦ 力をくれる五行",badEl:"✕ 避けるべき五行",sameEl:function(n){return n+"同士は互いを強化します";},objTitle:"KIUN 気運コレクション",objSub:"あなたの五行の気運を日常に取り入れるオブジェクトです。一つずつ準備中です。",fnote:"ノート",comingSoon:"準備中",soonTag:"準備中",notifyLbl:"発売通知を受け取る",sajuBtn:"四柱命理学とは？"},
};

// ── UI 컴포넌트 ────────────────────────────────────────
function LT({lang,onChange}){
  return <div style={{display:"flex",gap:3}}>{["KO","EN","JP"].map(function(l){return(<button key={l} onClick={function(){onChange(l);}} style={{background:lang===l?BLACK:"transparent",color:lang===l?WHITE:MUTED,border:"1px solid "+(lang===l?BLACK:BORDER),borderRadius:RD,padding:"3px 11px",fontSize:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{l}</button>);})}</div>;
}

function Card({children,style}){return <div style={Object.assign({background:WHITE,borderRadius:16,padding:18,marginBottom:12,boxShadow:SHD},style||{})}>{children}</div>;}
function Lbl({children}){return <div style={{fontSize:9,color:MUTED,fontFamily:"'DM Sans',sans-serif",letterSpacing:".18em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>{children}</div>;}
function Pill({children,solid,onClick,disabled,style}){return <button onClick={onClick} disabled={disabled} style={Object.assign({background:disabled?BORDER:solid?BLACK:"transparent",color:disabled?MUTED:solid?WHITE:BLACK,border:solid?"none":"1.5px solid "+(disabled?BORDER:BLACK),borderRadius:RD,padding:solid?"12px 24px":"11px 22px",fontSize:14,cursor:disabled?"default":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:"-.01em"},style||{})}>{children}</button>;}

// ── 멀티플랫폼 쇼핑 버튼 ───────────────────────────────
function ShopButtons({kw,lang,affIds,t}){
  var q=encodeURIComponent(kw);
  var platforms=lang==="EN"?PLT_EN:lang==="JP"?PLT_JP:PLT_KO.slice(0,2);
  return(
    <div style={{marginTop:10}}>
      <div style={{fontSize:9,color:MUTED,fontFamily:"'DM Sans',sans-serif",letterSpacing:".15em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>{t.shopPlatforms}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {platforms.map(function(p){
          var id=affIds&&lang==="KO"?(p.name==="무신사"?affIds.musinsa:affIds.cm29):"";
          var url=p.url(q,id);
          return(
            <a key={p.name} href={url} target="_blank" rel="noreferrer"
              style={{background:BLACK,color:WHITE,borderRadius:RD,padding:"7px 14px",fontSize:12,fontWeight:600,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4}}>
              {p.name}{p.note?" · "+p.note:""} →
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── 상품 카드 ──────────────────────────────────────────
function ProductCard({product,affIds,lang,t}){
  var [open,setOpen]=useState(false);
  var [copied,setCopied]=useState(null);
  var q=encodeURIComponent(product.kw);
  var platforms=lang==="EN"?PLT_EN:lang==="JP"?PLT_JP:PLT_KO;
  function copyUrl(url,name){navigator.clipboard.writeText(url);setCopied(name);setTimeout(function(){setCopied(null);},1800);}
  var moveTx={KO:"이동",EN:"Open",JP:"開く"};
  var copyTx={KO:"복사",EN:"Copy",JP:"コピー"};
  return(
    <div style={{border:"1.5px solid "+BORDER,borderRadius:14,overflow:"hidden",marginBottom:8,background:WHITE}}>
      <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <span style={{background:BG,border:"1px solid "+BORDER,borderRadius:RD,padding:"2px 10px",fontSize:9,color:SUB,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginRight:8}}>{product.tag[lang]}</span>
          <span style={{fontSize:13,color:BLACK,fontFamily:"'DM Sans',sans-serif"}}>{product[lang]}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14,color:BLACK,fontWeight:700}}>{product.price}</span>
          <button onClick={function(){setOpen(!open);}} style={{background:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,padding:"4px 14px",fontSize:11,color:SUB,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>
            {open?(lang==="KO"?"접기":lang==="JP"?"閉じる":"Fold"):(lang==="KO"?"쇼핑 링크":lang==="JP"?"ショッピング":"Shop Links")}
          </button>
        </div>
      </div>
      {open&&(
        <div style={{borderTop:"1px solid "+BORDER,padding:"12px 16px",background:BG}}>
          {platforms.map(function(p){
            var id=lang==="KO"&&affIds?(p.name==="무신사"?affIds.musinsa:p.name==="29CM"?affIds.cm29:p.name==="쿠팡"?affIds.coupang:affIds.ably):"";
            var url=p.url(q,id);
            return(
              <div key={p.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"8px 12px",background:WHITE,borderRadius:10,border:"1px solid "+BORDER,marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:7,flex:1}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:BLACK}}></div>
                  <span style={{fontSize:12,color:BLACK,fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{p.name}</span>
                  {p.note&&<span style={{fontSize:10,color:MUTED}}>{p.note}</span>}
                  {id&&lang==="KO"&&<span style={{fontSize:10,color:SUB,fontFamily:"'DM Sans',sans-serif"}}>제휴</span>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <a href={url} target="_blank" rel="noreferrer" style={{border:"1.5px solid "+BORDER,borderRadius:RD,padding:"3px 12px",fontSize:10,color:BLACK,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{moveTx[lang]}</a>
                  <button onClick={function(){copyUrl(url,p.name);}} style={{background:copied===p.name?BLACK:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,padding:"3px 12px",fontSize:10,color:copied===p.name?WHITE:SUB,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    {copied===p.name?"✓":copyTx[lang]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── 어울리는·피해야 할 오행 ────────────────────────────
function ElRelSection({myElId,lang,t}){
  var r=EL_REL[myElId],my=EL[myElId],genEl=EL[r.gen],kilEl=EL[r.kills];
  return(
    <Card>
      <Lbl>{t.elRelTitle}</Lbl>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:BLACK,fontWeight:700,marginBottom:8}}>{t.goodEl}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:"1.5px solid "+BORDER,borderRadius:12,background:BG}}>
          <div style={{textAlign:"center",minWidth:50}}><div style={{fontSize:26,marginBottom:2}}>{genEl.emoji}</div><div style={{fontSize:11,color:BLACK,fontWeight:600}}>{genEl.name[lang]}</div></div>
          <div style={{width:1,height:36,background:BORDER,flexShrink:0}}></div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:BLACK,fontWeight:600,marginBottom:2}}>{r.genDesc[lang]}</div>
            <div style={{fontSize:11,color:SUB,lineHeight:1.5,marginBottom:6}}>{r.genStyle[lang]}</div>
            <div style={{display:"flex",gap:5}}>{genEl.hex.map(function(h){return <div key={h} style={{width:16,height:16,borderRadius:"50%",background:h,border:"1px solid "+BORDER}}></div>;})}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",border:"1.5px solid "+BORDER,borderRadius:10,marginBottom:12}}>
        <span style={{fontSize:18}}>{my.emoji}</span>
        <span style={{fontSize:12,color:SUB}}>{t.sameEl(my.name[lang])}</span>
      </div>
      <div>
        <div style={{fontSize:11,color:BLACK,fontWeight:700,marginBottom:8}}>{t.badEl}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",border:"1.5px solid "+BORDER,borderRadius:12,background:BG}}>
          <div style={{textAlign:"center",minWidth:50,opacity:0.55}}><div style={{fontSize:26,marginBottom:2}}>{kilEl.emoji}</div><div style={{fontSize:11,color:BLACK,fontWeight:600}}>{kilEl.name[lang]}</div></div>
          <div style={{width:1,height:36,background:BORDER,flexShrink:0}}></div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:BLACK,fontWeight:600,marginBottom:2}}>{r.killDesc[lang]}</div>
            <div style={{fontSize:11,color:SUB,lineHeight:1.5,marginBottom:6}}>{r.killStyle[lang]}</div>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>{kilEl.hex.map(function(h){return <div key={h} style={{width:16,height:16,borderRadius:"50%",background:h,border:"1px solid "+BORDER,opacity:0.4}}></div>;})}<span style={{fontSize:10,color:MUTED,fontFamily:"'DM Sans',sans-serif"}}>{lang==="KO"?"오늘 피하기":lang==="JP"?"今日は避ける":"Avoid today"}</span></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── 액세서리 섹션 ──────────────────────────────────────
function AccSection({myElId,rel,affIds,lang,t}){
  var acc=ACC[myElId],guide=ACC_GUIDE[rel][lang],items=acc.items[lang],prints=acc.prints[lang],stone=acc.stone[lang],kws=acc.kw[lang];
  function sUrl(kw){return getSearchUrl(kw,lang,affIds);}
  return(
    <Card>
      <Lbl>{t.accTitle}</Lbl>
      <div style={{background:BG,borderRadius:12,padding:"12px 14px",fontSize:13,color:BLACK,lineHeight:1.8,marginBottom:14}}>{guide}</div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,color:BLACK,fontWeight:700,marginBottom:8}}>{t.accSug}</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {items.map(function(item,i){
            return(
              <div key={item} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",border:"1.5px solid "+BORDER,borderRadius:12,background:WHITE}}>
                <span style={{fontSize:13,color:BLACK}}>— {item}</span>
                <a href={sUrl(kws[i]||item)} target="_blank" rel="noreferrer" style={{background:BLACK,color:WHITE,borderRadius:RD,padding:"4px 14px",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600,textDecoration:"none",whiteSpace:"nowrap"}}>{t.search}</a>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,color:BLACK,fontWeight:700,marginBottom:8}}>{t.prtSug}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {prints.map(function(p){return <a key={p} href={sUrl(p)} target="_blank" rel="noreferrer" style={{border:"1.5px solid "+BLACK,borderRadius:RD,padding:"5px 14px",fontSize:12,color:BLACK,textDecoration:"none",fontWeight:500}}>{p}</a>;})}
        </div>
      </div>
      <div style={{background:BG,borderRadius:10,padding:"9px 13px",fontSize:11,color:SUB}}>✦ {t.stoneLbl} — {stone}</div>
    </Card>
  );
}

// ── 제휴 모달 ──────────────────────────────────────────
function AffModal({ids,onSave,onClose,lang}){
  var [form,setForm]=useState(Object.assign({},ids));
  var n=Object.values(form).filter(Boolean).length;
  var t=TX[lang];
  var ttl={KO:"제휴 링크 설정",EN:"Affiliate Link Settings",JP:"提携リンク設定"}[lang];
  var desc={KO:"파트너 ID 입력 시 링크에 추적 코드가 자동으로 붙어요.\n구매 발생 시 수수료가 정산됩니다.",EN:"Enter partner IDs to automatically add tracking codes.\nYou earn commission when customers purchase.",JP:"パートナーIDを入力すると追跡コードが自動で付きます。\n購入が発生すると手数料が精算されます。"}[lang];
  var law={KO:"⚖ 제휴 계약 완료 후 공정위 지침에 따라 소비자에게 고지해야 합니다.",EN:"⚖ Once affiliate is active, disclose this relationship per FTC guidelines.",JP:"⚖ 提携開始後、消費者庁ガイドラインに基づき開示が必要です。"}[lang];
  var cncl={KO:"취소",EN:"Cancel",JP:"キャンセル"}[lang];
  var sav=n>0?(lang==="KO"?n+"개 저장":lang==="JP"?n+"件保存":"Save "+n):(lang==="KO"?"저장":lang==="JP"?"保存":"Save");
  var warn={KO:"⚠ ID 미입력 — 일반 링크",EN:"⚠ No ID — no commission tracking",JP:"⚠ ID未入力 — 通常リンク"}[lang];
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(243,240,235,0.92)",backdropFilter:"blur(4px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:WHITE,borderRadius:20,padding:24,width:"100%",maxWidth:460,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,fontWeight:700,color:BLACK}}>{ttl}</span>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:MUTED,fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <p style={{fontSize:13,color:SUB,lineHeight:1.8,marginBottom:12,whiteSpace:"pre-line"}}>{desc}</p>
        <div style={{background:BG,borderRadius:10,padding:"10px 13px",fontSize:11,color:SUB,marginBottom:16}}>{law}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {AFF_PLATFORMS.map(function(p){
            return(
              <div key={p.key} style={{background:BG,borderRadius:12,padding:14,border:"1.5px solid "+(form[p.key]?BLACK:BORDER)}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:13,color:BLACK,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{p.name}</span>
                  <span style={{fontSize:11,color:MUTED,fontFamily:"'DM Sans',sans-serif"}}>{p.comm}</span>
                </div>
                <input value={form[p.key]||""} placeholder={p.ph}
                  onChange={function(ev){var v=ev.target.value;setForm(function(f){var nf=Object.assign({},f);nf[p.key]=v;return nf;});}}
                  style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:10,padding:"10px 12px",color:BLACK,fontSize:12,fontFamily:"'DM Sans',sans-serif",outline:"none",marginBottom:4}}/>
                <div style={{fontSize:10,color:MUTED}}>{p.guide}</div>
                {!form[p.key]&&<div style={{fontSize:10,color:MUTED,marginTop:3}}>{warn}</div>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Pill onClick={onClose} style={{flex:1}}>{cncl}</Pill>
          <Pill solid onClick={function(){onSave(form);}} style={{flex:2}}>{sav}</Pill>
        </div>
      </div>
    </div>
  );
}

// ── What is Saju? ──────────────────────────────────────
function WhatIsSaju({lang}){
  var [open,setOpen]=useState(false);
  var btnLabel={KO:"KIUN · 기운(氣運)이란?",EN:"What is KIUN · K-Energy?",JP:"KIUN · 気運とは？"}[lang];
  var data={
    KO:{
      title:"KIUN · 기운(氣運)이란?",
      sub:"2,000년 한국 전통 철학이 당신의 패션을 만날 때",
      sections:[
        {
          heading:"기운(氣運)이란?",
          body:"기운(氣運)은 사람과 자연에 흐르는 에너지예요. 한국 전통 철학에서는 우주의 모든 것이 다섯 가지 기운 — 목(木)·화(火)·토(土)·금(金)·수(水) — 으로 이루어진다고 봐요. 사람마다 태어날 때 타고난 기운이 있고, 이 기운이 성격·체질·어울리는 스타일을 결정해요."
        },
        {
          heading:"사주(四柱)와 기운의 관계",
          body:"사주(四柱)는 태어난 년·월·일·시의 네 기둥에서 기운을 읽는 방법이에요. KIUN은 그 중 일간(日干) — 태어난 날의 기운 — 을 분석해요. 생년월일만 입력하면 나의 고유한 기운 타입을 알 수 있어요."
        },
        {
          heading:"KIUN이 하는 일",
          body:"KIUN(氣運)은 이 2,000년 전통을 오늘의 패션 언어로 번역해요. 내 기운에 어울리는 컬러, 소재, 스타일을 알려주고, 오늘의 일진(하늘의 기운)과 내 기운이 어떻게 만나는지 분석해 그날 최적의 코디를 제안해요."
        },
      ],
      els:[
        {e:"🌿",n:"목 (木)",d:"성장과 자유. 초록·올리브 계열."},
        {e:"🔥",n:"화 (火)",d:"열정과 강렬함. 레드·코랄 계열."},
        {e:"🌍",n:"토 (土)",d:"안정과 신뢰. 카멜·베이지 계열."},
        {e:"🪙",n:"금 (金)",d:"정제와 우아함. 실버·아이보리 계열."},
        {e:"💧",n:"수 (水)",d:"깊이와 지혜. 네이비·차콜 계열."},
      ],
      close:"접기",
    },
    EN:{
      title:"What is KIUN · K-Energy?",
      sub:"When 2,000 years of Korean philosophy meets your wardrobe",
      sections:[
        {
          heading:"What is K-Energy (氣運)?",
          body:"K-Energy (氣運, Ki-un) is the life force that flows through people and nature. In Korean tradition, all things in the universe are composed of five energies — Wood, Fire, Earth, Metal, Water. Every person is born with a unique energy type that shapes their personality, vitality, and natural style."
        },
        {
          heading:"Saju (四柱) & Energy",
          body:"Saju (四柱, 'Four Pillars') is the Korean art of reading energy from the year, month, day, and hour of your birth. KIUN analyzes your Day Stem (日干) — the energy of your birth day — to determine your personal K-Energy type."
        },
        {
          heading:"What KIUN does",
          body:"KIUN (氣運) translates this 2,000-year-old wisdom into today's fashion language. It reveals the colors, textures, and silhouettes that harmonize with your energy — and reads how today's cosmic energy (日辰, iljin) meets yours to suggest the perfect outfit for the day."
        },
      ],
      els:[
        {e:"🌿",n:"Wood (木)",d:"Growth & freedom. Green & olive tones."},
        {e:"🔥",n:"Fire (火)",d:"Passion & intensity. Red & coral tones."},
        {e:"🌍",n:"Earth (土)",d:"Stability & trust. Camel & beige tones."},
        {e:"🪙",n:"Metal (金)",d:"Refinement & elegance. Silver & ivory tones."},
        {e:"💧",n:"Water (水)",d:"Depth & wisdom. Navy & charcoal tones."},
      ],
      close:"Close",
    },
    JP:{
      title:"KIUN · 気運とは？",
      sub:"2,000年の韓国哲学があなたのワードローブと出会うとき",
      sections:[
        {
          heading:"気運（キウン）とは？",
          body:"気運（氣運）とは、人と自然に流れるエネルギーのことです。韓国の伝統哲学では、宇宙のすべては五つの気運 — 木・火・土・金・水 — で構成されていると考えます。人はそれぞれ生まれた時に固有の気運を持ち、それが性格・体質・似合うスタイルを決めます。"
        },
        {
          heading:"四柱命理学と気運の関係",
          body:"四柱命理学（サジュ）は、生まれた年・月・日・時の四つの柱から気運を読む方法です。KIUNはその中の日干（ひっかん）— 生まれた日の気運 — を分析します。生年月日を入力するだけで、自分固有の気運タイプがわかります。"
        },
        {
          heading:"KIUNができること",
          body:"KIUN（氣運）は、この2,000年の伝統を現代のファッション言語に翻訳します。自分の気運に合うカラー・素材・シルエットを提案し、今日の日辰（天の気運）と自分の気運がどう出会うかを分析して、その日最適なコーデを教えてくれます。"
        },
      ],
      els:[
        {e:"🌿",n:"木（もく）",d:"成長と自由。グリーン・オリーブ系。"},
        {e:"🔥",n:"火（か）",d:"情熱と強烈さ。レッド・コーラル系。"},
        {e:"🌍",n:"土（ど）",d:"安定と信頼。キャメル・ベージュ系。"},
        {e:"🪙",n:"金（きん）",d:"洗練と優雅さ。シルバー・アイボリー系。"},
        {e:"💧",n:"水（すい）",d:"深みと知恵。ネイビー・チャコール系。"},
      ],
      close:"閉じる",
    },
  }[lang];

  return(
    <div style={{marginTop:28,width:"100%"}}>
      <button onClick={function(){setOpen(!open);}}
        style={{background:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,cursor:"pointer",display:"flex",alignItems:"center",gap:6,margin:"0 auto",color:SUB,fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600,padding:"8px 20px"}}>
        <span style={{fontSize:10,display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)",transition:"transform .25s"}}>▶</span>
        {btnLabel}
      </button>
      {open&&(
        <div style={{background:WHITE,borderRadius:20,padding:"24px 22px",marginTop:12,boxShadow:SHD}}>
          <div style={{fontSize:20,fontWeight:700,color:BLACK,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>{data.title}</div>
          <div style={{fontSize:12,color:MUTED,marginBottom:18,fontStyle:"italic"}}>{data.sub}</div>

          {/* 섹션 */}
          {data.sections.map(function(sec,i){
            return(
              <div key={i} style={{marginBottom:18}}>
                <div style={{fontSize:13,color:BLACK,fontWeight:700,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:3,height:14,background:BLACK,borderRadius:2,flexShrink:0}}></div>
                  {sec.heading}
                </div>
                <p style={{fontSize:13,color:SUB,lineHeight:1.9,margin:0}}>{sec.body}</p>
              </div>
            );
          })}

          {/* 오행 */}
          <div style={{fontSize:9,color:MUTED,fontFamily:"'DM Sans',sans-serif",letterSpacing:".2em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>
            {lang==="KO"?"다섯 가지 기운":lang==="JP"?"五つの気運":"The Five Energies"}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
            {data.els.map(function(el){
              return(
                <div key={el.n} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",border:"1.5px solid "+BORDER,borderRadius:12}}>
                  <span style={{fontSize:20,flexShrink:0}}>{el.e}</span>
                  <div>
                    <div style={{fontSize:13,color:BLACK,fontFamily:"'DM Sans',sans-serif",fontWeight:600,marginBottom:1}}>{el.n}</div>
                    <div style={{fontSize:11,color:SUB}}>{el.d}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={function(){setOpen(false);}} style={{background:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,padding:"7px 20px",fontSize:11,color:MUTED,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",width:"100%"}}>
            {data.close}
          </button>
        </div>
      )}
    </div>
  );
}

// ── 랜딩 ──────────────────────────────────────────────
function Landing({lang,setLang,onDone}){
  var [year,setYear]=useState("");var [month,setMonth]=useState("");var [day,setDay]=useState("");
  var [gender,setGender]=useState("");
  var maxDay=year&&month?new Date(+year,+month,0).getDate():31;
  var days=Array.from({length:maxDay},function(_,i){return i+1;});
  var ready=!!(year&&month&&day&&gender);
  var t=TX[lang];
  var ldata={KO:{h1a:"What's your",h1b:"K-Energy type?",lbl:"생년월일 · 성별 입력",ly:"태어난 해",lm:"달",ld:"일",py:"년도",pm:"월",pd:"일",ys:"년",ds:"일",rf:function(y,m,d){return y+"년 "+m+"월 "+d+"일";},go:"기운 진단 시작하기",wait:"생년월일과 성별을 입력해주세요",p:"생년월일로 나만의 오행 기운을 진단하고\n오늘의 패션을 완성하세요",glbl:"성별",gf:"여성",gm:"남성"},EN:{h1a:"What's your",h1b:"K-Energy type?",lbl:"Birth Date & Gender",ly:"Birth Year",lm:"Month",ld:"Day",py:"Year",pm:"Month",pd:"Day",ys:"",ds:"",rf:function(y,m,d){return y+" / "+m+" / "+d;},go:"Discover My K-Energy",wait:"Please enter your birth date & gender",p:"Find your unique Korean energy type through Saju\nand let it guide your style every day",glbl:"Gender",gf:"Female",gm:"Male"},JP:{h1a:"あなたの",h1b:"K-エネルギータイプは？",lbl:"生年月日・性別を入力",ly:"生まれた年",lm:"月",ld:"日",py:"年",pm:"月",pd:"日",ys:"年",ds:"日",rf:function(y,m,d){return y+"年 "+m+"月 "+d+"日";},go:"気運を診断する",wait:"生年月日と性別を入力してください",p:"生年月日で五行の気運を診断し\n毎日のファッションをガイドします",glbl:"性別",gf:"女性",gm:"男性"}}[lang];
  function ss(v){return{width:"100%",background:WHITE,border:"1.5px solid "+(v?BLACK:BORDER),borderRadius:12,padding:"11px 12px",color:v?BLACK:MUTED,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,appearance:"none",WebkitAppearance:"none"};}
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"56px 22px 40px",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:"fixed",top:16,right:18,zIndex:100}}><LT lang={lang} onChange={setLang}/></div>
      <div style={{width:"100%",maxWidth:440,textAlign:"center"}}>
        <div style={{fontSize:11,color:MUTED,letterSpacing:".35em",marginBottom:22,fontWeight:600}}>KIUN · 氣運</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:22}}>{["🌿","🔥","🌍","🪙","💧"].map(function(em){return <span key={em} style={{fontSize:28,lineHeight:1}}>{em}</span>;})}</div>
        <h1 style={{fontSize:"clamp(32px,7vw,52px)",fontWeight:800,color:BLACK,lineHeight:1.1,marginBottom:14,letterSpacing:"-.02em"}}>
          <span style={{display:"block",fontSize:"clamp(16px,3.5vw,24px)",fontWeight:400,color:SUB,marginBottom:4}}>{ldata.h1a}</span>{ldata.h1b}
        </h1>
        <p style={{fontSize:14,color:SUB,lineHeight:1.8,marginBottom:24,whiteSpace:"pre-line"}}>{ldata.p}</p>

        {/* 스텝 가이드 */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28,width:"100%",maxWidth:320}}>
          {[
            {n:"01", KO:"생년월일과 성별을 입력하세요", EN:"Enter your birth date & gender", JP:"生年月日と性別を入力"},
            {n:"02", KO:"나만의 K-에너지 기운을 진단받으세요", EN:"Discover your K-Energy type", JP:"あなたの気運タイプを診断"},
            {n:"03", KO:"오늘의 스타일링을 받으세요", EN:"Get today's personalized styling", JP:"今日のスタイリングを受け取る"},
            {n:"04", KO:"나와 같은 기운의 K스타를 찾아보세요", EN:"Find out which K-Star shares your energy", JP:"同じ気運のK-スターを見つけよう"},
          ].map(function(step){
            return(
              <div key={step.n} style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:10,color:MUTED,fontFamily:"monospace",fontWeight:700,flexShrink:0,letterSpacing:".05em"}}>{step.n}</span>
                <div style={{flex:1,height:1,background:BORDER}}></div>
                <span style={{fontSize:12,color:SUB,fontWeight:500,textAlign:"right"}}>{step[lang]}</span>
              </div>
            );
          })}
        </div>
        <div style={{marginBottom:28}}>
          <div style={{fontSize:16,color:BLACK,letterSpacing:"-.01em",marginBottom:12,fontWeight:800,textAlign:"center"}}>{t.celebTitle}</div>
          <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
            {Object.keys(CELEBS).map(function(id){return <span key={id} style={{background:WHITE,border:"1.5px solid "+BORDER,borderRadius:RD,padding:"8px 16px",fontSize:22,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>{EL[id].emoji}</span>;})}
          </div>
        </div>
        <div style={{background:WHITE,borderRadius:20,padding:"26px 22px",boxShadow:SHD}}>
          <div style={{fontSize:11,color:MUTED,letterSpacing:".22em",textTransform:"uppercase",textAlign:"center",marginBottom:20,fontWeight:600}}>{ldata.lbl}</div>
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:8,marginBottom:14}}>
            <div><div style={{fontSize:9,color:MUTED,letterSpacing:".15em",marginBottom:5,fontWeight:600}}>{ldata.ly}</div>
              <select value={year} style={ss(year)} onChange={function(e){setYear(e.target.value);setDay("");}}>
                <option value="">{ldata.py}</option>{YEARS.map(function(y){return <option key={y} value={y}>{y}{ldata.ys}</option>;})}
              </select></div>
            <div><div style={{fontSize:9,color:MUTED,letterSpacing:".15em",marginBottom:5,fontWeight:600}}>{ldata.lm}</div>
              <select value={month} style={ss(month)} onChange={function(e){setMonth(e.target.value);setDay("");}}>
                <option value="">{ldata.pm}</option>{MON[lang].map(function(m,i){return <option key={i} value={i+1}>{m}</option>;})}
              </select></div>
            <div><div style={{fontSize:9,color:MUTED,letterSpacing:".15em",marginBottom:5,fontWeight:600}}>{ldata.ld}</div>
              <select value={day} style={ss(day)} onChange={function(e){setDay(e.target.value);}}>
                <option value="">{ldata.pd}</option>{days.map(function(d){return <option key={d} value={d}>{d}{ldata.ds}</option>;})}
              </select></div>
          </div>
          {ready&&<div style={{border:"1.5px solid "+BORDER,borderRadius:10,padding:"8px 14px",fontSize:12,color:SUB,textAlign:"center",marginBottom:12,fontWeight:500}}>{ldata.rf(year,month,day)} · {gender===("F")?ldata.gf:ldata.gm}</div>}
          {/* 성별 선택 */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:9,color:MUTED,letterSpacing:".15em",marginBottom:8,fontWeight:600}}>{ldata.glbl}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[{val:"F",label:ldata.gf},{val:"M",label:ldata.gm}].map(function(g){
                return(
                  <button key={g.val} onClick={function(){setGender(g.val);}}
                    style={{background:gender===g.val?BLACK:WHITE,color:gender===g.val?WHITE:BLACK,border:"1.5px solid "+(gender===g.val?BLACK:BORDER),borderRadius:12,padding:"11px",fontSize:14,cursor:"pointer",fontWeight:700,transition:"all .15s"}}>
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Pill solid onClick={function(){if(ready)onDone(+year,+month,+day,gender);}} disabled={!ready} style={{width:"100%",padding:"14px",fontSize:15}}>{ready?ldata.go:ldata.wait}</Pill>
        </div>
        <WhatIsSaju lang={lang}/>
      </div>
    </div>
  );
}

// ── 로딩 ──────────────────────────────────────────────
function Loader({lang}){
  var msgs={KO:["천기를 읽는 중...","오행 기운 분석 중...","나만의 스타일 찾는 중..."],EN:["Reading the heavens...","Analyzing your K-Energy...","Finding your style..."],JP:["天機を読んでいます...","五行の気運を分析中...","あなたのスタイルを探しています..."]}[lang];
  var [step,setStep]=useState(0);
  useEffect(function(){var t1=setTimeout(function(){setStep(1);},1200);var t2=setTimeout(function(){setStep(2);},2400);return function(){clearTimeout(t1);clearTimeout(t2);};},[]);
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:"relative",width:72,height:72}}>
        <svg viewBox="0 0 80 80" width="72" height="72" style={{animation:"kspin 8s linear infinite",position:"absolute"}}>
          {["木","火","土","金","水"].map(function(ch,i){var a=(i*72-90)*Math.PI/180;return <text key={ch} x={40+27*Math.cos(a)} y={40+27*Math.sin(a)} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={MUTED} fontFamily="serif">{ch}</text>;})}
        </svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:22,color:BLACK,fontFamily:"serif"}}>氣</div>
      </div>
      <div style={{fontSize:13,color:SUB,letterSpacing:".08em",fontWeight:500}}>{msgs[step]}</div>
      <div style={{display:"flex",gap:6}}>{[0,1,2].map(function(i){return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:step>=i?BLACK:BORDER,transition:"background .4s"}}></div>;})}</div>
    </div>
  );
}

// ── 대시보드 ───────────────────────────────────────────
function Dashboard({myElId,myElStem,myGender,lang,setLang,onReset}){
  var [tab,setTab]=useState("today");
  var [situation,setSituation]=useState("");
  var [aiResult,setAiResult]=useState(null);
  var [aiLoading,setAiLoading]=useState(false);
  var [aiError,setAiError]=useState(null);
  var [isRec,setIsRec]=useState(false);
  var [voiceOk,setVoiceOk]=useState(false);
  var [showAff,setShowAff]=useState(false);
  var [affIds,setAffIds]=useState({musinsa:"",cm29:"",coupang:"",ably:""});
  var [shareMsg,setShareMsg]=useState("");
  var recogRef=useRef(null);

  var e=EL[myElId];
  var ij=getIljin();
  var td=EL[ij.elId];
  var rel=getRelation(myElId,ij.elId);
  var relPow=REL_POW[rel];
  var celebs=CELEBS[myElId]||[];
  var t=TX[lang];
  var activeN=Object.values(affIds).filter(Boolean).length;
  var dateStr=new Date().toLocaleDateString(lang==="JP"?"ja-JP":lang==="EN"?"en-US":"ko-KR",{month:"long",day:"numeric",weekday:"short"});

  useEffect(function(){setVoiceOk(!!(window.SpeechRecognition||window.webkitSpeechRecognition));},[]);

  function toggleVoice(){
    if(isRec){if(recogRef.current)recogRef.current.stop();setIsRec(false);return;}
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return;
    var r=new SR();r.lang=lang==="KO"?"ko-KR":lang==="JP"?"ja-JP":"en-US";r.continuous=true;r.interimResults=false;
    r.onstart=function(){setIsRec(true);};r.onend=function(){setIsRec(false);};r.onerror=function(){setIsRec(false);};
    r.onresult=function(ev){var txt=Array.from(ev.results).map(function(x){return x[0].transcript;}).join("");setSituation(function(p){return p?p+" "+txt:txt;});};
    recogRef.current=r;r.start();
  }

  function generateStyle(){
    if(!situation.trim()||aiLoading)return;
    setAiLoading(true);setAiResult(null);setAiError(null);
    fetch("/api/style",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:buildAIPrompt(myElId,ij.elId,rel,situation,lang,myGender)})})
    .then(function(r){
      return r.json().then(function(data){
        return {ok:r.ok, status:r.status, data:data};
      });
    })
    .then(function(res){
      if(!res.ok){
        throw new Error("API 오류 "+res.status+": "+(res.data.error||"알 수 없는 오류"));
      }
      if(res.data.error){
        throw new Error(res.data.error);
      }
      var raw=(res.data.content&&res.data.content[0]&&res.data.content[0].text)||"";
      if(!raw){
        throw new Error("AI 응답이 비어있어요. API 키를 확인해주세요.");
      }
      var text=raw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
      var parsed={};
      try{parsed=JSON.parse(text);}catch(e){}
      // 결과가 비어있으면 재시도 안내
      if(!parsed.headline&&!parsed.energyMsg){
        throw new Error(lang==="KO"?"AI가 일시적으로 과부하 상태예요. 잠시 후 다시 시도해주세요.":lang==="JP"?"AIが一時的に高負荷状態です。しばらくしてからもう一度お試しください。":"The AI is temporarily overloaded. Please try again in a moment.");
      }
      setAiResult(parsed);
    })
    .catch(function(e){
      setAiError(e.message);
    })
    .finally(function(){setAiLoading(false);});
  }

  function handleShare(){
    doShare(buildShareText(myElId,lang)).then(function(result){
      if(result==="copied"||result==="shared"){
        var msg=result==="copied"?(lang==="KO"?"복사됨 — SNS에 붙여넣기 하세요":lang==="JP"?"コピーされました":"Copied — paste on social media"):(lang==="KO"?"공유됨!":lang==="JP"?"シェアされました!":"Shared!");
        setShareMsg(msg);
        setTimeout(function(){setShareMsg("");},2500);
      }
    });
  }

  var COMING=[{emoji:"👕",KO:"오행 프린트 티셔츠",EN:"Element Print T-Shirt",JP:"五行プリントTシャツ",note:{KO:"나의 기운 한자 프린트",EN:"Hanja element print",JP:"漢字プリント"}},{emoji:"🧢",KO:"기운 버킷햇",EN:"Energy Bucket Hat",JP:"気運バケットハット",note:{KO:"오행 자수 로고",EN:"Embroidered ohaeng logo",JP:"五行刺繍ロゴ"}},{emoji:"🛍",KO:"KIUN 토트백",EN:"KIUN Tote Bag",JP:"KIUNトートバッグ",note:{KO:"오행 컬러 캔버스",EN:"Ohaeng color canvas",JP:"五行カラーキャンバス"}}];

  return(
    <div style={{minHeight:"100vh",background:BG,color:BLACK,fontFamily:"'DM Sans',sans-serif"}}>
      {/* 상단 바 */}
      <div style={{background:WHITE,borderBottom:"1px solid "+BORDER,padding:"0 16px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <span style={{fontSize:13,letterSpacing:".25em",color:BLACK,fontFamily:"monospace",fontWeight:600}}>KIUN · 氣運</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <LT lang={lang} onChange={setLang}/>
          <Pill onClick={onReset} style={{padding:"4px 12px",fontSize:11}}>{t.rediag}</Pill>
        </div>
      </div>
      {/* 탭 */}
      <div style={{display:"flex",background:WHITE,borderBottom:"1px solid "+BORDER,position:"sticky",top:54,zIndex:40}}>
        {[["today",t.tabt],["shop",t.tabs],["frag",t.tabf]].map(function(item){
          var id=item[0],label=item[1];
          return <button key={id} onClick={function(){setTab(id);}} style={{flex:1,background:"transparent",border:"none",borderBottom:"2.5px solid "+(tab===id?BLACK:"transparent"),color:tab===id?BLACK:MUTED,padding:"13px 4px",fontSize:12,cursor:"pointer",fontWeight:tab===id?700:400,transition:"all .15s"}}>{label}</button>;
        })}
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 16px 64px"}}>

        {/* ══ 오늘의 기운 ══ */}
        {tab==="today"&&(
          <div>
            <div style={{fontSize:11,color:MUTED,textAlign:"center",marginBottom:18,fontWeight:500}}>{dateStr}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              <Card style={{textAlign:"center",marginBottom:0}}><Lbl>{t.myEl}</Lbl><div style={{fontSize:36,marginBottom:6}}>{e.emoji}</div><div style={{fontSize:15,color:BLACK,fontWeight:700,marginBottom:3}}>{e.name[lang]}</div><div style={{fontSize:11,color:SUB}}>{t.stem(myElStem)}</div><div style={{fontSize:9,color:MUTED,marginTop:2}}>{t.fixEl}</div></Card>
              <Card style={{textAlign:"center",marginBottom:0}}><Lbl>{t.tdEl} · {ij.label}</Lbl><div style={{fontSize:36,marginBottom:6}}>{td.emoji}</div><div style={{fontSize:15,color:BLACK,fontWeight:700,marginBottom:3}}>{td.name[lang]}</div><div style={{fontSize:11,color:SUB}}>{td.type[lang]}</div><div style={{fontSize:9,color:MUTED,marginTop:2}}>{t.dayEl}</div></Card>
            </div>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,color:BLACK,fontWeight:700}}>{REL_BADGE[rel][lang]}</span>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:9,color:MUTED,marginRight:4,fontWeight:600}}>{t.pow}</span>
                  {[1,2,3,4,5].map(function(i){return <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<=relPow?BLACK:BORDER}}></div>;})}
                </div>
              </div>
              <div style={{borderTop:"1px solid "+BORDER,margin:"10px 0"}}></div>
              <p style={{fontSize:13,color:SUB,lineHeight:1.8,margin:0}}>{REL_MSG[rel][lang]}</p>
            </Card>
            <ElRelSection myElId={myElId} lang={lang} t={t}/>
            {/* K-스타 */}
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <Lbl>{t.celebTitle}</Lbl><span style={{fontSize:9,color:MUTED,fontWeight:600}}>{t.celebNote}</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {celebs.map(function(cel){return(<div key={cel.name} style={{border:"1.5px solid "+BORDER,borderRadius:12,padding:"9px 13px",display:"flex",alignItems:"center",gap:9,background:BG}}><div style={{width:30,height:30,borderRadius:"50%",background:WHITE,border:"1.5px solid "+BORDER,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontFamily:"serif",color:BLACK,flexShrink:0,fontWeight:700}}>{cel.stem}</div><div><div style={{fontSize:13,color:BLACK,fontWeight:700}}>{cel.name}</div><div style={{fontSize:10,color:MUTED}}>{cel.group[lang]} · {cel.birth}</div></div></div>);})}
              </div>
            </Card>
            {/* 공유 */}
            <Card style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:6}}>{e.emoji}</div>
              <div style={{fontSize:18,color:BLACK,fontWeight:800,marginBottom:4}}>{e.name[lang]}</div>
              <div style={{fontSize:12,color:SUB,marginBottom:16}}>
                {lang==="KO"?celebs.slice(0,2).map(function(c){return c.name;}).join(", ")+"와 같은 기운":lang==="JP"?celebs.slice(0,2).map(function(c){return c.name;}).join("・")+"と同じ気運":"Same energy as "+celebs.slice(0,2).map(function(c){return c.name;}).join(" & ")}
              </div>
              {/* 플랫폼별 공유 버튼 */}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {/* 텍스트 복사 — 인스타·틱톡 캡션용 */}
                <button onClick={function(){
                  var text=buildShareText(myElId,lang);
                  navigator.clipboard.writeText(text).then(function(){setShareMsg("copied");setTimeout(function(){setShareMsg("");},2500);});
                }} style={{width:"100%",background:BLACK,border:"none",borderRadius:RD,padding:"12px",color:WHITE,fontSize:13,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <span>{shareMsg==="copied"?(lang==="KO"?"✓ 복사됨 — 캡션에 붙여넣기":lang==="JP"?"✓ コピー済み":"✓ Copied — paste as caption"):(lang==="KO"?"SNS 캡션 복사":lang==="JP"?"SNSキャプションコピー":"Copy SNS Caption")}</span>
                </button>
                {/* Twitter/X — 직접 공유 가능 */}
                <a href={"https://twitter.com/intent/tweet?text="+encodeURIComponent(buildShareText(myElId,lang))}
                  target="_blank" rel="noreferrer"
                  style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:RD,padding:"11px",color:BLACK,fontSize:13,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,textDecoration:"none",boxSizing:"border-box"}}>
                  <span style={{fontWeight:800}}>𝕏</span>
                  <span>Twitter / X {lang==="KO"?"공유":lang==="JP"?"シェア":"Share"}</span>
                </a>
              </div>
              <div style={{fontSize:10,color:MUTED,marginTop:10,lineHeight:1.6}}>
                {lang==="KO"?"인스타·틱톡: 텍스트 복사 후 게시물 캡션에 붙여넣기":lang==="JP"?"Instagram・TikTok: テキストをコピーしてキャプションに貼り付け":"Instagram · TikTok: Copy text → paste as post caption"}
              </div>
            </Card>

            {/* 기운 오브젝트 진입 버튼 */}
            <button onClick={function(){setTab("frag");}}
              style={{width:"100%",background:WHITE,border:"1.5px solid "+BORDER,borderRadius:16,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:16,boxShadow:SHD}}>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:13,color:BLACK,fontWeight:700,marginBottom:2}}>
                  {lang==="KO"?"기운 오브젝트":lang==="JP"?"気運コレクション":"Energy Objects"}
                </div>
                <div style={{fontSize:11,color:MUTED}}>
                  {lang==="KO"?"나의 기운을 담은 향수 · 티셔츠 · 모자 준비 중":lang==="JP"?"気運を込めた香水・Tシャツ・帽子 準備中":"Fragrance · T-shirt · Hat coming soon"}
                </div>
              </div>
              <span style={{fontSize:16,color:MUTED}}>→</span>
            </button>

            {/* 채팅 입력 */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:20,fontWeight:800,color:BLACK,marginBottom:4,letterSpacing:"-.02em"}}>{t.chatTitle}</div>
              <div style={{fontSize:13,color:SUB,lineHeight:1.6,marginBottom:12}}>{t.chatSub}</div>
              <div style={{background:WHITE,borderRadius:16,overflow:"hidden",boxShadow:SHD}}>
                <textarea value={situation} rows={4} onChange={function(ev){setSituation(ev.target.value);}} placeholder={t.placeholder} style={{width:"100%",background:"transparent",border:"none",padding:"16px 18px 10px",color:BLACK,fontSize:14,lineHeight:1.8,resize:"none",outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderTop:"1px solid "+BORDER}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {voiceOk?<button onClick={toggleVoice} style={{background:isRec?BLACK:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,padding:"5px 14px",fontSize:11,color:isRec?WHITE:SUB,cursor:"pointer",fontWeight:600}}>{isRec?t.voiceOff:t.voiceOn}</button>:<span style={{fontSize:10,color:MUTED}}>{t.voiceNo}</span>}
                    {isRec&&<span style={{fontSize:10,color:SUB,fontWeight:700}}>● REC</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:MUTED}}>{situation.length}</span>
                    <Pill solid onClick={generateStyle} disabled={!situation.trim()||aiLoading} style={{padding:"7px 18px",fontSize:12}}>{aiLoading?t.generating:t.generate}</Pill>
                  </div>
                </div>
              </div>
              {!aiResult&&!aiLoading&&<div style={{fontSize:11,color:MUTED,marginTop:6,textAlign:"center",fontWeight:500}}>{t.hint}</div>}
            </div>
            {aiError&&(
              <Card style={{textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:10}}>⏳</div>
                <p style={{fontSize:14,color:BLACK,fontWeight:700,marginBottom:6}}>
                  {lang==="KO"?"잠시 후 다시 시도해주세요":lang==="JP"?"しばらくしてからお試しください":"Please try again in a moment"}
                </p>
                <p style={{fontSize:12,color:SUB,lineHeight:1.7,marginBottom:16}}>{aiError}</p>
                <Pill onClick={function(){setAiError(null);}} style={{width:"100%",padding:10,fontSize:13}}>
                  {lang==="KO"?"↺ 다시 시도":lang==="JP"?"↺ 再試行":"↺ Try Again"}
                </Pill>
              </Card>
            )}
            {aiLoading&&(
              <div style={{textAlign:"center",padding:"22px 0"}}>
                <div style={{position:"relative",width:44,height:44,margin:"0 auto 12px"}}>
                  <svg viewBox="0 0 80 80" width="44" height="44" style={{animation:"kspin 5s linear infinite",position:"absolute"}}>{["木","火","土","金","水"].map(function(ch,i){var a=(i*72-90)*Math.PI/180;return <text key={ch} x={40+26*Math.cos(a)} y={40+26*Math.sin(a)} textAnchor="middle" dominantBaseline="central" fontSize="12" fill={MUTED} fontFamily="serif">{ch}</text>;})}
                  </svg>
                  <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:16,color:BLACK,fontFamily:"serif"}}>氣</div>
                </div>
                <div style={{fontSize:12,color:MUTED,fontWeight:500}}>{t.generating}</div>
              </div>
            )}
            {aiResult&&!aiLoading&&(
              <div>
                {(function(){
                  function s(v){return typeof v==="string"?v:(v&&typeof v==="object"?JSON.stringify(v):String(v||""));}
                  function sa(v){return Array.isArray(v)?v.map(function(i){return s(i);}):(v?[s(v)]:[]);}
                  var headline=s(aiResult.headline);
                  var energyMsg=s(aiResult.energyMsg);
                  var keywords=sa(aiResult.keywords);
                  var wardrobeColors=s(aiResult.wardrobeColors);
                  var wardrobeItems=sa(aiResult.wardrobeItems);
                  var wardrobeTip=s(aiResult.wardrobeTip);
                  var avoidColor=s(aiResult.avoidColor);
                  var avoidReason=s(aiResult.avoidReason);
                  var keyItem=s(aiResult.keyItem);
                  var keyItemReason=s(aiResult.keyItemReason);
                  var situationTip=s(aiResult.situationTip);
                  var shoppingKeyword=s(aiResult.shoppingKeyword);
                  return(
                    <div>
                      <Card style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:BLACK,marginBottom:8}}>"{headline}"</div><p style={{fontSize:13,color:SUB,lineHeight:1.9,margin:0}}>{energyMsg}</p></Card>
                      {keywords.length>0&&<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:12,flexWrap:"wrap"}}>{keywords.map(function(kw){return <span key={kw} style={{border:"1.5px solid "+BLACK,borderRadius:RD,padding:"4px 14px",fontSize:12,color:BLACK,fontWeight:600}}>#{kw}</span>;})}</div>}
                      <Card>
                        <Lbl>{t.wdTitle}</Lbl>
                        <div style={{marginBottom:10}}><div style={{fontSize:9,color:MUTED,fontWeight:600,marginBottom:5}}>{t.wdColors}</div><div style={{fontSize:17,color:BLACK,fontWeight:700}}>{wardrobeColors}</div></div>
                        <div style={{marginBottom:10}}><div style={{fontSize:9,color:MUTED,fontWeight:600,marginBottom:5}}>{t.wdItems}</div>{wardrobeItems.map(function(item,i){return <div key={i} style={{display:"flex",gap:8,fontSize:13,color:SUB,paddingBottom:6,marginBottom:6,borderBottom:"1px solid "+BORDER}}>— {item}</div>;})}</div>
                        <div style={{background:BG,borderRadius:10,padding:"9px 13px",fontSize:12,color:SUB,fontWeight:500}}>{wardrobeTip}</div>
                      </Card>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                        <Card style={{marginBottom:0}}><Lbl>{t.avoidTitle}</Lbl><div style={{fontSize:14,color:BLACK,fontWeight:700,marginBottom:3}}>{avoidColor}</div><div style={{fontSize:11,color:SUB,lineHeight:1.6}}>{avoidReason}</div></Card>
                        <Card style={{marginBottom:0}}><Lbl>{t.keyTitle}</Lbl><div style={{fontSize:14,color:BLACK,fontWeight:700,marginBottom:3}}>{keyItem}</div><div style={{fontSize:11,color:SUB,lineHeight:1.6}}>{keyItemReason}</div></Card>
                      </div>
                      {situationTip&&<Card style={{borderLeft:"3px solid "+BLACK,borderRadius:"0 12px 12px 0"}}><Lbl>{t.sitTip}</Lbl><p style={{fontSize:13,color:BLACK,lineHeight:1.8,margin:0}}>{situationTip}</p></Card>}
                      {shoppingKeyword&&(
                        <Card>
                          <div style={{fontSize:11,color:MUTED,marginBottom:6,fontWeight:600}}>{t.shopTitle} — "{shoppingKeyword}"</div>
                          <ShopButtons kw={shoppingKeyword} lang={lang} affIds={affIds} t={t}/>
                          <button onClick={function(){setTab("shop");}} style={{marginTop:10,background:"transparent",border:"1.5px solid "+BORDER,borderRadius:RD,padding:"8px 18px",fontSize:12,color:BLACK,cursor:"pointer",fontWeight:600}}>{t.shopTabBtn}</button>
                        </Card>
                      )}
                      <Pill onClick={function(){setAiResult(null);setSituation("");}} style={{width:"100%",padding:12,fontSize:13}}>{t.retry}</Pill>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ══ 오행 쇼핑 ══ */}
        {tab==="shop"&&(
          <div>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:48,marginBottom:10}}>{e.emoji}</div>
              <div style={{fontSize:22,color:BLACK,fontWeight:800,marginBottom:4,letterSpacing:"-.02em"}}>{e.type[lang]}</div>
              <div style={{fontSize:13,color:SUB}}>{e.desc[lang]}</div>
            </div>
            {activeN===0?<Card style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><span style={{fontSize:12,color:SUB,fontWeight:500}}>{t.noId}</span><Pill solid onClick={function(){setShowAff(true);}} style={{padding:"8px 16px",fontSize:12}}>{t.affSet}</Pill></Card>:<Card style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700}}>✓</span><span style={{fontSize:12,color:SUB,fontWeight:500}}>{t.activeAff(activeN)}</span></Card>}
            <Card>
              <Lbl>{t.cguide}</Lbl>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>{e.hex.map(function(h,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:"50%",background:h,border:"1.5px solid "+BORDER}}></div><div><div style={{fontSize:12,color:BLACK,fontWeight:600}}>{e.colors[lang][i]}</div><div style={{fontSize:9,color:MUTED,fontFamily:"monospace"}}>{h}</div></div></div>;})}
              </div>
              <div style={{fontSize:12,color:SUB}}>{t.matLbl}: <strong style={{color:BLACK}}>{e.mat[lang]}</strong> · {t.avoidLbl}: <strong style={{color:BLACK}}>{e.avoid[lang]}</strong></div>
            </Card>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{e.styles[lang].map(function(s){return <span key={s} style={{border:"1.5px solid "+BORDER,borderRadius:RD,padding:"5px 14px",fontSize:12,color:BLACK,fontWeight:500}}>{s}</span>;})}</div>
            <div><Lbl>{t.items}</Lbl>{e.products.map(function(p,i){return <ProductCard key={i} product={p} affIds={affIds} lang={lang} t={t}/>;})}</div>
            <AccSection myElId={myElId} rel={rel} affIds={affIds} lang={lang} t={t}/>
          </div>
        )}

        {/* ══ 기운 오브젝트 ══ */}
        {tab==="frag"&&(
          <div>
            {/* 헤더 */}
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:14}}>
                {["🌺","👕","🧢","🛍"].map(function(em){return <span key={em} style={{fontSize:24}}>{em}</span>;})}
              </div>
              <div style={{fontSize:22,color:BLACK,fontWeight:800,marginBottom:8,letterSpacing:"-.02em"}}>{t.objTitle}</div>
              <div style={{fontSize:13,color:SUB,lineHeight:1.7,maxWidth:320,margin:"0 auto"}}>{t.objSub}</div>
            </div>

            {/* 오행 상징 */}
            <Card style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:56,marginBottom:10}}>{e.hanja}</div>
              <div style={{fontSize:16,color:BLACK,fontWeight:700,marginBottom:4}}>{e.name[lang]}</div>
              <div style={{fontSize:12,color:SUB,fontStyle:"italic"}}>"{e.fragStory[lang]}"</div>
            </Card>

            {/* 출시 예정 아이템 전체 */}
            <div>
              <Lbl>{t.comingSoon}</Lbl>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {emoji:"🌺", KO:e.frag+" 오행 기운 향수", EN:e.frag+" K-Energy Fragrance", JP:e.frag+" 気運香水",
                   sub:{KO:e.fragNotes.KO+" · 50ml", EN:e.fragNotes.EN+" · 50ml", JP:e.fragNotes.JP+" · 50ml"},
                   price:"₩89,000", highlight:true},
                  {emoji:"👕", KO:"오행 프린트 티셔츠", EN:"Element Print T-Shirt", JP:"五行プリントTシャツ",
                   sub:{KO:"나의 기운 한자 프린트 · 오버핏", EN:"Hanja element print · Oversized fit", JP:"漢字プリント · オーバーサイズ"},
                   price:"₩49,000", highlight:false},
                  {emoji:"🧢", KO:"기운 버킷햇", EN:"Energy Bucket Hat", JP:"気運バケットハット",
                   sub:{KO:"오행 자수 로고 · 코튼 100%", EN:"Embroidered ohaeng logo · 100% cotton", JP:"五行刺繍ロゴ · コットン100%"},
                   price:"₩35,000", highlight:false},
                  {emoji:"🛍", KO:"KIUN 토트백", EN:"KIUN Tote Bag", JP:"KIUNトートバッグ",
                   sub:{KO:"오행 컬러 캔버스 · A4 수납 가능", EN:"Ohaeng color canvas · A4 size", JP:"五行カラーキャンバス · A4対応"},
                   price:"₩29,000", highlight:false},
                ].map(function(item){
                  return(
                    <div key={item.KO} style={{background:item.highlight?BLACK:WHITE,border:"1.5px solid "+(item.highlight?BLACK:BORDER),borderRadius:16,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
                      <span style={{fontSize:28,flexShrink:0}}>{item.emoji}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,color:item.highlight?WHITE:BLACK,fontWeight:700,marginBottom:3}}>{item[lang]}</div>
                        <div style={{fontSize:11,color:item.highlight?"rgba(255,255,255,0.6)":MUTED,lineHeight:1.5}}>{item.sub[lang]}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:15,color:item.highlight?WHITE:BLACK,fontWeight:800,marginBottom:4}}>{item.price}</div>
                        <span style={{fontSize:9,color:item.highlight?"rgba(255,255,255,0.7)":MUTED,border:"1.5px solid "+(item.highlight?"rgba(255,255,255,0.4)":BORDER),borderRadius:RD,padding:"2px 10px",fontWeight:600,whiteSpace:"nowrap"}}>
                          {t.soonTag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </div>
        )}
      </div>
      {showAff&&<AffModal ids={affIds} onSave={function(v){setAffIds(v);setShowAff(false);}} onClose={function(){setShowAff(false);}} lang={lang}/>}
    </div>
  );
}

// ── 루트 ──────────────────────────────────────────────
export default function KIUN(){
  var [screen,setScreen]=useState("landing");
  var [lang,setLang]=useState("EN");
  var [myElId,setMyElId]=useState(null);
  var [myElStem,setMyElStem]=useState(null);
  var [myGender,setMyGender]=useState(null);
  function handleDone(y,m,d,gender){var r=calcElFromDate(y,m,d);setMyElId(r.elId);setMyElStem(r.stem);setMyGender(gender);setScreen("loading");setTimeout(function(){setScreen("dashboard");},3700);}
  return(
    <div>
      <style dangerouslySetInnerHTML={{__html:"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');@keyframes kspin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0;padding:0}select{appearance:none;-webkit-appearance:none}body{background:#F3F0EB;font-family:'DM Sans',sans-serif}button:hover{opacity:.88}"}}/>
      {screen==="landing"&&<Landing lang={lang} setLang={setLang} onDone={handleDone}/>}
      {screen==="loading"&&<Loader lang={lang}/>}
      {screen==="dashboard"&&myElId&&<Dashboard myElId={myElId} myElStem={myElStem} myGender={myGender} lang={lang} setLang={setLang} onReset={function(){setMyElId(null);setMyGender(null);setScreen("landing");}}/>}
    </div>
  );
}
