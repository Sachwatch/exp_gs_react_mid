// import { useState } from "react";
// import ContentCard from "./components/ContentCard";

// function App() {
//   const [name, setName] = useState("");
//   const [feature, setFeature] = useState("");
//   const [tone, setTone] = useState("やさしい");
//   const [type, setType] = useState("商品説明");

//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [contents, setContents] = useState([]); // 生成物のリスト


// async function handleGenerate() {
//       setLoading(true);
//       setResult("");

//       // 入力から「お願い文」を組み立てる
//     let prompt = "";
//     if (type === "商品説明") {
//      prompt = `あなたは「車中泊女子向けのDIY車中泊キット専門店」のコピーライターです。女性目線で、手軽さと安心感が伝わる様に、次の商品の説明文を${tone}トーンで100文字程度で書いてください。
//      商品名:${name}
//      特徴:${feature}`;
//     } else if (type === "SNS投稿文") {
//       prompt = `あなたは車中泊を楽しむ女性の発信者です。次のキットや体験について、思わず「私も作ってみたい」と思わせるSNS投稿文を${tone}トーンで、ハッシュタグも添えて120文字程度で書いてください。
//       テーマ：${name}
//       特徴：${feature}`;
//     } else if (type === "ワークショップ告知") {
//       prompt = `あなたは車中泊女子向けDIYワークショップの主催者です。次のワークショップについて、初心者の女性が安心して参加したくなる告知文を${tone}トーンで150文字程度で書いてください。
//       内容：${name}
//       詳細：${feature}`;
//     }


//       const key = import.meta.env.VITE_GROQ_API_KEY;
//       console.log("KEYある?", !!key, "／ gsk_で始まる?", key?.startsWith("gsk_"));

//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${key}`,
//         },
//         body: JSON.stringify({
//           model: "llama-3.3-70b-versatile",
//           messages: [{ role: "user", content: prompt }],
//         }),
//       });

//       const data = await res.json();
//       const text = data.choices[0].message.content;

//        // 新しい生成物を1件つくる
//     const newItem = {
//       id: Date.now(),      // 重複しない id（ミリ秒の数）
//       name: name,
//       body: text,
//       status: "下書き",
//     };

//       console.log("status:", res.status, "body:", data);

//       if (!res.ok) {
//         setResult("エラー " + res.status + "：" + (data.error?.message || "不明"));
//         setLoading(false);
//         return;
//       }
//       setResult(data.choices[0].message.content);
//       setContents([newItem, ...contents]);
//       setLoading(false);
//     }

//   return (
//      <div style={{ padding: 24, maxWidth: 480 }}>
//       <h1>DIY車中泊女子向け コンテンツジェネレーター</h1>

//       <label>
//         {type === "商品説明" ? "商品名"
//         : type === "SNS投稿文" ? "テーマ"
//         : "ワークショップ名"}
//         </label>
//       <input value={name} onChange={(e) => setName(e.target.value)} />

//       <label>
//         {type === "商品説明" ? "特徴（カンマ区切りでOK）"
//         : type === "SNS投稿文" ? "伝えたいこと"
//         : "ワークショップの詳細"}
//         </label>
//       <input value={feature} onChange={(e) => setFeature(e.target.value)} />

//       <label>トーン</label>
//       <select value={tone} onChange={(e) => setTone(e.target.value)}>
//         <option value="やさしい">やさしい</option>
//         <option value="かっこいい">かっこいい</option>
//         <option value="ていねい">ていねい</option>
//       </select>

//       <label>生成の種類</label>
//       <select value={type} onChange={(e) => setType(e.target.value)}>
//         <option value="商品説明">商品説明</option>
//         <option value="SNS投稿文">SNS投稿文</option>
//         <option value="ワークショップ告知">ワークショップ告知</option>
//       </select>



//       <button onClick={handleGenerate} disabled={loading} className="generateBtn">
//       {loading ? "生成中…" : "生成する"}
//       </button>

//       {/* <p style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{result}</p> */}

//        <h2>生成したコンテンツ（{contents.length}件）</h2>
//       {contents.length === 0 ? (
//         <p>まだありません。上のフォームから生成してみましょう。</p>
//       ) : (
//         contents.map((item) => (
//           <ContentCard
//             key={item.id}
//             name={item.name}
//             body={item.body}
//             status={item.status}
//           />
//         ))
//       )}
//     </div>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import GeneratePage from "./pages/GeneratePage";
import EditPage from "./pages/EditPage";

function App() {
  // ① 起動時：localStorage から読み込む（無ければ空配列）
  const [contents, setContents] = useState(() =>
  {
    const saved = localStorage.getItem("contents");
      return saved ? JSON.parse(saved) : [];
    });

   // ② contents が変わるたび：localStorage に保存する 
  useEffect(() => {
    localStorage.setItem("contents", JSON.stringify(contents));
  }, [contents]);

  // 新しい1件を、リストの先頭に追加する
  function addContent(newItem) {
  setContents((prev) => [newItem, ...prev]);
}

 // id の1件だけを、changes の内容で書き換える
  function updateContent(id, changes) {
  setContents((prev) =>
    prev.map((c) => (c.id === id ? { ...c, ...changes } : c))
  );
}


  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1>DIY車中泊女子 コンテンツジェネレーター</h1>
      <NavBar />

      <Routes>
        <Route path="/" element={<DashboardPage contents={contents} />} />
        <Route path="/generate" element={<GeneratePage onAdd={addContent} />} />
         <Route
          path="/edit/:id"
          element={<EditPage contents={contents} onUpdate={updateContent} />}
        />
      </Routes>
    </div>
  );
}

export default App;