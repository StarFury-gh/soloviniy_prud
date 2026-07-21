import { useEffect, useState } from "react";
import { API_URL, LS_ACCESS_TOKEN } from "../../../constants";

import PartnerCard from "../../PartnerCard";

interface Socials {
  social: string;
  url: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  photos: Array<string>;
  socials: Array<Socials>;
  trusted: boolean;
}

export interface GetPartnersServerResponse {
  partners: Array<Partner>;
}

function MyPartners() {
  const [partners, setPartners] = useState<Array<Partner>>([]);

  useEffect(() => {
    const url = `${API_URL}/partners/representatives`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);

    const getPartners = async () => {
      const response = await fetch(url, {
        headers: {
          Authorization: token || "",
        },
      });

      if (response.ok) {
        const data: GetPartnersServerResponse = await response.json();
        setPartners(data.partners);
      } else {
        console.error("getPartners error:", response.statusText);
      }
    };

    getPartners();
  }, []);

  const handleAddDoc = async (file: File | null, partnerId: string) => {
    const url = `${API_URL}/partners/add_doc/${partnerId}`;
    const token = localStorage.getItem(LS_ACCESS_TOKEN);
    const body = new FormData();
    if (file) {
      body.append("document", file);
    } else {
      return;
    }
    const response = await fetch(url, {
      method: "POST",
      body,
      headers: {
        Authorization: token || "",
      },
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("handleAddDoc error:", response.statusText);
    }
  };

  return (
    <div className="container">
      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          id={partner.id}
          description={partner.description}
          name={partner.name}
          photos={partner.photos}
          socials={partner.socials}
          trusted={partner.trusted}
          onSendDoc={handleAddDoc}
          editable
        />
      ))}
    </div>
  );
}

export default MyPartners;
