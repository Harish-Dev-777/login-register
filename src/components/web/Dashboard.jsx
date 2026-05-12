import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUser,
  deleteUser as deleteUserApi,
} from "@/services/authApi";
import { User, LogOut, Eye, Edit, Trash2, Home, ChevronLeft, ChevronRight, FileText, Download, Search } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button-1";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    image: "",
    pdfFile: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Search and date filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (u) => {
    setViewingUser(u);
  };

  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditFormData({
      name: u.name || "",
      email: u.email || "",
      mobile: u.mobile || u.phone || "",
      image: u.image || u.profile || "",
      pdfFile: u.pdfFile || "",
    });
  };

  const handleDeleteClick = (id) => {
    setDeletingUserId(id);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setEditLoading(true);
      const id = editingUser._id || editingUser.id;
      await updateUser(id, editFormData);
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingUserId) return;

    try {
      setDeleteLoading(true);
      await deleteUserApi(deletingUserId);
      toast.success("User deleted successfully");
      setDeletingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Parse dd-mm-yyyy or ISO date strings
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Handle dd-mm-yyyy HH:MM:SS format
    const ddmmMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})/);
    if (ddmmMatch) {
      return new Date(ddmmMatch[3], ddmmMatch[2] - 1, ddmmMatch[1]);
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
  };

  // Format date as dd-Mon-year (e.g. 12-May-2026)
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = parseDate(dateString);
      if (!date) return dateString;
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Sort latest first + apply search & date filters
  const filteredUsers = [...users]
    .sort((a, b) => {
      const dateA = parseDate(a.registeredAt || a.createdAt || a.date);
      const dateB = parseDate(b.registeredAt || b.createdAt || b.date);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    })
    .filter((u) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (u.name || "").toLowerCase().includes(q);
        const matchEmail = (u.email || "").toLowerCase().includes(q);
        const matchMobile = (u.mobile || u.phone || "").includes(q);
        if (!matchName && !matchEmail && !matchMobile) return false;
      }
      // Date range filter
      const uDate = parseDate(u.registeredAt || u.createdAt || u.date);
      if (dateRange.start) {
        if (!uDate || uDate < dateRange.start) return false;
      }
      if (dateRange.end) {
        if (!uDate || uDate > dateRange.end) return false;
      }
      return true;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // PDF download handler
  const handlePdfDownload = (pdfData, userName) => {
    if (!pdfData) {
      toast.error("No PDF available for this user");
      return;
    }
    const link = document.createElement("a");
    link.href = pdfData;
    link.download = `${(userName || "user").replace(/\s+/g, "_")}_document.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("PDF download started");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none z-[1]" />

      {/* Header */}
      <header className="w-full glass-card border-b border-white/10 py-4 px-5 md:px-20 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span className="font-heading tracking-widest uppercase text-sm hidden md:inline">
              Back to Home
            </span>
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
          <h1 className="text-xl font-bold">
            Better<span className="text-primary">Web</span> Dashboard
          </h1>
        </div>

        {/* User Profile - Top Right */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium hidden md:inline">
                  {user.name}
                </span>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-secondary flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="h-6 w-px bg-white/10 mx-1"></div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-red-500 transition-colors uppercase font-bold tracking-widest"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 z-10 relative">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading">
                User <span className="text-primary">Management</span>
              </h2>
              <p className="text-muted-foreground mt-1">
                Manage and view all registered users across the platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search name, email, mobile..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="input-dark h-10 pl-10 pr-4 w-full sm:w-64 text-sm border border-white/10 focus:border-primary/50"
                />
              </div>
              {/* Date Filter */}
              <DateRangePicker
                value={dateRange}
                onChange={(val) => { setDateRange(val || { start: null, end: null }); setCurrentPage(1); }}
              />
            </div>
          </div>
        </div>

        {/* Users Table — Desktop */}
        <div className="glass-card rounded-lg border border-white/10 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40">
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Mobile</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">PDF</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-4"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 shrink-0" /><Skeleton className="h-4 w-32" /></div></td>
                      <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-8 w-16" /></td>
                      <td className="p-4"><div className="flex justify-end gap-2"><Skeleton className="w-8 h-8" /><Skeleton className="w-8 h-8" /><Skeleton className="w-8 h-8" /></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-muted-foreground font-heading uppercase tracking-widest">No users found.</td></tr>
                ) : (
                  filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u, i) => (
                    <tr key={u._id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-none border border-primary/20 bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                            {u.image || u.profile ? (<img src={u.image || u.profile} alt={u.name} className="w-full h-full object-cover" />) : (<User className="w-5 h-5 text-muted-foreground" />)}
                          </div>
                          <p className="font-bold text-white capitalize">{u.name || "Unknown"}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400 text-sm">{u.email || "—"}</td>
                      <td className="p-4 text-gray-400 text-sm font-mono">{u.mobile || u.phone || "—"}</td>
                      <td className="p-4 text-gray-400 text-sm">{formatDate(u.registeredAt || u.createdAt || u.date)}</td>
                      <td className="p-4">
                        {u.pdfFile ? (
                          <button onClick={() => handlePdfDownload(u.pdfFile, u.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all rounded-sm" title="Download PDF">
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                        ) : (<span className="text-gray-600 text-xs">—</span>)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleView(u)} className="p-2 text-muted-foreground hover:text-white bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/30 transition-all rounded-sm" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEditClick(u)} className="p-2 text-muted-foreground hover:text-primary bg-black/30 hover:bg-black/50 border border-white/10 hover:border-primary/50 transition-all rounded-sm" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteClick(u._id || u.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-black/30 hover:bg-black/50 border border-white/10 hover:border-red-500/50 transition-all rounded-sm" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-b border-white/5 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 shrink-0" />
                    <div className="space-y-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40" /></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <div className="flex gap-1.5"><Skeleton className="w-8 h-8" /><Skeleton className="w-8 h-8" /><Skeleton className="w-8 h-8" /></div>
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-heading uppercase tracking-widest">No users found.</div>
            ) : (
              filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u, i) => (
                <div key={u._id || i} className="border-b border-white/5 p-4 hover:bg-white/[0.02] transition-colors">
                  {/* User Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-none border border-primary/20 bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {u.image || u.profile ? (<img src={u.image || u.profile} alt={u.name} className="w-full h-full object-cover" />) : (<User className="w-5 h-5 text-muted-foreground" />)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white capitalize truncate">{u.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email || "—"}</p>
                    </div>
                  </div>
                  {/* PDF + Date + Actions Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {u.pdfFile ? (
                        <button onClick={() => handlePdfDownload(u.pdfFile, u.name)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all rounded-sm">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      ) : (<span className="text-xs text-gray-600 flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> No PDF</span>)}
                      <span className="text-xs text-gray-500">{formatDate(u.registeredAt || u.createdAt || u.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => handleView(u)} className="p-2 text-muted-foreground hover:text-white bg-black/30 border border-white/10 transition-all rounded-sm" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleEditClick(u)} className="p-2 text-muted-foreground hover:text-primary bg-black/30 border border-white/10 transition-all rounded-sm" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClick(u._id || u.id)} className="p-2 text-muted-foreground hover:text-red-500 bg-black/30 border border-white/10 transition-all rounded-sm" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <Pagination className="w-auto mx-0 sm:mx-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="rtl:rotate-180 mr-1" /> Prev
                    </Button>
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    if (
                      page === 1 || 
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <Button 
                            variant={currentPage === page ? "primary" : "ghost"} 
                            mode="icon"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <Button 
                      variant="ghost"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="rtl:rotate-180 ml-1" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>

      {/* View Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 border border-white/10 relative">
            <button
              onClick={() => setViewingUser(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6 font-heading">
              User <span className="text-primary">Details</span>
            </h3>

            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-primary/30 overflow-hidden bg-secondary flex items-center justify-center mb-4">
                {viewingUser.image || viewingUser.profile ? (
                  <img
                    src={viewingUser.image || viewingUser.profile}
                    alt={viewingUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <h4 className="text-lg font-bold text-white capitalize">
                {viewingUser.name || "Unknown"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(viewingUser.createdAt || viewingUser.date)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <p className="text-white bg-white/5 p-2 border border-white/10 rounded-sm">
                  {viewingUser.email || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Mobile
                </label>
                <p className="text-white bg-white/5 p-2 border border-white/10 rounded-sm font-mono">
                  {viewingUser.mobile || viewingUser.phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="btn-neon py-2 px-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 border border-white/10 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6 font-heading">
              Edit <span className="text-primary">User</span>
            </h3>

            <form onSubmit={submitEdit} className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2 mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-primary/20 p-1 overflow-hidden bg-secondary shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                  {editFormData.image ? (
                    <img src={editFormData.image} alt="Profile" className="w-full h-full rounded-full object-cover opacity-60 grayscale-[0.5]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase text-primary font-bold tracking-widest">Profile Image</span>
                  <span className="text-[9px] text-muted-foreground italic">(Non-editable)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="input-dark w-full h-10 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="input-dark w-full h-10 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                    Mobile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editFormData.mobile}
                      disabled
                      className="input-dark w-full h-10 text-sm opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02]"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground">LOCKED</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">
                    Document (PDF)
                  </label>
                  <div className="flex items-center gap-2 input-dark w-full h-10 text-sm opacity-50 cursor-not-allowed border-white/5 bg-white/[0.02] px-3">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate flex-1">
                      {editFormData.pdfFile ? "Document Attached" : "No Document"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="btn-neon py-2 px-6 disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-sm p-6 border border-red-500/30 relative">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-heading text-center text-white">
              Delete User?
            </h3>
            <p className="text-center text-muted-foreground text-sm mb-6">
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingUserId(null)}
                className="py-2 px-4 text-muted-foreground hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="py-2 px-6 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 transition-all rounded-sm disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
