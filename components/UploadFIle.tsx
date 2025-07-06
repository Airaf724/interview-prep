"use client";
import { useEffect, useRef, useState } from "react";

interface UploadFileProps {
  resumeFileUrl?: string; // Pass full URL instead of just file name
}

const UploadFile = ({ resumeFileUrl }: UploadFileProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(resumeFileUrl || "");
  const [openModal, setOpenModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenModal(false);
      }
    };
    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedUrl(data.url);
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center bg-gray-900">
      <button
        className={`px-4 py-2 ${
          uploadedUrl ? "bg-green-500" : "bg-green-500"
        } cursor-pointer text-white rounded-md hover:bg-green-600 transition`}
        onClick={() => setOpenModal(true)}
      >
        {uploadedUrl ? "Resume Uploaded" : "Upload Resume"}
      </button>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-[#1e1e1e] w-full max-w-md rounded-lg p-6 shadow-xl relative"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            <h2 className="text-white text-lg font-semibold mb-4">Add File</h2>

            <div
              className={`flex flex-col justify-center items-center border-2 border-dashed ${
                dragOver ? "border-blue-400 bg-[#2e2e2e]" : "border-gray-500"
              } rounded-lg p-10 transition`}
            >
              <div className="text-blue-400 text-4xl mb-2">📤</div>
              <p className="text-gray-300">Upload your file here</p>
              <p className="text-sm text-gray-400">
                File supported: PDF (Max 5MB)
              </p>

              <button
                className="mt-4 px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                onClick={() => inputRef.current?.click()}
              >
                Browse
              </button>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {file && (
              <div className="flex justify-between items-center bg-[#2e2e2e] text-white mt-4 px-4 py-2 rounded-md">
                <p className="truncate">{file.name}</p>
                <button
                  className="text-red-500 cursor-pointer hover:text-red-700 text-xl"
                  onClick={() => setFile(null)}
                >
                  🗑️
                </button>
              </div>
            )}

            <button
              className={`mt-6 w-full py-2 cursor-pointer rounded-md ${
                uploading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
              } text-white transition`}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
