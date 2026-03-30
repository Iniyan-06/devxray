import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Share2, FileDown } from "lucide-react";
import StatCards from "./StatCards";
import PipelineGraph from "./PipelineGraph";
import AIInsights from "./AIInsights";
import SimulationSection from "./SimulationSection";
import ScoreHistoryChart from "./ScoreHistoryChart";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ResultsDashboard({ data, isVisible }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isVisible && data) {
      fetchHistory();
    }
  }, [isVisible, data]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history/${data.owner}/${data.repo}`);
      if (res.ok) {
        const historyData = await res.json();
        setHistory(historyData);
      }
    } catch (err) {
      console.error("Failed to fetch history for chart:", err);
    }
  };

  if (!isVisible || !data) return null;

  const handleExportPDF = async () => {
    const element = document.getElementById("results");
    if (!element) return;

    // Add a temporary class to ensure everything is visible for export
    element.classList.add("bg-slate-900"); 

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#0f172a", // Match xray-bg
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`DevXRay_Report_${data.repo.replace("/", "_")}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      element.classList.remove("bg-slate-900");
    }
  };

  return (
    <section id="results" className="w-full max-w-7xl mx-auto py-10 px-4 relative z-10 mb-20 bg-xray-bg">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-xray-border/40"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-8 h-8 text-xray-green shadow-neon-green" />
            <h2 className="font-mono font-black text-3xl text-white tracking-tight">
              X-Ray Report: <span className="text-xray-cyan text-glow">{data.repo}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-gray-500 font-mono text-xs uppercase tracking-widest">
            <span>{data.total_runs_analyzed} runs analyzed</span>
            <span className="w-1.5 h-1.5 rounded-full bg-xray-border" />
            <span className="text-xray-blue">Powered by AI Analytics</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-xray-border text-gray-400 hover:text-xray-cyan hover:border-xray-cyan/40 hover:bg-xray-cyan/5 transition-all flex items-center justify-center gap-2"
          >
            <FileDown size={14} /> Export PDF
          </button>
          <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-xray-border text-gray-400 hover:text-xray-cyan hover:border-xray-cyan/40 hover:bg-xray-cyan/5 transition-all flex items-center justify-center gap-2">
            <Share2 size={14} /> Share
          </button>
        </div>
      </motion.div>

      {/* Top Stat Cards Section */}
      <StatCards data={data} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Pipeline Diagram (5 cols) - Higher z-index for tooltips */}
        <div className="lg:col-span-12 xl:col-span-5 relative z-30">
          <PipelineGraph />
        </div>

        {/* Right: AI Insights (7 cols) - Lower z-index so tooltips can overlap */}
        <div className="lg:col-span-12 xl:col-span-7 relative z-20">
          <AIInsights />
        </div>
      </div>

      {/* Score History Chart */}
      {history.length > 1 && (
        <div className="mb-12">
          <ScoreHistoryChart history={history} />
        </div>
      )}

      {/* Bottom Simulation Section */}
      <SimulationSection data={data} />

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center py-10"
      >
        <p className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em]">
          End of X-Ray Telemetry Report · Secure Data Transmission
        </p>
      </motion.div>
    </section>
  );
}
