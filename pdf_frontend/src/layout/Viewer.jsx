// src/pages/Viewer.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Api";
import SecurePdfViewer from "./SecurePdfViewer";

const Viewer = () => {
  const { guideId } = useParams(); // real Mongo _id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pdfData, setPdfData] = useState(null); // raw bytes for pdf.js

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        // ✅ get bytes from backend
        const res = await api.get(`/pdf/view/${guideId}`, {
          responseType: "arraybuffer",
        });

        if (res.status === 200) {
          setPdfData(res.data); // ArrayBuffer
        } else {
          alert("Unexpected response from server.");
        }
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.error || err.response?.data?.message;

        console.error("PDF fetch error:", err);

        if (status === 401) {
          alert("Please login again to view this guide.");
          navigate("/login");
        } else if (status === 403) {
          alert("You have not purchased this guide.");
          navigate("/guide");
        } else if (status === 404) {
          alert(msg || "Guide or PDF not found.");
          navigate("/guide");
        } else {
          alert("Unable to load PDF. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [guideId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm md:text-base text-muted-foreground">
          Loading guide…
        </p>
      </div>
    );
  }

  if (!pdfData) {
    // error already handled via alerts
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-24">
      {/* Wrapper to give side padding on mobile but keep max width on desktop */}
      <div className="mx-auto w-full max-w-5xl px-2 sm:px-3 md:px-4">
        {/* Viewer container */}
        <div
          className="
            h-[calc(100vh-5rem)]
            md:h-[80vh]
            w-full
            rounded-none
            md:rounded-xl
            border-0
            md:border
            shadow-none
            md:shadow-lg
            overflow-hidden
            bg-card
          "
        >
          {/* Make sure SecurePdfViewer uses full space */}
          <SecurePdfViewer pdfData={pdfData} />
        </div>
      </div>
    </div>
  );
};

export default Viewer;
