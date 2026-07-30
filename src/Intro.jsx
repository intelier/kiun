import { useState } from "react";
import { Play, Menu, X } from "lucide-react";

// ── 오행 컬러 기반 배경 그라데이션 (원본 인물 영상 대체) ──
// KIUN 고유 로고: 오행(5요소)을 상징하는 정오각형 마크
function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="50,10 87.8,37.9 73.5,82.1 26.5,82.1 12.2,37.9"
        stroke="white"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="7" fill="white" />
    </svg>
  );
}

var TX = {
  KO: {
    nav: ["소개", "오행", "진단방법", "쇼핑", "문의"],
    brandL1: "KIUN",
    blurb: ["KIUN means 氣運 -", "the energy you carry", "today. A saju-based", "style companion."],
    col2L1: "매일의",
    doLabel: "WHAT WE DO",
    doBody: "매일 바뀌는 사주 기운을 읽고, 당신에게 꼭 맞는 컬러와 스타일을 AI가 제안합니다.",
    featLabel: "FEATURES",
    feats: ["오행 기반 진단", "AI 스타일링 리포트", "오늘의 일진 궁합", "K-스타 기운 매칭", "오행 쇼핑 가이드"],
    headline: ["매일 다른", "K-ENERGY", "완성하는 나의", "STYLING"],
    cta: "진단 시작하기",
    chips: [{ label: "ELEMENTS", n: "x5" }, { label: "LANGUAGES", n: "x3" }, { label: "AI MODELS", n: "x2" }],
    footL: "누구나 무료로 진단할 수 있어요. ",
    footLink: "지금 시작하기",
    footR: "오행 5가지 · 언어 3종 · AI 스타일 진단",
  },
  EN: {
    nav: ["ABOUT", "ELEMENTS", "HOW IT WORKS", "SHOP", "CONTACT"],
    brandL1: "KIUN",
    blurb: ["KIUN means 氣運 -", "the energy you carry", "today. A saju-based", "style companion."],
    col2L1: "DAILY",
    doLabel: "WHAT WE DO",
    doBody: "We read your daily saju energy and let AI recommend the colors and styles that fit you best.",
    featLabel: "FEATURES",
    feats: ["Ohaeng-based diagnosis", "AI styling report", "Today's fortune match", "K-star energy match", "Ohaeng shopping guide"],
    headline: ["DIFFERENT EVERY DAY", "K-ENERGY", "COMPLETES YOUR", "STYLING"],
    cta: "START DIAGNOSIS",
    chips: [{ label: "ELEMENTS", n: "x5" }, { label: "LANGUAGES", n: "x3" }, { label: "AI MODELS", n: "x2" }],
    footL: "Free for everyone to try. ",
    footLink: "Start now",
    footR: "5 elements • 3 languages • AI style diagnosis",
  },
  JP: {
    nav: ["紹介", "五行", "診断方法", "ショッピング", "お問い合わせ"],
    brandL1: "KIUN",
    blurb: ["KIUN means 氣運 -", "the energy you carry", "today. A saju-based", "style companion."],
    col2L1: "毎日の",
    doLabel: "WHAT WE DO",
    doBody: "毎日変わる四柱の気運を読み取り、AIがあなたに合うカラーとスタイルを提案します。",
    featLabel: "FEATURES",
    feats: ["五行ベース診断", "AIスタイリングレポート", "今日の日辰相性", "Kスター気運マッチ", "五行ショッピングガイド"],
    headline: ["毎日変わる", "K-ENERGY", "完成する", "STYLING"],
    cta: "診断を始める",
    chips: [{ label: "ELEMENTS", n: "x5" }, { label: "LANGUAGES", n: "x3" }, { label: "AI MODELS", n: "x2" }],
    footL: "誰でも無料で診断できます。",
    footLink: "今すぐ始める",
    footR: "五行5種 • 言語3種 • AIスタイル診断",
  },
};

