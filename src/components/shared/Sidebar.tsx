import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useRef, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const menuItems = [
    { title: "Rental agreement", path: "/rental" },
    { title: "Contracts", path: "/contracts" },
    { title: "Non-Disclosure Agreements (NDAs)", path: "/ndas" },
    { title: "Partnership Agreements", path: "/partnership" },
    { title: "Terms & Conditions", path: "/terms" },
    { title: "Consultation", path: "/consultation" },
    { title: "Document Review", path: "/review" },
    { title: "Legal Representation", path: "/legal" },
    { title: "Case Management", path: "/case" },
    { title: "Corporate Law", path: "/corporate" },
    { title: "Intellectual Property", path: "/ip" },
    { title: "Real Estate", path: "/estate" },
    { title: "Legal Glossary", path: "/glossary" },
  ];

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside (mobile only)
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
      {/* Hamburger Menu Button - Always visible on mobile */}
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
        <nav className="flex flex-col">
          {menuItems.map((item, index) => (
            <div key={index}>
              <a
                href={item.path}
                className="block px-6 py-4 text-white hover:bg-[#2A1F1F] transition-colors"
              >
                {item.title}
              </a>
              <div className="h-[0.5px] bg-[#2A1F1F]" />
            </div>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 w-full bg-[#1A0F0F]/80 backdrop-blur-sm border-t border-[#2A1F1F] p-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-[#D35400] gap-2">
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