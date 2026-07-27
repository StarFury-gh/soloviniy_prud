import { useParams } from "react-router-dom";
import { STATIC_API_URL } from "../../constants";
import styles from "./DocPreviewPage.module.css";

function DocPreviewPage() {
  const { docId } = useParams();

  const url = `${STATIC_API_URL}/${docId}`;

  return (
    <div className={styles.container}>
      <object
        data={url}
        type="application/pdf"
        className={styles.object}
      ></object>
    </div>
  );
}

export default DocPreviewPage;
