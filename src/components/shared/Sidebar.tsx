import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
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

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 text-white z-50 lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full w-64 bg-[#1A1210] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-40`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h2 className="text-white text-xl">History</h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-gray-400 px-4">Loading...</div>
            ) : error ? (
              <div className="text-red-500 px-4">{error}</div>
            ) : documents.length === 0 ? (
              <div className="text-gray-400 px-4">No documents yet</div>
            ) : (
              <div className="space-y-1">
                {documents.map((doc) => (
                  <button
                    key={doc.document_id}
                    onClick={() => handleDocumentClick(doc.document_id)}
                    className="w-full px-4 py-3 text-white hover:bg-white/5 text-left truncate"
                  >
                    {doc.title || doc.filename}
                  </button>
                ))}
              </div>
            )}
          </nav>

          {/* Logout Section */}
          <div className="border-t border-white/10 p-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-[#E38E4E] gap-2"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;