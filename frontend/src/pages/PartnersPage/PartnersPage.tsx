import { useState } from "react";
import { usePartners } from "../../hooks";
import { Button, Spinner } from "../../components/common";
import PartnerCard from "../../components/PartnerCard";

import styles from "./PartnersPage.module.css";

function PartnersPage() {
  const [page, setPage] = useState<number>(1);
  const { partners, hasMore, isLoading } = usePartners({ page });

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Наши партнёры</h1>

      <div className={styles.cards}>
        {partners.map((partner) => (
          <PartnerCard
            socials={partner.socials}
            key={partner.id}
            id={partner.id}
            name={partner.name}
            description={partner.description}
            photos={partner.photos}
            trusted={partner.trusted}
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
  );
}

export default PartnersPage;
