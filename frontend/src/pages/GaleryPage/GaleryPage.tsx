import { useState, useCallback } from "react";
import { useGalery } from "../../hooks";
import GaleryPublication from "../../components/GaleryPublication";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import styles from "./GaleryPage.module.css";

function GaleryPage() {
  const [page, setPage] = useState<number>(1);
  const { publications, hasMore, isLoading } = useGalery({ page });

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Галерея публикаций</h1>
        <div className={styles.galleryGrid}>
          {publications.map((publication) => (
            <GaleryPublication
              key={publication.publication_id}
              publication_id={publication.publication_id}
              author={publication.author}
              photos={publication.photos}
            />
          ))}
        </div>
        {isLoading && (
          <div className={styles.loadingMore}>
            <Spinner />
          </div>
        )}
        {hasMore && !isLoading && (
          <div className={styles.loadMoreContainer}>
            <Button onClick={handleLoadMore} variant="primary" size="md">
              Загрузить ещё
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GaleryPage;
