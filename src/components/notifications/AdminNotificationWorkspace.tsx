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
    <div className="flex flex-col h-full bg-transparent min-h-screen relative">
      <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">ADMINISTRATION</div>
          <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">NOTIFICATIONS</h1>
          <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
            Manage operational alerts, reminders, broadcasts and notification delivery.
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setActiveTab('broadcast')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 ease-out"
            >
              <Megaphone className="w-4 h-4" /> Create Broadcast
            </button>
          </div>
        )}
      </div>
    </div>

    <div className="px-10 shrink-0">
      <div className="max-w-[1600px] mx-auto border-b border-[var(--color-border)]/50 pt-2 pb-0">
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
    </div>

    <div className="flex-1 overflow-auto px-10 pb-10 pt-6 max-w-[1600px] mx-auto w-full relative z-10">
      {activeTab === 'inbox' && (
        <div className="glass-card h-full min-h-[500px] overflow-hidden">
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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-[var(--color-deep-navy)]">Notification Templates</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-white rounded-[10px] text-[12px] font-bold text-[var(--color-deep-navy)] hover:bg-white/80 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/30 border-b border-[var(--color-border)]/50 text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">
              <th className="px-6 py-4">Template Name</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-muted)] font-bold text-[13px]">Loading templates...</td></tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-muted)]">
                  <FileText className="w-10 h-10 text-[var(--color-border)] mx-auto mb-3" />
                  <p className="font-bold text-[13px]">No templates found.</p>
                </td>
              </tr>
            ) : (
              templates.map(t => (
                <tr key={t.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-[var(--color-deep-navy)] text-[14px]">{t.name}</p>
                    <p className="text-[12px] text-[var(--color-muted)] mt-1 truncate max-w-xs">{t.subject}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[12px] font-bold bg-white/60 text-[var(--color-neutral)] border border-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      {t.channel === 'Push' ? <Smartphone className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
                      {t.channel}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[var(--color-neutral)]">
                    <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[var(--color-muted)]" /> {t.language}</span>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[var(--color-muted)]">v{t.version}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${t.status === 'Active' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' : 'bg-white/60 text-[var(--color-muted)]'}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[var(--color-deep-navy)]/40 backdrop-blur-sm">
          <div className="glass-card shadow-2xl w-full max-w-2xl h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-200 rounded-none md:rounded-l-[24px] border-r-0 my-0 border-y-0">
            <div className="p-6 border-b border-[var(--color-border)]/50 flex justify-between items-center bg-white/40">
              <h2 className="text-[20px] font-bold text-[var(--color-deep-navy)]">Create Notification Template</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--color-muted)] hover:text-[var(--color-deep-navy)] p-2 rounded-[10px] hover:bg-white/60 transition-colors shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 flex-1 flex flex-col">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Channel</label>
                  <select className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <option>Push</option>
                    <option>In-app</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Language</label>
                  <select className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                    <option>English</option>
                    <option>Marathi</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Template Name</label>
                <input type="text" className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="e.g. Verification Reminder" />
              </div>

              <div>
                <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Template Content (Subject / Title)</label>
                <input type="text" className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-4" placeholder="Verification required" />

                <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Template Content (Message)</label>
                <textarea rows={5} className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="Your scheduled verification requires action." />
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]/50">
                <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Preview</h3>
                <div className="bg-white/40 rounded-[18px] p-4 border border-white max-w-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary)]"></div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <BellRing className="w-4 h-4 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[var(--color-deep-navy)] leading-snug mb-1">Verification required</h4>
                        <p className="text-[12px] text-[var(--color-neutral)] leading-snug">Your scheduled verification requires action.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="p-6 border-t border-[var(--color-border)]/50 bg-white/40 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 bg-white/60 border border-white rounded-[14px] text-[13px] font-bold text-[var(--color-deep-navy)] hover:bg-white transition-colors shadow-sm">Cancel</button>
              <button onClick={async () => {
                try {
                  await notificationService.createTemplate({ name: 'New Template', channel: 'Push', language: 'English', status: 'Active' });
                  toast('Template created successfully', undefined, 'success');
                  setShowCreate(false);
                } catch (e) {
                  toast('Failed to create template', undefined, 'error');
                }
              }} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold hover:bg-blue-700 shadow-md flex items-center transition-colors">Save Template</button>
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
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-[var(--color-deep-navy)]">Notification Rules</h2>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-white rounded-[10px] text-[12px] font-bold text-[var(--color-deep-navy)] hover:bg-white/80 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/30 border-b border-[var(--color-border)]/50 text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">
              <th className="px-6 py-4">Rule Name</th>
              <th className="px-6 py-4">Trigger Event</th>
              <th className="px-6 py-4">Policy Link</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-[var(--color-muted)] font-bold text-[13px]">Loading rules...</td></tr>
            ) : rules.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-muted)]">
                  <Split className="w-10 h-10 text-[var(--color-border)] mx-auto mb-3" />
                  <p className="font-bold text-[13px]">No rules configured.</p>
                </td>
              </tr>
            ) : (
              rules.map(r => (
                <tr key={r.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-5 font-bold text-[var(--color-deep-navy)] text-[14px]">{r.name}</td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[var(--color-neutral)]"><span className="bg-white/60 border border-white px-2 py-1.5 rounded-[8px] font-mono shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[12px]">{r.trigger}</span></td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[var(--color-primary)] hover:underline cursor-pointer">{r.policyId || 'Global Operations'}</td>
                  <td className="px-6 py-5">
                    {r.name.toLowerCase().includes('escalat') ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-3 py-1.5 rounded-[10px] shadow-sm uppercase tracking-[0.05em]">Escalation</span>
                    ) : (
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/50 px-3 py-1.5 rounded-[10px] shadow-sm uppercase tracking-[0.05em]">Reminder</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${r.status === 'Active' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' : 'bg-white/60 text-[var(--color-muted)]'}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[var(--color-deep-navy)]/40 backdrop-blur-sm">
          <div className="glass-card shadow-2xl w-full max-w-md h-full overflow-hidden flex flex-col rounded-none md:rounded-l-[24px] border-r-0 my-0 border-y-0">
            <div className="p-6 border-b border-[var(--color-border)]/50 flex justify-between items-center bg-white/40">
              <h2 className="text-[20px] font-bold text-[var(--color-deep-navy)]">Create Rule</h2>
              <button onClick={() => setShowCreate(false)} className="text-[var(--color-muted)] hover:text-[var(--color-deep-navy)] p-2 rounded-[10px] hover:bg-white/60 transition-colors shadow-sm"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 flex-1">
              <p className="text-[14px] text-[var(--color-neutral)] mb-4">Rule configuration form.</p>
              <input type="text" className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-4" placeholder="Rule Name" />
            </div>
            <div className="p-6 border-t border-[var(--color-border)]/50 bg-white/40 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 bg-white/60 border border-white rounded-[14px] text-[13px] font-bold text-[var(--color-deep-navy)] hover:bg-white transition-colors shadow-sm">Cancel</button>
              <button onClick={async () => {
                try {
                  await notificationService.createRule({ name: 'New Rule', trigger: 'Manual', status: 'Active' });
                  toast('Rule created successfully', undefined, 'success');
                  setShowCreate(false);
                } catch (e) {
                  toast('Failed to create rule', undefined, 'error');
                }
              }} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold hover:bg-blue-700 shadow-md flex items-center transition-colors">Save</button>
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
    <div className="max-w-4xl mx-auto py-4">
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]/50 bg-white/30 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[var(--color-deep-navy)] flex items-center gap-2"><Megaphone className="w-5 h-5 text-[var(--color-primary)]" /> Create Organizational Broadcast</h2>
          <span className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Step {step} of 2</span>
        </div>

        {step === 1 ? (
          <div className="p-10 space-y-8">
            <div>
              <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Broadcast Title</label>
              <input type="text" className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="e.g. Urgent: Weather Advisory" />
            </div>
            <div>
              <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Message Content</label>
              <textarea rows={5} className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="Type your broadcast message..." />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Target Audience Scope</label>
                <select className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] font-bold text-[var(--color-deep-navy)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <option>All Active Employees</option>
                  <option>Specific Organization</option>
                  <option>Supervisors Only</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[var(--color-deep-navy)] block mb-2">Delivery Channels</label>
                <div className="space-y-3 mt-3">
                  <label className="flex items-center gap-3 text-[14px] font-bold text-[var(--color-neutral)] cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 bg-white/40 border-white" /> In-App Notification</label>
                  <label className="flex items-center gap-3 text-[14px] font-bold text-[var(--color-neutral)] cursor-pointer"><input type="checkbox" defaultChecked className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 bg-white/40 border-white" /> Mobile Push</label>
                </div>
              </div>
            </div>
            <div className="pt-6 flex justify-between items-center border-t border-[var(--color-border)]/50">
              <button className="text-[13px] font-bold text-[var(--color-muted)] hover:text-[var(--color-deep-navy)] transition-colors">Cancel</button>
              <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold text-[13px] rounded-[14px] hover:bg-blue-700 transition-colors shadow-md">Review Broadcast</button>
            </div>
          </div>
        ) : (
          <div className="p-10 space-y-8">
            <div className="bg-amber-50/80 border border-amber-200 rounded-[18px] p-6 flex items-start gap-5 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[15px] font-bold text-amber-900 mb-1.5">Broadcast Review</h3>
                <p className="text-[13px] font-medium text-amber-800 leading-relaxed">This message will be sent to the selected organizational audience immediately. Approval is optional.</p>
              </div>
            </div>

            <div className="bg-white/40 border border-white rounded-[18px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="bg-white/30 px-6 py-4 border-b border-[var(--color-border)]/50 text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Review Summary</div>
              <div className="p-6 grid grid-cols-3 gap-y-6 gap-x-4 text-[14px]">
                <div className="font-bold text-[var(--color-neutral)]">Audience</div>
                <div className="col-span-2 text-[var(--color-deep-navy)] font-bold flex items-center gap-2"><Users className="w-4 h-4 text-[var(--color-muted)]" /> All Active Employees</div>

                <div className="font-bold text-[var(--color-neutral)]">Channels</div>
                <div className="col-span-2 text-[var(--color-deep-navy)] font-bold">In-App, Push</div>

                <div className="font-bold text-[var(--color-neutral)]">Message</div>
                <div className="col-span-2 text-[var(--color-neutral)] bg-white/60 p-4 rounded-[12px] border border-white font-medium leading-relaxed">
                  <strong className="block mb-2 text-[var(--color-deep-navy)] font-bold text-[15px]">Urgent: Weather Advisory</strong>
                  Please be advised of heavy rainfall.
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-[var(--color-border)]/50 pt-8">
              <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-white/60 border border-white text-[var(--color-deep-navy)] font-bold text-[13px] rounded-[14px] hover:bg-white transition-colors shadow-sm">Back to Edit</button>
              <button
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    await notificationService.broadcast({ message: 'Urgent: Weather Advisory' });
                    toast('Broadcast sent successfully!', undefined, 'success');
                    setStep(1);
                  } catch (e) {
                    toast('Failed to send broadcast.', undefined, 'error');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-green-600 text-white font-bold text-[13px] rounded-[14px] hover:bg-green-700 hover:shadow-md active:scale-[0.98] transition-all duration-200 ease-out shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:shadow-sm"
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
      <div className="w-full">
        <h2 className="text-[18px] font-bold text-[var(--color-deep-navy)] mb-1">Delivery</h2>
        <div className="glass-card p-12 text-center mt-6">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-[var(--color-deep-navy)] font-bold mb-2">Unable to load delivery records.</p>
          <button onClick={fetchDeliveries} className="mt-4 px-6 py-2.5 bg-white/60 border border-white text-[var(--color-deep-navy)] rounded-[14px] shadow-sm font-bold hover:bg-white transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[var(--color-deep-navy)] mb-1">Delivery</h2>
        <p className="text-[13px] text-[var(--color-muted)] font-medium">Monitor notification delivery status. Message secrets are excluded.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/30 border-b border-[var(--color-border)]/50 text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">
              <th className="px-6 py-4">Notification</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/30">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[var(--color-muted)] font-bold text-[13px]">Loading delivery logs...</td></tr>
            ) : deliveries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[var(--color-muted)]">
                  <Activity className="w-10 h-10 text-[var(--color-border)] mx-auto mb-3" />
                  <p className="font-bold text-[13px]">No delivery logs available.</p>
                </td>
              </tr>
            ) : (
              deliveries.map(d => (
                <tr key={d.id} className="hover:bg-white/40 transition-colors cursor-pointer">
                  <td className="px-6 py-5 text-[13px] font-mono text-[var(--color-muted)] font-bold">{d.notificationId}</td>
                  <td className="px-6 py-5 text-[13px] font-bold text-[var(--color-neutral)]">{d.channel}</td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-2 text-[13px] font-bold">
                      {d.status === 'Delivered' ? <CheckCircle className="w-4 h-4 text-[#0A5D2C]" /> :
                        d.status === 'Failed' ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                          d.status === 'Processing' ? <Activity className="w-4 h-4 text-blue-500" /> :
                            <div className="w-2 h-2 rounded-full border border-gray-400 ml-1"></div>}
                      <span className={d.status === 'Delivered' ? 'text-[#0A5D2C]' : d.status === 'Failed' ? 'text-red-700' : d.status === 'Processing' ? 'text-blue-700' : 'text-[var(--color-muted)]'}>
                        {d.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[13px] text-[var(--color-muted)] font-bold">{new Date(d.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
