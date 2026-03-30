import { motion } from "framer-motion";
import { Info, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const JOBS = [
  { id: 1, name: "Checkout", duration: 12, status: "healthy" },
  { id: 2, name: "Linting", duration: 45, status: "healthy" },
  { id: 3, name: "Unit Tests", duration: 124, status: "warning", bottleneck: true },
  { id: 4, name: "Security Scan", duration: 88, status: "healthy" },
  { id: 5, name: "Build Artifact", duration: 212, status: "critical", bottleneck: true },
  { id: 6, name: "Integration Tests", duration: 64, status: "healthy" },
  { id: 7, name: "Deploy Preview", duration: 32, status: "healthy" }
];

function JobNode({ job, delay }) {
  const getStatusColor = () => {
    switch (job.status) {
      case "healthy": return "xray-green";
      case "warning": return "xray-amber";
      case "critical": return "xray-red";
      default: return "gray-500";
    }
  };

  const Icon = job.status === "healthy" ? CheckCircle2 : job.status === "warning" ? AlertCircle : Info;
  const statusColor = getStatusColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`relative group bg-xray-navy/50 border border-xray-border p-4 rounded-xl hover:border-${statusColor}/50 hover:bg-xray-navy/80 transition-all cursor-pointer hover:z-50`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-${statusColor}/10 border border-${statusColor}/20`}>
          <Icon className={`w-5 h-5 text-${statusColor}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-mono text-sm font-bold text-white mb-1">{job.name}</h4>
          <span className="text-gray-500 font-mono text-xs uppercase">{job.duration}s</span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono border bg-${statusColor}/5 border-${statusColor}/20 text-${statusColor} uppercase tracking-tight`}>
          {job.status}
        </div>
      </div>

      {/* Hover Tooltip - Positioned to avoid clipping */}
      {job.bottleneck && (
        <div className="absolute top-1/2 left-0 sm:left-full ml-0 sm:ml-4 -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none min-w-[180px]">
          <div className="glass-panel p-3 border-xray-amber/30 w-full shadow-neon-amber bg-xray-navy/95 backdrop-blur-xl">
            <h5 className="text-xray-amber font-mono text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
              <AlertCircle size={10} /> Bottleneck Detected
            </h5>
            <p className="text-gray-300 font-mono text-[9px] leading-tight flex items-center gap-1">
              ⚡ AI optimization fix available
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function PipelineGraph() {
  return (
    <div className="glass-panel p-8 h-full flex flex-col relative overflow-visible">
      <div className="scan-line opacity-20" />
      <h3 className="text-xray-cyan font-mono text-xs uppercase font-bold tracking-[0.2em] mb-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-xray-cyan animate-pulse" />
        Pipeline Health Topology
      </h3>

      <div className="relative flex flex-col gap-6 items-center w-full max-w-sm mx-auto">
        {/* Connection Arcs */}
        <div className="absolute top-10 bottom-10 left-1/2 w-px bg-gradient-to-b from-xray-cyan/20 via-xray-amber/20 to-xray-green/20" />

        {JOBS.map((job, idx) => (
          <div key={job.id} className="w-full relative z-10">
            <JobNode job={job} delay={0.2 + idx * 0.1} />
            {idx < JOBS.length - 1 && (
              <div className="flex justify-center my-1 pointer-events-none">
                <ChevronRight className="rotate-90 text-xray-border w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
