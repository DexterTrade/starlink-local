"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookie, sendMetaEvent } from "@/lib/meta-client";

export default function MetaPageEvents() {
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    void sendMetaEvent({
      event_name: "ViewContent",
      user_data: { fbp: getCookie("_fbp"), fbc: getCookie("_fbc") },
      custom_data: {
        content_type: "page",
        content_name: pathname,
      },
    });
    // params dep ensures route param changes also fire
  }, [pathname, params]);

  return null;
}
