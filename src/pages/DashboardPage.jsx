import { Link } from "react-router-dom";
import ContentCard from "../components/ContentCard";

function DashboardPage({ contents }) {
  return (
    <div>
      <h2>生成したコンテンツ（{contents.length}件）</h2>

      <p>
        公開 {contents.filter(c => c.status === "公開").length} /
        完成 {contents.filter(c => c.status === "完成").length} /
        下書き {contents.filter(c => c.status === "下書き").length} /
      </p>
      
      {contents.length === 0 ? (
        <p>まだありません。「生成する」から作ってみましょう。</p>
      ) : (
        contents.map((item) => (
          <Link
            key={item.id}
            to={`/edit/${item.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ContentCard
              name={item.name}
              body={item.body}
              status={item.status}
            />
          </Link>
        ))
      )}
    </div>
  );
}

export default DashboardPage;