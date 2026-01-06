
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from './components/Button';
import { MessageEditor } from './components/MessageEditor';
import { Message, MessageStatus, UserProfile, MessageTone } from './types';

// Simple Mock Auth State
const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  // Load mock data
  useEffect(() => {
    const mockUser: UserProfile = {
      id: 'u1',
      name: 'Evelyn Grace',
      email: 'evelyn@example.com',
      approvers: [
        { id: 'a1', name: 'John Doe', email: 'john@example.com', phone: '123-456', relationship: 'Son', status: 'CONFIRMED' },
        { id: 'a2', name: 'Jane Smith', email: 'jane@example.com', phone: '987-654', relationship: 'Lawyer', status: 'PENDING' }
      ]
    };
    setUser(mockUser);

    const mockMessages: Message[] = [
      {
        id: 'm1',
        title: 'Letter to my children',
        recipientName: 'The Grace Kids',
        recipientEmail: 'kids@example.com',
        content: 'I love you all so much. Remember to always be kind to one another...',
        status: MessageStatus.LOCKED,
        tone: MessageTone.EMOTIONAL,
        createdAt: Date.now() - 10000000,
      }
    ];
    setMessages(mockMessages);
  }, []);

  const handleSaveMessage = (data: Partial<Message>) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title || 'Untitled',
      recipientName: data.recipientName || 'Unknown',
      recipientEmail: data.recipientEmail || '',
      content: data.content || '',
      status: data.status || MessageStatus.DRAFT,
      tone: data.tone || MessageTone.EMOTIONAL,
      createdAt: Date.now(),
    };
    setMessages([newMessage, ...messages]);
    setIsNewMessageOpen(false);
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl italic">L</span>
              </div>
              <span className="font-serif font-bold text-xl text-slate-800 tracking-tight">Last Words</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/profile" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Profile</Link>
                  <Button size="sm" onClick={() => setIsNewMessageOpen(true)}>+ New Message</Button>
                </>
              ) : (
                <Button size="sm">Sign In</Button>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
          {isNewMessageOpen ? (
            <MessageEditor onSave={handleSaveMessage} onCancel={() => setIsNewMessageOpen(false)} />
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard messages={messages} user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/approver-portal" element={<ApproverPortal />} />
            </Routes>
          )}
        </main>

        <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center">
          <p className="text-sm text-slate-500 mb-2 italic">"Your legacy is the love you leave behind."</p>
          <p className="text-xs text-slate-400">&copy; 2024 Last Words. Not a legal replacement for a will.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

const Dashboard: React.FC<{ messages: Message[], user: UserProfile | null }> = ({ messages, user }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="text-slate-600">Your messages are safe and encrypted. They will only be shared when the time is right.</p>
      </header>

      {/* Emergency Banner */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start space-x-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1">Status: Active Preservation</h3>
          <p className="text-sm text-amber-800">Your messages are currently <b>Locked</b>. Two verified approvers are required to trigger release.</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Your Legacy Messages</h2>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{messages.length} Total</span>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 mb-4 italic">No messages stored yet.</p>
            <Button variant="outline">Create Your First Message</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map(msg => (
              <MessageCard key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </section>

      {/* Approvers Quick View */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Your Trusted Approvers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.approvers.map(app => (
            <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="font-semibold text-slate-800">{app.name}</p>
                <p className="text-xs text-slate-500 uppercase">{app.relationship}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  const statusColors = {
    [MessageStatus.DRAFT]: 'bg-slate-100 text-slate-600',
    [MessageStatus.LOCKED]: 'bg-indigo-100 text-indigo-700',
    [MessageStatus.AWAITING_APPROVAL]: 'bg-amber-100 text-amber-700',
    [MessageStatus.SENT]: 'bg-green-100 text-green-700',
  };

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${statusColors[message.status]}`}>
            {message.status}
          </span>
          <span className="text-slate-300 group-hover:text-slate-500 transition-colors">
            {message.status === MessageStatus.LOCKED ? (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            ) : (
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            )}
          </span>
        </div>
        <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{message.title}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">To: {message.recipientName}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400">Created {new Date(message.createdAt).toLocaleDateString()}</span>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">View</Button>
      </div>
    </div>
  );
};

const Profile: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-serif font-bold mb-6">Your Profile</h2>
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-3xl font-bold">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Instructions</label>
            <textarea 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={3}
              placeholder="Any specific steps your family should take immediately..."
              defaultValue={user?.emergencyInstructions}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Manage Approvers</h2>
          <Button variant="outline" size="sm">+ Add</Button>
        </div>
        <p className="text-sm text-slate-500 mb-6">You must have exactly two active approvers. Both must independently confirm death before messages are released.</p>
        <div className="space-y-4">
          {user?.approvers.map(app => (
            <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{app.name}</p>
                <p className="text-sm text-slate-500">{app.email} • {app.relationship}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">Remove</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
        <h3 className="text-red-900 font-bold mb-2">Danger Zone</h3>
        <p className="text-red-700 text-sm mb-4">Permanently delete your account and all stored messages. This action cannot be undone.</p>
        <Button variant="danger" size="sm">Delete Account</Button>
      </div>
    </div>
  );
};

const ApproverPortal: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'IDLE' | 'OTP' | 'CONFIRM' | 'SUCCESS'>('IDLE');

  const startVerification = () => setStep('OTP');
  const verifyOtp = () => setStep('CONFIRM');
  const finalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto pt-12 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
             <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Verification Portal</h2>
          <p className="text-slate-500">Secure confirmation system for <b>Last Words</b></p>
        </div>

        {step === 'IDLE' && (
          <div className="space-y-6">
            <p className="text-sm text-center text-slate-600 leading-relaxed">
              You have been requested to confirm the death of <b>Evelyn Grace</b>.
              Please ensure you have read the legal implications of this action.
            </p>
            <Button className="w-full py-4" onClick={startVerification}>Begin Verification</Button>
          </div>
        )}

        {step === 'OTP' && (
          <div className="space-y-6">
            <p className="text-sm text-center text-slate-600 mb-4">A one-time passcode has been sent to your registered phone number (***-***-456).</p>
            <div className="flex justify-center space-x-2">
              {[1,2,3,4].map(i => <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none" />)}
            </div>
            <Button className="w-full" onClick={verifyOtp}>Verify Passcode</Button>
          </div>
        )}

        {step === 'CONFIRM' && (
          <div className="space-y-6 text-center">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-4">
               <p className="text-xs text-red-800 font-bold uppercase mb-2">Critical Warning</p>
               <p className="text-sm text-red-700">By proceeding, you attest to the death of the account holder. This will trigger message release once the second approver also confirms.</p>
            </div>
            <label className="flex items-center space-x-3 text-left mb-6">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
              <span className="text-sm text-slate-600">I solemnly swear the information provided is accurate and true.</span>
            </label>
            <Button variant="danger" className="w-full" onClick={finalize} isLoading={isProcessing}>Submit Death Declaration</Button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Confirmation Recorded</h3>
            <p className="text-sm text-slate-600">Thank you. Your confirmation has been logged. The system will notify the recipients once all requirements are met.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
