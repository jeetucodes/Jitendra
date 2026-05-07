import React, { useState, useEffect } from 'react';
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  updateDoc,
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from '@/lib/firebase';
import { 
  Trash2, 
  Plus, 
  Loader2, 
  LogOut, 
  Lock,
  Edit2,
  X,
  Save,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const IMGBB_API_KEY = 'a71661f37315d3c28deeff00ac84db8c';

interface Project {
  id?: string;
  title: string;
  category: string;
  tagline: string;
  github: string;
  link: string;
  stack: string[];
  year: string;
  images: string[];
  createdAt: any;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
}

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'projects' | 'inbox'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tagline: '',
    github: '',
    link: '',
    stack: '',
    year: new Date().getFullYear().toString(),
    images: [] as string[]
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        fetchProjects();
        fetchMessages();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome, Admin");
    } catch (error: any) {
      toast.error("Authentication Failed");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
  };

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(docs);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(docs);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages = [...formData.images];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadData = new FormData();
        uploadData.append('image', file);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: 'POST',
          body: uploadData,
        });
        const data = await response.json();
        if (data.success) newImages.push(data.data.url);
      }
      setFormData(prev => ({ ...prev, images: newImages }));
      toast.success("Images Uploaded");
    } catch (error) {
      toast.error("Upload Error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id || null);
    setFormData({
      title: project.title,
      category: project.category,
      tagline: project.tagline,
      github: project.github === 'N/A' ? '' : project.github,
      link: project.link === 'N/A' ? '' : project.link,
      stack: project.stack.join(', '),
      year: project.year,
      images: project.images || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', category: '', tagline: '', github: '', link: '', stack: '', year: new Date().getFullYear().toString(), images: [] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload images");
      return;
    }
    setSubmitting(true);
    try {
      const projectData = {
        ...formData,
        stack: formData.stack.split(',').map(s => s.trim()).filter(s => s !== ''),
        github: formData.github || 'N/A',
        link: formData.link || 'N/A',
        updatedAt: new Date(),
      };
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
        toast.success("Project Updated");
      } else {
        await addDoc(collection(db, 'projects'), { ...projectData, createdAt: new Date() });
        toast.success("Project Added");
      }
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error("Save Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success("Deleted");
      fetchProjects();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Delete message?")) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      toast.success("Message Removed");
      fetchMessages();
    } catch (error) {
      toast.error("Failed");
    }
  };

  const toggleMessageStatus = async (msg: Message) => {
    try {
      await updateDoc(doc(db, 'messages', msg.id), { status: msg.status === 'unread' ? 'read' : 'unread' });
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-red-600" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl shadow-2xl">
          <div className="flex justify-center mb-8">
            <Lock className="text-red-600" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="email" placeholder="Email" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-600 transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-600 transition-all" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-xl font-bold transition-all shadow-lg shadow-red-600/10">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600/30">
      {/* Navigation Header */}
      <nav className="h-20 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tighter">ADMIN <span className="text-red-600">HUB</span></h1>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
              >
                <LayoutDashboard size={16} />
                Projects
              </button>
              <button 
                onClick={() => setActiveTab('inbox')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all relative ${activeTab === 'inbox' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}
              >
                <Inbox size={16} />
                Inbox
                {messages.filter(m => m.status === 'unread').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-600 rounded-full text-[9px] flex items-center justify-center font-bold">
                    {messages.filter(m => m.status === 'unread').length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 font-mono hidden md:block">{user.email}</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 p-2 transition-colors"><LogOut size={20} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {activeTab === 'projects' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Project Form */}
            <div className="lg:col-span-5">
              <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] sticky top-28 shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  {editingId ? <Edit2 className="text-red-600" size={20} /> : <Plus className="text-red-600" size={20} />}
                  {editingId ? "Update Project" : "New Creation"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Title" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-600 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Category" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                    <input type="text" placeholder="Year" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                  </div>
                  <textarea placeholder="Brief description..." className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 h-28 resize-none outline-none" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} required />
                  <input type="text" placeholder="Stack (comma separated)" className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 outline-none" value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} required />
                  
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Media Assets</label>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <div className="relative aspect-square border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center hover:border-red-600 transition-all cursor-pointer">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                        {uploading ? <Loader2 className="animate-spin text-red-600" size={20} /> : <Plus size={24} className="text-gray-600" />}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    {editingId && <button type="button" onClick={resetForm} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl"><X size={20} /></button>}
                    <button type="submit" disabled={submitting || uploading} className={`flex-1 ${editingId ? 'bg-green-600' : 'bg-red-600'} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all`}>
                      {submitting ? <Loader2 className="animate-spin" /> : editingId ? <Save size={18} /> : <Plus size={18} />}
                      {editingId ? "Save Changes" : "Publish Project"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Project List */}
            <div className="lg:col-span-7">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Project Inventory ({projects.length})</h3>
                {loading && <Loader2 className="animate-spin text-red-600" size={18} />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-white/10 transition-all shadow-lg">
                    <div className="relative h-48 overflow-hidden bg-[#111]">
                      {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button onClick={() => handleEdit(p)} className="bg-black/60 hover:bg-white/10 backdrop-blur-md p-2.5 rounded-lg transition-all"><Edit2 size={14} /></button>
                        <button onClick={() => p.id && handleDelete(p.id)} className="bg-red-600/80 hover:bg-red-600 p-2.5 rounded-lg transition-all"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold">{p.title}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">{p.year}</span>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-1">{p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Simplified Inbox */
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="text-red-600" /> Inbox
              </h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{messages.length} Total Messages</p>
            </div>

            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-20 text-center">
                  <Inbox size={40} className="text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">No Messages</h3>
                  <p className="text-gray-500 mt-2 text-sm">New inquiries will appear here.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`bg-[#0a0a0a] border ${msg.status === 'unread' ? 'border-red-600/30' : 'border-white/5'} rounded-2xl p-6 transition-all hover:bg-[#111]`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${msg.status === 'unread' ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-500'}`}>
                            {msg.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{msg.name}</p>
                            <a href={`mailto:${msg.email}`} className="text-xs text-red-500 hover:underline">{msg.email}</a>
                          </div>
                          {msg.status === 'unread' && <span className="bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full ml-2">NEW</span>}
                        </div>
                        <h4 className="text-white font-semibold text-sm mb-2">Sub: {msg.subject}</h4>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 min-w-[140px]">
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mb-1 justify-end">
                            <Clock size={12} />
                            {new Date(msg.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleMessageStatus(msg)} className={`p-3 rounded-lg transition-all ${msg.status === 'unread' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                            {msg.status === 'unread' ? <CheckCircle2 size={18} /> : <MessageSquare size={18} />}
                          </button>
                          <button onClick={() => handleDeleteMessage(msg.id)} className="bg-white/5 text-gray-500 hover:text-red-500 p-3 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
