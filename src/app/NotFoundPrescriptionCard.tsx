"use client";

import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { uploadFile, updatePrescription, getUser, addToCart } from "@/api/Api";
import styles from "./not-found.module.css";

export default function NotFoundPrescriptionCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-populate user details if logged in
  useEffect(() => {
    if (isOpen) {
      try {
        const user = getUser();
        if (user?.name) setUserName(user.name);
      } catch (e) {}
    }
  }, [isOpen]);

  // Reset modal state
  const resetForm = () => {
    setSelectedFile(null);
    setUserName("");
    setContactNumber("");
    setIsSubmitting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    resetForm();
  };

  // File selection validation (PDF, JPG, PNG <= 5MB)
  const processFile = (file: File) => {
    if (!file) return;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    const isAllowed =
      allowedTypes.includes(file.type.toLowerCase()) ||
      /\.(pdf|jpe?g|png)$/i.test(file.name);

    if (!isAllowed) {
      Swal.fire({
        icon: "warning",
        title: "Unsupported File Format",
        text: "Please upload a valid prescription in PDF, PNG, JPG, or JPEG format.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File Too Large",
        text: "Maximum file size is 5MB. Please choose a smaller file.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "Prescription Required",
        text: "Please select or drop your prescription file to continue.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    const cleanPhone = contactNumber.replace(/\D/g, "");
    if (contactNumber && cleanPhone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile Number",
        text: "Please enter a valid 10-digit mobile number.",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    setIsSubmitting(true);
    Swal.fire({
      title: "Uploading Prescription...",
      text: "Please wait while we secure your prescription.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const fileName = await uploadFile(selectedFile, "prescription");

      if (fileName) {
        const today = new Date().toISOString().split("T")[0];
        const presName =
          userName.trim() ||
          `Prescription_${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;

        let prescriptionId = null;
        try {
          const updateResult = await updatePrescription(fileName, presName, today);
          if (updateResult && updateResult.prescription_id) {
            prescriptionId = updateResult.prescription_id;
          }
        } catch (err) {
          console.warn("updatePrescription call fallback:", err);
        }

        // Try linking to cart if user is logged in
        try {
          const user = getUser();
          if (user?.isLoggedIn && prescriptionId) {
            await addToCart(null, prescriptionId, 0);
          }
        } catch (err) {}

        Swal.fire({
          icon: "success",
          title: "Prescription Submitted!",
          html: `
            <div style="font-size: 14px; color: #475569; line-height: 1.6; text-align: center;">
              Your prescription has been received securely.
              <br/><br/>
              A qualified pharmacist will review your prescription and process your order shortly.
              ${cleanPhone ? `<br/>We will contact you on <b>+91 ${cleanPhone}</b>.` : ""}
            </div>
          `,
          confirmButtonColor: "#7c3aed",
          confirmButtonText: "Got it!",
        });

        handleClose();
      } else {
        throw new Error("Prescription upload did not return a filename.");
      }
    } catch (error) {
      console.error("Prescription upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "We could not upload your prescription. Please try again or reach our support.",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Popular Page Card 3 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={styles.popularCard}
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          textAlign: "left",
          width: "100%",
          cursor: "pointer",
          padding: "16px 18px",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          fontFamily: "inherit",
        }}
        aria-label="Upload Prescription"
      >
        <div
          className={styles.cardIconCircle}
          style={{ backgroundColor: "#FFEDD5", color: "#EA580C" }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Upload Prescription</h3>
          <p className={styles.cardSubtitle}>Order with prescription</p>
        </div>
        <div className={styles.cardArrow}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>

      {/* Prescription Upload Popup Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          {/* Dimmed Blurred Backdrop */}
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              transition: "opacity 0.2s ease",
            }}
          />

          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              maxHeight: "92vh",
              overflowY: "auto",
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.3)",
              padding: "24px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              boxSizing: "border-box",
              animation: "prescriptionModalFade 0.25s ease-out forwards",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: "18.5px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                Upload Your Prescription
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#f1f5f9",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: selectedFile
                  ? "2px solid #22c55e"
                  : isDragging
                  ? "2px dashed #7c3aed"
                  : "2px dashed #c4b5fd",
                backgroundColor: selectedFile
                  ? "#f0fdf4"
                  : isDragging
                  ? "#f5f3ff"
                  : "#faf8ff",
                borderRadius: "18px",
                padding: "26px 18px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: selectedFile ? "#dcfce7" : "#ede9fe",
                  color: selectedFile ? "#16a34a" : "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.08)",
                }}
              >
                {selectedFile ? (
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    <polyline points="12 12 12 16" />
                    <polyline points="9 13 12 10 15 13" />
                  </svg>
                )}
              </div>

              {selectedFile ? (
                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "#15803d",
                      marginBottom: "4px",
                      wordBreak: "break-all",
                    }}
                  >
                    ✓ {selectedFile.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "4px",
                    }}
                  >
                    Drag and Drop your prescription here or{" "}
                    <span
                      style={{
                        color: "#7c3aed",
                        fontWeight: 700,
                        textDecoration: "underline",
                      }}
                    >
                      Upload Here
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Max size 5MB, format: PDF, PNG, JPG, JPEG
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg,application/pdf,.pdf,.jpg,.jpeg,.png"
                style={{ display: "none" }}
              />
            </div>

            {/* User Name & Contact Number Inputs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  User Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "6px",
                  }}
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={contactNumber}
                  maxLength={10}
                  onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1.5px solid #e2e8f0",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
                />
              </div>
            </div>

            {/* What is a Valid Prescription? (Guide) */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  What is a Valid Prescription? (Guide)
                </span>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                  Guidelines
                </span>
              </div>

              {/* 4 Cards Carousel */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                }}
              >
                {/* 1. Doctor Details */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "10px 8px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/doctor-details.svg"
                      alt="Doctor details"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Doctor details
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#64748b", lineHeight: 1.2 }}>
                    Don't crop out ANY
                  </div>
                </div>

                {/* 2. Patient Details */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "10px 8px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/patient-details.png"
                      alt="Patient details"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Patient details
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#64748b", lineHeight: 1.2 }}>
                    Don't crop out ANY
                  </div>
                </div>

                {/* 3. Date of Visit */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "10px 8px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/date-presc.png"
                      alt="Date of visit"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Date of visit
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#64748b", lineHeight: 1.2 }}>
                    Don't crop out ANY
                  </div>
                </div>

                {/* 4. Medicine Details */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "10px 8px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/medicine-details.png"
                      alt="Medicine details"
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#1e293b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Medicine details
                  </div>
                  <div style={{ fontSize: "9.5px", color: "#64748b", lineHeight: 1.2 }}>
                    Don't crop out ANY
                  </div>
                </div>
              </div>

              {/* Progress bar line indicator */}
              <div
                style={{
                  width: "100%",
                  height: "3px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "2px",
                  marginTop: "6px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "35%",
                    backgroundColor: "#7c3aed",
                    borderRadius: "2px",
                  }}
                />
              </div>
            </div>

            {/* Pharmacist Disclaimer */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: "2px" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span
                style={{
                  fontSize: "11.5px",
                  color: "#64748b",
                  lineHeight: 1.45,
                }}
              >
                Your prescription will be used only by a qualified pharmacist to review
                and process your order.
              </span>
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "4px",
              }}
            >
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "8px 12px",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedFile || isSubmitting}
                style={{
                  background:
                    !selectedFile || isSubmitting
                      ? "#e2e8f0"
                      : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  color: !selectedFile || isSubmitting ? "#94a3b8" : "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "11px 26px",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "inherit",
                  cursor: !selectedFile || isSubmitting ? "not-allowed" : "pointer",
                  boxShadow:
                    !selectedFile || isSubmitting
                      ? "none"
                      : "0 4px 16px rgba(124, 58, 237, 0.32)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit & Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes prescriptionModalFade {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