function LangSwitch({ lang, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {["KO", "EN", "JP"].map(function (l) {
        return (
          <button
            key={l}
            onClick={function () { onChange(l); }}
            className={"rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-wide transition-colors " +
              (lang === l ? "border-white bg-white text-black" : "border-white/30 text-white/60 hover:opacity-70")}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export default function Intro({ lang, setLang, onEnter }) {
  var [menuOpen, setMenuOpen] = useState(false);
  var t = TX[lang] || TX.KO;

  function closeAndGo(fn) {
    setMenuOpen(false);
    if (fn) fn();
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* 배경: 오행 컬러 오로라 그라데이션 (원본 스펙의 개인 영상 URL 대체) */}
      <div className="absolute inset-0 h-full w-full kiun-aurora" />
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      <div className="relative z-10 flex h-full flex-col px-5 sm:px-6 md:px-10 lg:px-14">
        {/* 1. 내비게이션 */}
        <div className="flex items-center justify-between py-6">
          <Logo />
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-8 text-sm tracking-wide">
              {t.nav.map(function (n, i) {
                var isContact = i === t.nav.length - 1;
                return isContact ? (
                  <a key={n} href="mailto:sinkita@naver.com" className="hover:opacity-70 transition-opacity">{n}</a>
                ) : (
                  <a key={n} href="#" className="hover:opacity-70 transition-opacity">{n}</a>
                );
              })}
            </div>
            <LangSwitch lang={lang} onChange={setLang} />
          </div>
          <button onClick={function () { setMenuOpen(true); }} className="p-2 hover:opacity-70 transition-opacity md:hidden">
            <Menu size={24} />
          </button>
        </div>

        {/* 2. 4열 메타 그리드 */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div>
            <h2 className="text-lg md:text-xl tracking-wide leading-tight">
              <span className="block font-normal">{t.brandL1}</span>
              <span className="font-pixel text-2xl md:text-3xl block mt-1">氣運</span>
            </h2>
            <div className="text-[10px] text-white/50 mt-3">*</div>
            <div className="font-pixel mt-1 text-[9px] leading-relaxed text-white/60">
              {t.blurb.map(function (line, i) { return <div key={i}>{line}</div>; })}
            </div>
          </div>

          <div className="text-right lg:text-left">
            <h2 className="text-lg md:text-xl tracking-wide leading-tight">
              <span className="block font-normal">{t.col2L1}</span>
              <span className="font-pixel text-2xl md:text-3xl block mt-1">STYLING</span>
            </h2>
          </div>

          <div>
            <div className="font-pixel text-[10px] tracking-widest text-white/50 uppercase mb-3">{t.doLabel}</div>
            <div className="text-sm text-white/90 leading-relaxed max-w-[220px]">{t.doBody}</div>
          </div>

          <div className="text-right lg:text-left">
            <div className="font-pixel text-[10px] tracking-widest text-white/50 uppercase mb-3">{t.featLabel}</div>
            <ul className="text-sm text-white/90 leading-relaxed space-y-0.5">
              {t.feats.map(function (f) { return <li key={f}>{f}</li>; })}
            </ul>
          </div>
        </div>

        {/* 3. 스페이서 */}
        <div className="flex-1" />

        {/* 4. 하단 섹션 */}
        <div className="pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-end">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] tracking-wide uppercase font-normal"
              style={{ lineHeight: 0.9 }}
            >
              <span className="block">{t.headline[0]}</span>
              <span className="font-pixel font-normal text-[0.6em] inline-block leading-none align-baseline">{t.headline[1]}</span>
              <span className="block mt-2">{t.headline[2]}</span>
              <span className="font-pixel font-normal text-[0.6em] inline-block leading-none align-baseline mt-2">{t.headline[3]}</span>
            </h1>

            <div className="flex flex-col gap-4 sm:gap-6 justify-end">
              <button
                onClick={onEnter}
                className="self-start flex items-center gap-3 border border-white/30 px-6 py-3 backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Play size={14} fill="white" />
                <span className="text-sm tracking-wider">{t.cta}</span>
              </button>

              <div className="self-start lg:self-end flex flex-wrap items-stretch gap-2 sm:gap-3 text-sm text-white/80">
                {t.chips.map(function (c) {
                  return (
                    <div key={c.label} className="bg-[#0B0B0B] px-3 sm:px-4 py-2 flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm tracking-tight">{c.label}</span>
                      <span className="text-white/50 text-xs">{c.n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 pt-4 border-t border-white/10">
            <div className="text-xs text-white/60">
              {t.footL}
              <button onClick={onEnter} className="text-red-500 hover:text-red-400 transition-colors underline-offset-2">
                {t.footLink}
              </button>
            </div>
            <div className="text-xs text-white/60 sm:text-right">{t.footR}</div>
          </div>
        </div>
      </div>

      {/* 모바일 풀스크린 메뉴 */}
      <div
        className={"fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
          (menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Logo />
          <button onClick={function () { setMenuOpen(false); }} className="p-2 hover:opacity-70 transition-opacity">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-1 gap-8">
          {t.nav.map(function (n, i) {
            var isContact = i === t.nav.length - 1;
            var style = {
              transitionDelay: menuOpen ? (100 + i * 60) + "ms" : "0ms",
            };
            var cls = "text-2xl tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
              (menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4");
            return isContact ? (
              <a key={n} href="mailto:sinkita@naver.com" style={style} className={cls} onClick={function () { setMenuOpen(false); }}>{n}</a>
            ) : (
              <a key={n} href="#" style={style} className={cls} onClick={function () { setMenuOpen(false); }}>{n}</a>
            );
          })}
          <button
            style={{ transitionDelay: menuOpen ? (100 + t.nav.length * 60) + "ms" : "0ms" }}
            className={"text-2xl tracking-widest transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
              (menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
            onClick={function () { closeAndGo(onEnter); }}
          >
            {t.cta}
          </button>
          <LangSwitch lang={lang} onChange={setLang} />
        </nav>
      </div>
    </div>
  );
}
