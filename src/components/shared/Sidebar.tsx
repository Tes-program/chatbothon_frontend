import { FiMenu, FiX, FiLogOut, FiFile } from "react-icons/fi";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface DocumentHistory {
  document_id: number;
  filename: string;
  title: string;
  created_at: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const [documents, setDocuments] = useState<DocumentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDocumentHistory();
  }, []);

  const fetchDocumentHistory = async () => {
    try {
      const response = await api.get<DocumentHistory[]>('/documents/history');
      setDocuments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load document history");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDocumentClick = (documentId: number) => {
    navigate(`/chat/${documentId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen &&
        window.innerWidth < 1024
      ) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={onToggle}
        className={`fixed top-6 left-6 text-white z-50 p-2 lg:hidden ${
          isOpen ? "translate-x-64" : "translate-x-0"
        } transition-transform duration-300 ease-in-out`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-64 bg-[#1A0F0F] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        {/* Menu Title */}
        <h2 className="text-white text-xl pt-16 px-6 mb-6">History</h2>

        {/* Navigation Items */}
        <nav className="flex flex-col flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-gray-400 px-6">Loading...</div>
          ) : error ? (
            <div className="text-red-500 px-6">{error}</div>
          ) : documents.length === 0 ? (
            <div className="text-gray-400 px-6">No documents yet</div>
          ) : (
            documents.map((doc) => (
              <div key={doc.document_id}>
                <button
                  onClick={() => handleDocumentClick(doc.document_id)}
                  className="w-full px-6 py-4 text-white hover:bg-[#2A1F1F] transition-colors flex items-center gap-3 text-left"
                >
                  <FiFile size={20} className="text-[#D35400]" />
                  <div className="overflow-hidden">
                    <p className="truncate">{doc.title}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </button>
                <div className="h-[0.5px] bg-[#2A1F1F]" />
              </div>
            ))
          )}
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 w-full bg-[#1A0F0F]/80 backdrop-blur-sm border-t border-[#2A1F1F] p-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleLogout}
              className="flex items-center text-[#D35400] gap-2"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#D35400] flex items-center justify-center">
              <span className="text-white text-sm">AI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;