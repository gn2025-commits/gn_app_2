// ==============================
// IPA用語データ（用語 → 定義）
// 必要に応じて追加・修正してください
// ==============================
const TERMS = [
  { term: "OSI参照モデル", def: "通信機能を7層に分けて標準化したモデル（物理～アプリケーション）" },
  { term: "正規化", def: "データの重複や更新異常を防ぐために表を分解する手法" },
  { term: "スループット", def: "単位時間当たりに処理できる仕事量" },
  { term: "レイテンシ", def: "処理開始までの遅延時間" },
  { term: "稼働率", def: "稼働時間を総時間で割った割合" },
  { term: "MTBF", def: "平均故障間隔" },
  { term: "MTTR", def: "平均修復時間" },
  { term: "可用性", def: "MTBF/(MTBF+MTTR) で表されるサービス継続性" },
  { term: "ファイアウォール", def: "内外ネットワーク間の通信を制御する装置／機能" },
  { term: "IDS/IPS", def: "侵入の検知／防止を行う仕組み" },
  { term: "DMZ", def: "公開サーバを配置する中間ネットワーク（非武装地帯）" },
  { term: "WAF", def: "Webアプリケーションへの攻撃を遮断する防御装置／機能" },
  { term: "DHCP", def: "IPアドレスなどネットワーク設定を自動割り当てする仕組み" },
  { term: "DNS", def: "ドメイン名とIPアドレスを相互変換する仕組み" },
  { term: "NAT", def: "プライベートIPとグローバルIPを相互変換する仕組み" },
  { term: "VPN", def: "暗号化された仮想専用回線を公衆網上に構成する仕組み" },
  { term: "公開鍵暗号", def: "公開鍵で暗号化し秘密鍵で復号する方式" },
  { term: "デジタル署名", def: "秘密鍵で署名し公開鍵で検証して改ざん検知・否認防止" },
  { term: "ハッシュ関数", def: "元に戻せない固定長の要約値を算出する関数" },
  { term: "ソルト", def: "ハッシュ前に付加し総当たり攻撃への耐性を上げる値" },
  { term: "リスク", def: "損失の可能性（脅威×脆弱性×影響）" },
  { term: "脅威", def: "損失をもたらし得る要因" },
  { term: "脆弱性", def: "脅威に悪用され得る弱点" },
  { term: "BCP", def: "事業継続のための方針・体制・手順を定めた計画" },
  { term: "RPO/RTO", def: "復旧時点目標／復旧時間目標" },
  { term: "デルファイ法", def: "専門家の匿名アンケートを反復して合意形成する手法" },
  { term: "E-R図", def: "実体と関係を表すデータモデリング図" },
  { term: "デッドロック", def: "相互待ちにより処理が停止する状態" },
  { term: "排他制御", def: "同時実行時に整合性を保つための資源制御" },
  { term: "アジャイル開発", def: "反復・適応的に価値を小刻みに提供する開発手法" },
  { term: "ウォーターフォール", def: "工程を上流から下流へ順次進める開発手法" },
  { term: "キャッシュメモリ", def: "CPUと主記憶の間で参照局所性を活用する高速記憶" },
  { term: "DRAM", def: "コンデンサで構成される大容量・低価格だが遅めの主記憶" },
  { term: "SRAM", def: "フリップフロップ構成の高速だが高価なメモリ" },
  { term: "スタック/キュー", def: "LIFO / FIFO のデータ構造" },
  { term: "API", def: "ソフトウェア機能を外部から呼び出すためのインタフェース" },
  { term: "多要素認証", def: "異なる認証要素の組合せ（知識・所持・生体）で認証" },
  { term: "XSS", def: "悪意スクリプトを埋め込み利用者側で実行させる攻撃" },
  { term: "CSRF", def: "利用者に意図しないリクエストを送信させる攻撃" },
  { term: "SQLインジェクション", def: "アプリの入力にSQLを混入させ不正実行させる攻撃" },
  { term: "CRLFインジェクション", def: "改行注入によりレスポンス分割等を引き起こす攻撃" },
  { term: "フェールセーフ", def: "故障時に安全側に制御する設計方針" },
  { term: "フェールソフト", def: "故障しても機能を縮退させ継続運用する設計" },
  { term: "RAID1", def: "ミラーリングにより冗長化する方式" },
  { term: "RAID5", def: "パリティを分散配置して冗長化する方式" },
];

// ==============================
// ユーティリティ
// ==============================
const el = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a,b) => a[0]-b[0]).map(([,v]) => v);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const nowJp = () => new Date().toLocaleString("ja-JP", { hour12: false });

// 履歴の保存キー
const HISTORY_KEY = "ipaQuizHistoryV1";

// ==============================
// 状態
// ==============================
let questions = [];      // [{term, def, options: [def...], correctIndex}]
let current = 0;
let score = 0;
let answers = [];        // [{chosenIndex, correctIndex, term, options, correct: boolean}]

// ==============================
// 画面表示切替
// ==============================
function showScreen(id) {
  el("#screen-start").style.display  = (id === "start")  ? "" : "none";
  el("#screen-quiz").style.display   = (id === "quiz")   ? "" : "none";
  el("#screen-result").style.display = (id === "result") ? "" : "none";
  el("#screen-history").style.display= (id === "history")? "" : "none";
}

// ==============================
// 出題生成
// ==============================
function createQuestions(count = 10) {
  const n = clamp(count, 5, Math.min(30, TERMS.length));
  const pool = shuffle(TERMS).slice(0, n);

  return pool.map((t) => {
    // 正解以外からランダムに3つ定義を取得
    const distractors = shuffle(TERMS.filter(x => x.term !== t.term)).slice(0, 3).map(x => x.def);
    // 選択肢（定義）を作成してシャッフル
    const options = shuffle([t.def, ...distractors]);
    const correctIndex = options.indexOf(t.def);
    return { term: t.term, def: t.def, options, correctIndex };
  });
}

