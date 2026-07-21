import { useState } from "react";

function GeneratePage({ onAdd }) {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  const [type, setType] = useState("商品説明");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    // 入力チェック（空なら止める）
  if (!name) {
  alert("商品名を入力してください。");
  return;
}
if (!feature) {
  alert("特徴を入力してください。");
  return;
}

setLoading(true);

let prompt = "";
if (type === "商品説明") {
  prompt = `あなたは「車中泊女子向けのDIY車中泊キット専門店」のコピーライターです。DIY初心者の女性でも「私にも作れそう」と思えるように、手軽さと安心感が伝わる商品の説明文を100文字程度で書いてください。
商品名:${name}
特徴:${feature}`;
} else if (type === "SNS投稿文") {
  prompt = `あなたは車中泊を楽しむ女性の発信者です。DIY初心者の女性が、思わず「私も作ってみたい」と思うSNS投稿文を、ハッシュタグも添えて120文字程度で書いてください。
テーマ:${name}
特徴:${feature}`;
} else if (type === "ワークショップ告知") {
  prompt = `あなたは車中泊女子向けDIYワークショップの主催者です。参加者はDIY初心者の女性が中心で、経験者向けではありません。初めての人が「ここなら安心して参加できる」と感じられる、あたたかく歓迎する雰囲気の告知文を150文字程度で書いてください。
内容:${name}
詳細:${feature}`;
}

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      // 生成に失敗（キー違い・レート制限など）。落とさず知らせて止める
      alert("生成に失敗しました。\n" + (data.error?.message || ("エラー " + res.status)));
      setLoading(false);
      return;
    }
    const text = data.choices[0].message.content;

    const newItem = {
      id: Date.now(),
      name: name,
      body: text,
      status: "下書き",
    };

    onAdd(newItem); // ← App に「これを追加して」とお願いする
    // フォームをリセット（入力をクリア）
    setName("");
    setFeature("");

    setLoading(false);
  }

  return (
    <div className="generatePage">
      <h2>生成する</h2>
      <label>
        {type === "商品説明" ? "商品名"
        : type === "SNS投稿文" ? "テーマ"
        : "ワークショップ名"}
      </label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>
        {type === "商品説明" ? "特徴（カンマ区切りでOK）"
        : type === "SNS投稿文" ? "伝えたいこと"
        : "ワークショップの詳細"}
      </label>
      <input value={feature} onChange={(e) => setFeature(e.target.value)} />

      <label>生成の種類</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="商品説明">商品説明</option>
        <option value="SNS投稿文">SNS投稿文</option>
        <option value="ワークショップ告知">ワークショップ告知</option>
      </select>

      <button onClick={handleGenerate} disabled={loading || !name || !feature} className="generateBtn">
        {loading ? "生成中…" : "生成する"}
      </button>

      <p style={{ color: "#6b7280", marginTop: 12 }}>
        生成すると「ダッシュボード」に追加されます。
      </p>
    </div>
  );
}

export default GeneratePage;