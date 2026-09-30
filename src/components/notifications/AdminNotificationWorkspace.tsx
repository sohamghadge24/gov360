"use client";

import React, { useState, useEffect } from "react";
import { 
  Megaphone, FileText, Split, Activity,
  Send, Users, CheckCircle, AlertTriangle, Plus, X, Globe, Smartphone, BellRing, Inbox
} from "lucide-react";
import { notificationService, NotificationTemplate, NotificationRule, NotificationDelivery } from "@/api/notifications";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useToast } from "@/components/ui/ToastProvider";
import { Tabs } from "@/components/ui/Tabs";

export const AdminNotificationWorkspace = () => {
  const [activeTab, setActiveTab] = useState('inbox'); // inbox, templates, rules, broadcast, delivery
  
  // Hardcoded role for demo purposes. In a real app, this comes from auth context.
  const isAdmin = true;

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
      <div className="bg-white border-b px-6 py-6 flex flex-col md:flex-row md:items-start justify-between shadow-sm shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Notifications</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Notifications</h1>
          <p className="text-sm text-gray-500">Manage operational alerts, reminders, broadcasts and notification delivery.</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={() => setActiveTab('broadcast')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out shadow-sm"
            >
              <Megaphone className="w-4 h-4" /> Create Broadcast
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <Tabs
          tabs={[
            { id: 'inbox', label: 'Inbox', icon: Inbox },
            ...(isAdmin ? [
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'rules', label: 'Rules', icon: Split },
              { id: 'broadcast', label: 'Broadcasts', icon: Megaphone },
              { id: 'delivery', label: 'Delivery', icon: Activity }
            ] : [])
          ]}
          activeId={activeTab}
          onChange={setActiveTab}
          variant="line"
        />
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'inbox' && (
          <div className="-mx-6 -my-6">
            <NotificationCenter hideHeader={true} />
          </div>
        )}
        {activeTab === 'templates' && isAdmin && <TemplatesTab />}
        {activeTab === 'rules' && isAdmin && <RulesTab />}
        {activeTab === 'broadcast' && isAdmin && <BroadcastTab />}
        {activeTab === 'delivery' && isAdmin && <DeliveryTab />}
      </div>
    </div>
  );
};

// --- Sub-components ---

