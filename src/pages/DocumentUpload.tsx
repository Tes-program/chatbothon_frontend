import { FiPlus, FiFile } from "react-icons/fi";
import Sidebar from "../components/shared/Sidebar";
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import cloud_upload from "../assets/images/cloud_upload.svg";
import api from "../services/api";

const DocumentUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Reset states
    setError("");
    setUploadProgress(0);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Simulate initial progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Complete the progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Wait a moment to show 100% progress
      setTimeout(() => {
        // Navigate to chat with the document ID
        navigate(`/chat/${response.data.document_id}`);
      }, 500);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setSidebarOpen(!isSidebarOpen)} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="flex justify-end p-6">
          <button className="w-10 h-10 rounded-full border-[#D35400] border-3 flex items-center justify-center">
            <FiPlus size={24} className="text-[#D35400]" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 lg:ml-0 lg:pl-[calc(50%-30rem)]">
          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}
          
          <div 
            className="w-full max-w-3xl border-2 border-dashed border-[#D35400] rounded-lg p-8 md:p-12 flex flex-col items-center justify-center space-y-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInput}
              accept=".pdf,.doc,.docx"
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4 w-full">
              {isUploading ? (
                <div className="w-full space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#D35400] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-white">Uploading... {uploadProgress}%</p>
                </div>
              ) : selectedFile ? (
                <div className="flex items-center space-x-3">
                  <FiFile size={24} className="text-[#D35400]" />
                  <p className="text-white">{selectedFile.name}</p>
                </div>
              ) : (
                <>
                  <img src={cloud_upload} alt="cloud_upload" />
                  <p className="text-white text-lg">Drag and drop file</p>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>or</span>
                    <button 
                      onClick={handleBrowseClick}
                      className="text-[#D35400] underline"
                    >
                      Browse
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={handleUpload}
            className={`mt-8 px-8 py-2 rounded-md transition-colors
              ${selectedFile && !isUploading 
                ? 'bg-[#D35400] text-white hover:bg-[#e35c00] cursor-pointer' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
            disabled={!selectedFile || isUploading}
          >
            Upload document
          </button>
        </div>
      </main>
    </div>
  );
};

export default DocumentUploadPage;