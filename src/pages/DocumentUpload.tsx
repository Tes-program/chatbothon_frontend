import { FiPlus } from "react-icons/fi";
import Sidebar from "../components/shared/Sidebar";
import { useState } from "react";
import cloud_upload from "../assets/images/cloud_upload.svg"

const DocumentUploadPage: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="w-full max-w-3xl border-2 border-dashed border-[#D35400] rounded-lg p-8 md:p-12 flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <img src={cloud_upload} alt="cloud_upload" />
              <p className="text-white text-lg">Drag and drop file</p>
              <div className="flex items-center gap-2 text-gray-400">
                <span>or</span>
                <button className="text-[#D35400] underline">Browse</button>
              </div>
            </div>
          </div>

          <button className="mt-8 px-8 py-2 bg-[#993E2D40] text-white rounded-md hover:bg-[#e35c00] transition-colors">
            Upload document
          </button>
        </div>
      </main>
    </div>
  );
};

export default DocumentUploadPage;