const TemplatesTab = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    notificationService.getTemplates()
      .then(res => setTemplates(res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Notification Templates</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Template Name</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading templates...</td></tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p>No templates found.</p>
                </td>
              </tr>
            ) : (
              templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{t.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {t.channel === 'Push' ? <Smartphone className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
                      {t.channel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400"/> {t.language}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">v{t.version}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${t.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE TEMPLATE DRAWER */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white shadow-xl w-full max-w-2xl h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Create Notification Template</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Channel</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]">
                    <option>Push</option>
                    <option>In-app</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Language</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]">
                    <option>English</option>
                    <option>Marathi</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Template Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]" placeholder="e.g. Verification Reminder" />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Template Content (Subject / Title)</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px] mb-3" placeholder="Verification required" />
                
                <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Template Content (Message)</label>
                <textarea rows={5} className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]" placeholder="Your scheduled verification requires action." />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-w-sm">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <BellRing className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-900 leading-snug mb-1">Verification required</h4>
                        <p className="text-[12px] text-gray-600 leading-snug">Your scheduled verification requires action.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button onClick={async () => {
                try {
                  await notificationService.createTemplate({ name: 'New Template', channel: 'Push', language: 'English', status: 'Active' });
                  toast('Template created successfully', undefined, 'success');
                  setShowCreate(false);
                } catch(e) {
                  toast('Failed to create template', undefined, 'error');
                }
              }} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RulesTab = () => {
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    notificationService.getRules()
      .then(res => setRules(res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Notification Rules</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Rule Name</th>
              <th className="px-6 py-4">Trigger Event</th>
              <th className="px-6 py-4">Policy Link</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading rules...</td></tr>
            ) : rules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Split className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p>No rules configured.</p>
                </td>
              </tr>
            ) : (
              rules.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{r.trigger}</span></td>
                  <td className="px-6 py-4 text-sm text-blue-600 hover:underline cursor-pointer">{r.policyId || 'Global Operations'}</td>
                  <td className="px-6 py-4">
                    {r.name.toLowerCase().includes('escalat') ? (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded">Escalation</span>
                    ) : (
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">Reminder</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${r.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white shadow-xl w-full max-w-md h-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Create Rule</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm text-gray-600 mb-4">Rule configuration form.</p>
              <input type="text" className="w-full border p-2 rounded mb-4" placeholder="Rule Name" />
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded text-sm text-gray-600">Cancel</button>
              <button onClick={async () => {
                try {
                  await notificationService.createRule({ name: 'New Rule', trigger: 'Manual', status: 'Active' });
                  toast('Rule created successfully', undefined, 'success');
                  setShowCreate(false);
                } catch(e) {
                  toast('Failed to create rule', undefined, 'error');
                }
              }} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BroadcastTab = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  return (
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2"><Megaphone className="w-5 h-5 text-blue-600" /> Create Organizational Broadcast</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {step} of 2</span>
        </div>
        
        {step === 1 ? (
          <div className="p-8 space-y-6">
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Broadcast Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]" placeholder="e.g. Urgent: Weather Advisory" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Message Content</label>
              <textarea rows={5} className="w-full border border-gray-300 rounded-lg p-3 text-[14px]" placeholder="Type your broadcast message..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Target Audience Scope</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px]">
                  <option>All Active Employees</option>
                  <option>Specific Organization</option>
                  <option>Supervisors Only</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Delivery Channels</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" defaultChecked className="rounded text-blue-600" /> In-App Notification</label>
                  <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" defaultChecked className="rounded text-blue-600" /> Mobile Push</label>
                </div>
              </div>
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-gray-100">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancel</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Review Broadcast</button>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-amber-900 mb-1">Broadcast Review</h3>
                <p className="text-sm text-amber-800">This message will be sent to the selected organizational audience immediately. Approval is optional.</p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">Review Summary</div>
              <div className="p-4 grid grid-cols-3 gap-y-4 gap-x-2 text-sm">
                <div className="font-medium text-gray-500">Audience</div>
                <div className="col-span-2 text-gray-900 font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-gray-400"/> All Active Employees</div>
                
                <div className="font-medium text-gray-500">Channels</div>
                <div className="col-span-2 text-gray-900">In-App, Push</div>
                
                <div className="font-medium text-gray-500">Message</div>
                <div className="col-span-2 text-gray-700 italic bg-gray-50 p-3 rounded border border-gray-100">
                  <strong className="block mb-1 not-italic text-gray-900">Urgent: Weather Advisory</strong>
                  Please be advised of heavy rainfall.
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex justify-between items-center border-t border-gray-100 pt-6">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Back to Edit</button>
              <button 
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await notificationService.broadcast({ message: 'Urgent: Weather Advisory' });
                    toast('Broadcast sent successfully!', undefined, 'success');
                    setStep(1);
                  } catch(e) {
                    toast('Failed to send broadcast.', undefined, 'error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }} 
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-600 text-white font-medium text-sm rounded-lg hover:bg-green-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-sm"
              >
                {isSubmitting ? <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</> : <><Send className="w-4 h-4" /> Send Broadcast</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DeliveryTab = () => {
  const [deliveries, setDeliveries] = useState<NotificationDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = () => {
    setLoading(true);
    setError(false);
    notificationService.getDeliveries()
      .then(res => setDeliveries(res || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delivery</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center mt-6">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-1">Unable to load delivery records.</p>
          <button onClick={fetchDeliveries} className="mt-4 px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm font-medium hover:bg-gray-50">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Delivery</h2>
        <p className="text-sm text-gray-500">Monitor notification delivery status. Message secrets are excluded.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Notification</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading delivery logs...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p>No delivery logs available.</p>
                </td>
              </tr>
            ) : (
              deliveries.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">{d.notificationId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{d.channel}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      {d.status === 'Delivered' ? <CheckCircle className="w-4 h-4 text-green-500" /> : 
                       d.status === 'Failed' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : 
                       d.status === 'Processing' ? <Activity className="w-4 h-4 text-blue-500" /> :
                       <div className="w-2 h-2 rounded-full border border-gray-400 ml-1"></div>}
                      <span className={d.status === 'Delivered' ? 'text-green-700' : d.status === 'Failed' ? 'text-red-700' : d.status === 'Processing' ? 'text-blue-700' : 'text-gray-600'}>
                        {d.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(d.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
