"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdClose, MdCheckCircle, MdCloudUpload, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiFileText, FiShield } from "react-icons/fi";
import { listPrescriptions, uploadFile, updatePrescription } from "@/api/Api";

const formatPrescriptionDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split(" 00:")[0];
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  } catch (e) { return dateStr; }
};

export const PrescriptionUploadModal = ({ open, onClose, onPrescriptionSelected }) => {
  const [patientName, setPatientName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [savedPrescriptions, setSavedPrescriptions] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const rxScrollRef = useRef(null);
  const navigate = useNavigate();

  const scrollRx = (dir) => {
    if (rxScrollRef.current) {
      const scrollAmt = rxScrollRef.current.offsetWidth * 0.8;
      rxScrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmt : scrollAmt, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (open) {
      loadSavedPrescriptions();
      setSelectedFile(null);
      setPatientName("");
      setMedicineName("");
    }
  }, [open]);

  const loadSavedPrescriptions = async () => {
    setLoadingSaved(true);
    try {
      const data = await listPrescriptions(navigate);
      setSavedPrescriptions(data || []);
    } catch (e) {
      console.error("Error loading prescriptions", e);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "File too large", text: "Please select a file under 10MB." });
      return;
    }
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setUploading(true);
    Swal.fire({
      title: "Processing...",
      text: "Securing your prescription...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const fileName = await uploadFile(selectedFile, "prescription");
      if (fileName) {
        const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
        const nameToUse = patientName.trim() || ("Prescription_" + today);
        const result = await updatePrescription(fileName, nameToUse, new Date().toISOString().split("T")[0]);
        if (result && result.prescription_id) {
          onPrescriptionSelected(result.prescription_id);
          Swal.close();
          onClose();
        }
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300000, backdropFilter: "blur(6px)" }} />
      <div onClick={e => e.stopPropagation()} className="prescription-modal-content" style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "min(520px, 95vw)", background: "#fff", borderRadius: 24, padding: "28px",
        zIndex: 300001, display: "flex", flexDirection: "column", gap: 24,
        boxShadow: "0 28px 80px rgba(0,0,0,0.22)", animation: "rx-scaleIn 0.3s ease",
        boxSizing: "border-box"
      }}>
        {/* Mobile Handle */}
        <div className="mobile-only" style={{ height: 5, width: 40, background: "#e5e7eb", borderRadius: 3, margin: "-12px auto 8px", flexShrink: 0 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Upload New Prescription</h2>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <MdClose size={20} color="#6b7280" />
          </button>
        </div>

        <div onClick={() => fileInputRef.current.click()} style={{ 
          border: selectedFile ? "2px solid #16a34a" : "2px dashed #c4b5fd", 
          borderRadius: 20, padding: "30px 20px", textAlign: "center", 
          background: selectedFile ? "#f0fdf4" : "#f9f8ff", 
          cursor: "pointer", transition: "all 0.2s ease" 
        }} onMouseOver={e => { if (!selectedFile) { e.currentTarget.style.background = "#f3f0ff"; e.currentTarget.style.borderColor = "#7c3aed"; } }} 
           onMouseOut={e => { if (!selectedFile) { e.currentTarget.style.background = "#f9f8ff"; e.currentTarget.style.borderColor = "#c4b5fd"; } }}>
          <div style={{ background: "#fff", width: 52, height: 52, borderRadius: "50%", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(124,58,237,0.12)" }}>
            {selectedFile ? <MdCheckCircle size={28} color="#16a34a" /> : <MdCloudUpload size={26} color="#7c3aed" />}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: selectedFile ? "#16a34a" : "#4b5563", marginBottom: 6 }}>
            {selectedFile ? `File Selected: ${selectedFile.name}` : <>Drag and drop your prescription or <span style={{ color: "#7c3aed", borderBottom: "1.5px solid #7c3aed" }}>browse files</span></>}
          </div>
          <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500 }}>
            {selectedFile ? "Click here to change the selection" : "Supported: PDF, JPG, PNG (Max 10MB)"}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept="image/*,.pdf" />
        </div>

        <div className="rx-modal-input-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#4b5563" }}>Patient Name</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={patientName} onChange={e => setPatientName(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: "#4b5563" }}>Medicine <span style={{ fontWeight: 500, color: "#9ca3af" }}>(Optional)</span></label>
            <input type="text" placeholder="e.g. Metformin" value={medicineName} onChange={e => setMedicineName(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" }} />
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#374151" }}>Choose from Saved Prescriptions</div>
            <div className="desktop-only" style={{ display: "flex", gap: 6 }}>
              <button onClick={() => scrollRx("left")} style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7c3aed", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}><MdChevronLeft size={18} /></button>
              <button onClick={() => scrollRx("right")} style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1px solid #f0eeff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7c3aed", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}><MdChevronRight size={18} /></button>
            </div>
          </div>
          <div 
            ref={rxScrollRef}
            className="rx-cards-container"
            style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "thin" }}
          >
            <style>{`
              .rx-cards-container { scroll-behavior: smooth; }
              .rx-cards-container::-webkit-scrollbar { height: 5px; }
              .rx-cards-container::-webkit-scrollbar-track { background: #f3f0fb; border-radius: 10px; }
              .rx-cards-container::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 10px; }
            `}</style>
            {loadingSaved ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={{ minWidth: 100 }}>
                  <div className="skel-box" style={{ width: 100, height: 100, borderRadius: 16, marginBottom: 8 }} />
                  <div className="skel-box" style={{ width: "80%", height: 12, borderRadius: 6, marginBottom: 6 }} />
                  <div className="skel-box" style={{ width: "60%", height: 10, borderRadius: 6 }} />
                </div>
              ))
            ) : savedPrescriptions.length > 0 ? (
              savedPrescriptions.map((p, i) => (
                <div key={i} onClick={() => onPrescriptionSelected(p.prescription_id)} style={{ minWidth: 100, cursor: "pointer" }}>
                  <div style={{ width: 100, height: 100, background: "#f3f4f6", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative", overflow: "hidden", border: "1px solid #f3f4f6" }}>
                    {p.prescription_image_url ? (
                      <img src={"https://d1dh0rr5xj2p49.cloudfront.net/prescription/" + p.prescription_image_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                    ) : <FiFileText size={32} color="#9ca3af" />}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.prescription_name || "Prescription"}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{formatPrescriptionDate(p.prescription_date)}</div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: 12, color: "#9ca3af", padding: "10px 0" }}>No saved prescriptions found.</div>
            )}
          </div>
        </div>

        <div style={{ background: "#f9fafb", borderRadius: 16, padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
          <FiShield size={20} color="#7c3aed" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
            Your prescription will be securely stored and reviewed by our pharmacists. We follow strict HIPAA-compliant protocols.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSave} disabled={!selectedFile || uploading} style={{ 
            background: (!selectedFile || uploading) ? "#e5e7eb" : "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)", 
            color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", 
            fontSize: 14, fontWeight: 800, cursor: (!selectedFile || uploading) ? "not-allowed" : "pointer", 
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease",
            boxShadow: (!selectedFile || uploading) ? "none" : "0 4px 12px rgba(124,58,237,0.25)" 
          }}>
            <MdCheckCircle size={18} /> Upload & Save
          </button>
        </div>

        <style>{`
          @keyframes rx-scaleIn { from { transform: translate(-50%, -40%) scale(0.95); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
          @keyframes rx-slide-up-mobile {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .prescription-modal-content {
            animation: rx-scaleIn 0.3s ease-out forwards;
          }
          @media (max-width: 640px) {
            .prescription-modal-content {
              top: auto !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              transform: translateY(0) !important;
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 24px 24px 0 0 !important;
              max-height: 92vh !important;
              padding: 16px 16px 30px !important;
              animation: rx-slide-up-mobile 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards !important;
            }
            .rx-modal-input-grid {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