// ==============================
// クイズ描画
// ==============================
function renderQuestion() {
  const q = questions[current];
  el("#q-index").textContent = String(current + 1);
  el("#q-total").textContent = String(questions.length);
  el("#q-term").textContent = q.term;
  el("#score").textContent = String(score);
  el("#bar").style.width = `${(current / questions.length) * 100}%`;
  el("#feedback").innerHTML = "";
  el("#btn-next").disabled = true;

  // 選択肢
  const cont = el("#options");
  cont.innerHTML = "";
  q.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.innerHTML = text;
    btn.addEventListener("click", () => onChoose(i));
    cont.appendChild(btn);
  });
}

// ==============================
// 回答処理
// ==============================
function onChoose(chosenIndex) {
  const q = questions[current];
  const isCorrect = chosenIndex === q.correctIndex;

  // スコア更新
  if (isCorrect) score++;

  // UI更新
  const buttons = $$(".opt");
  buttons.forEach((b, i) => {
    b.classList.add("disabled");
    if (i === q.correctIndex) b.classList.add("correct");
    if (i === chosenIndex && !isCorrect) b.classList.add("wrong");
  });

  // フィードバック
  el("#feedback").innerHTML = isCorrect
    ? `<div class="ok">正解！</div><div class="small muted">解説：${q.term} … ${q.def}</div>`
    : `<div class="ng">不正解</div><div class="small muted">正しくは：${q.term} … ${q.def}</div>`;

  // 回答記録
  answers.push({
    term: q.term,
    options: q.options,
    chosenIndex,
    correctIndex: q.correctIndex,
    correct: isCorrect,
  });

  el("#score").textContent = String(score);
  el("#btn-next").disabled = false;
}

// ==============================
// 結果表示・履歴保存
// ==============================
function finishQuiz() {
  el("#final-score").textContent = String(score);
  el("#final-total").textContent = String(questions.length);

  const detail = el("#result-detail");
  detail.innerHTML = "";
  answers.forEach((a, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:center;">
        <div><span class="badge">Q${idx+1}</span> <strong>${a.term}</strong></div>
        <div>${a.correct ? '✅' : '❌'}</div>
      </div>
      <div class="small" style="margin-top:6px;">
        あなたの選択：${a.options[a.chosenIndex]}<br/>
        正しい選択：${a.options[a.correctIndex]}
      </div>
    `;
    detail.appendChild(div);
  });

  // ローカル履歴へ保存
  const attempt = {
    id: crypto.randomUUID?.() ?? `attempt-${Date.now()}`,
    at: nowJp(),
    total: questions.length,
    score,
    answers,
  };
  saveHistory(attempt);

  showScreen("result");
}

// ==============================
// 履歴（ローカル）
// ==============================
function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(attempt) {
  const hist = loadHistory();
  hist.unshift(attempt);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

function renderHistory() {
  const list = el("#history-list");
  const hist = loadHistory();
  list.innerHTML = "";

  if (hist.length === 0) {
    list.innerHTML = `<div class="muted">まだ履歴はありません。</div>`;
    return;
  }

  hist.forEach((h) => {
    const wrap = document.createElement("div");
    wrap.className = "card";
    const rate = ((h.score / h.total) * 100).toFixed(0);
    wrap.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:center;">
        <div>
          <div><strong>${h.at}</strong></div>
          <div class="muted small">スコア：${h.score} / ${h.total}（${rate}%）</div>
        </div>
        <div class="badge">ID: ${h.id}</div>
      </div>
      <details style="margin-top:8px;">
        <summary>詳細を見る</summary>
        <div class="grid" style="margin-top:8px;">
          ${h.answers.map((a, i) => `
            <div class="card">
              <div class="row" style="justify-content:space-between;align-items:center;">
                <div><span class="badge">Q${i+1}</span> <strong>${a.term}</strong></div>
                <div>${a.correct ? '✅' : '❌'}</div>
              </div>
              <div class="small" style="margin-top:6px;">
                あなたの選択：${a.options[a.chosenIndex]}<br/>
                正しい選択：${a.options[a.correctIndex]}
              </div>
            </div>
          `).join("")}
        </div>
      </details>
    `;
    list.appendChild(wrap);
  });
}

// ==============================
// イベントと開始処理
// ==============================
function startQuiz() {
  const count = Number(el("#count").value || 10);
  questions = createQuestions(count);
  current = 0;
  score = 0;
  answers = [];
  showScreen("quiz");
  renderQuestion();
}

function nextOrFinish() {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    // 進捗バーを100%に
    el("#bar").style.width = "100%";
    finishQuiz();
  }
}

// 初期化
function init() {
  // ボタン
  el("#btn-start").addEventListener("click", startQuiz);
  el("#btn-next").addEventListener("click", nextOrFinish);
  el("#btn-retry").addEventListener("click", () => { showScreen("start"); });
  el("#btn-reset").addEventListener("click", () => { showScreen("start"); });

  // 履歴
  el("#btn-history").addEventListener("click", () => {
    renderHistory();
    showScreen("history");
  });
  el("#btn-open-history").addEventListener("click", () => {
    renderHistory();
    showScreen("history");
  });
  el("#btn-close-history").addEventListener("click", () => showScreen("start"));
  el("#btn-clear-history").addEventListener("click", () => {
    if (confirm("履歴を削除します。よろしいですか？")) {
      clearHistory();
      renderHistory();
    }
  });

  // 初期画面
  showScreen("start");
}

document.addEventListener("DOMContentLoaded", init);