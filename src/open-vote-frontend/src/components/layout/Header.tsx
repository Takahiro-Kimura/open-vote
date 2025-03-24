import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart2, User, Home, ClockIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import React, { useState, useEffect } from "react";

const Modal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [language, setLanguage] = useState("En");

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-lg font-bold text-center">
              {language === "En" ? "What is OpenVote?" : "OpenVote について"}
            </h2>
          </div>
          <div className="flex items-center">
            <button
              className={`px-2 py-1 text-sm rounded ${
                language === "En" ? "bg-primary text-white" : "bg-gray-200"
              }`}
              onClick={() => setLanguage("En")}
            >
              En
            </button>
            <button
              className={`px-2 py-1 text-sm rounded ${
                language === "Ja" ? "bg-primary text-white" : "bg-gray-200"
              }`}
              onClick={() => setLanguage("Ja")}
            >
              Ja
            </button>
          </div>
        </div>
        {language === "En" ? (
          <p>
            OpenVote is a fully on-chain voting app running on the Internet
            Computer! Since all processes are executed on the blockchain,
            there’s no risk of tampering. Anyone can create a vote or
            participate in one.
          </p>
        ) : (
          <p>
            OpenVote は Internet Computer 上で動くフルオンチェーンの投票アプリです！
            すべての処理がブロックチェーン上で行われるので、改ざんの心配もありません。誰でも投票を作成したり、投票に参加したりできます。
          </p>
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            {language === "En" ? "close" : "閉じる"}
          </button>
        </div>
      </div>
    </div>
  );
};

export function Header() {
  const [location] = useLocation();
  const { isAuthenticated, login, logout, principal } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsModalOpen(true);
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    localStorage.setItem("hasVisited", "true");
  };

  return (
    <>
      <div className="flex items-center justify-between h-16 bg-header border-b border-header-border p-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={openModal}
        >
          <BarChart2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold hidden md:inline">OpenVote</h1>
        </div>

        <nav className="flex items-center">
          <Link href="/">
            <Button
              variant="ghost"
              className={`justify-start ${
                location === "/"
                  ? "bg-header-accent text-header-accent-foreground"
                  : "hover:bg-header-accent/50"
              }`}
            >
              <Home className="w-2 h-2 md:mr-0" />
              <span className="hidden md:inline">Active Polls</span>
            </Button>
          </Link>

          <Link href="/completed-polls">
            <Button
              variant="ghost"
              className={`justify-start ${
                location === "/completed-polls"
                  ? "bg-header-accent text-header-accent-foreground"
                  : "hover:bg-header-accent/50"
              }`}
            >
              <ClockIcon className="w-2 h-2 md:mr-0" />
              <span className="hidden md:inline">Completed Polls</span>
            </Button>
          </Link>

          <Link href="/create-poll">
            <Button
              variant="ghost"
              className={`justify-start ${
                location === "/create-poll"
                  ? "bg-header-accent text-header-accent-foreground"
                  : "hover:bg-header-accent/50"
              }`}
            >
              <PlusCircle className="w-2 h-2 md:mr-0" />
              <span className="hidden md:inline">Create Poll</span>
            </Button>
          </Link>

          <Link href="/my-polls">
            <Button
              variant="ghost"
              className={`justify-start ${
                location === "/my-polls"
                  ? "bg-header-accent text-header-accent-foreground"
                  : "hover:bg-header-accent/50"
              }`}
            >
              <User className="w-2 h-2 md:mr-0" />
              <span className="hidden md:inline">My Polls</span>
            </Button>
          </Link>

          <Link href="/my-votes">
            <Button
              variant="ghost"
              className={`justify-start ${
                location === "/my-votes"
                  ? "bg-header-accent text-header-accent-foreground"
                  : "hover:bg-header-accent/50"
              }`}
            >
              <User className="w-2 h-2 md:mr-0" />
              <span className="hidden md:inline">My Votes</span>
            </Button>
          </Link>
        </nav>
        {isAuthenticated ? (
          <Button onClick={logout}>Sign Out</Button>
        ) : (
          <Button onClick={login}>Sign in</Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
