import React, { useState } from "react";
import { reportJobService } from "@/api/reports";
import { Loader2, Download, FileText, FileSpreadsheet, FileIcon, X } from "lucide-react";

interface Props {
  reportType: string;
  filters: any;
  onClose: () => void;
}

export const ExportDrawer = ({ reportType, filters, onClose }: Props) => {
  const [format, setFormat] = useState<'PDF' | 'XLSX' | 'CSV'>('PDF');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setStatus('Queued');
    try {
      const job = await reportJobService.createJob({ reportType, format, filters });
      if (!job) throw new Error("Failed to create job");
      setJobId(job.id);
      
      // Simulate polling for async job completion
      const interval = setInterval(async () => {
        try {
          const currentJob = await reportJobService.getJob(job.id);
          if (!currentJob) throw new Error("Failed to fetch job");
          setStatus(currentJob.status);
          if (currentJob.status === 'Completed') {
            clearInterval(interval);
            const downloadRes = await reportJobService.download(job.id);
            if (downloadRes) setDownloadUrl(downloadRes.downloadUrl);
            setLoading(false);
          } else if (currentJob.status === 'Failed') {
            clearInterval(interval);
            setLoading(false);
          }
        } catch (err) {
          clearInterval(interval);
          setStatus('Failed');
          setLoading(false);
        }
      }, 2000);
    } catch (err) {
      setStatus('Failed to queue export');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 overflow-hidden">
      <div className="w-full max-w-md bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Export Report</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5"/></button>
          </div>
          <p className="text-sm text-gray-500">{reportType}</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-3">Select Format</label>
             <div className="grid grid-cols-3 gap-3">
                {(['PDF', 'XLSX', 'CSV'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    disabled={!!jobId}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${format === fmt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                  >
                    {fmt === 'PDF' && <FileText className="w-6 h-6 mb-2" />}
                    {fmt === 'XLSX' && <FileSpreadsheet className="w-6 h-6 mb-2" />}
                    {fmt === 'CSV' && <FileIcon className="w-6 h-6 mb-2" />}
                    <span className="text-sm font-medium">{fmt}</span>
                  </button>
                ))}
             </div>
           </div>

           {jobId ? (
             <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
               <div className="mb-4">
                 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Status</span>
                 <span className="text-lg font-bold text-gray-900">{status}</span>
               </div>
               
               {status === 'Queued' || status === 'Processing' ? (
                 <div className="flex flex-col items-center justify-center text-blue-600">
                   <Loader2 className="w-8 h-8 animate-spin mb-2" />
                   <p className="text-sm">Processing your export...</p>
                 </div>
               ) : status === 'Completed' && downloadUrl ? (
                 <a 
                   href={downloadUrl}
                   target="_blank"
                   rel="noreferrer"
                   className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                 >
                   <Download className="w-5 h-5" /> Download Report
                 </a>
               ) : status === 'Failed' ? (
                 <p className="text-sm text-red-600 font-medium">Export generation failed.</p>
               ) : null}
             </div>
           ) : (
             <button
               onClick={handleGenerate}
               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
             >
               Generate Export
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
