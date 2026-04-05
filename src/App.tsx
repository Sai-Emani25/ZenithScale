/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HeartPulse,
  Bell,
  ListTodo,
  Search,
  X,
  Cloud, 
  ShieldCheck, 
  Zap, 
  RefreshCcw, 
  DollarSign, 
  Lock, 
  Server, 
  Database, 
  Globe, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  ChevronRight,
  Cpu,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend
} from 'recharts';
import { cn } from '@/src/lib/utils';

const costData = [
  { name: 'Traditional', compute: 5000, storage: 1200, security: 800, total: 7000 },
  { name: 'Optimized', compute: 1800, storage: 900, security: 1100, total: 3800 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface SearchItem {
  title: string;
  description: string;
  tab: string;
  category?: string;
}

interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
  category: string;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Rotate KMS Master Keys', priority: 'High', status: 'Pending', category: 'Security' },
  { id: '2', title: 'Patch EKS Worker Nodes', priority: 'High', status: 'Pending', category: 'Compute' },
  { id: '3', title: 'Optimize S3 Lifecycle Policies', priority: 'Medium', status: 'Completed', category: 'Storage' },
  { id: '4', title: 'Update WAF IP Blocklist', priority: 'High', status: 'Pending', category: 'Networking' },
  { id: '5', title: 'Review IAM Role Permissions', priority: 'Medium', status: 'Pending', category: 'Security' },
  { id: '6', title: 'Cleanup Unused EBS Volumes', priority: 'Low', status: 'Completed', category: 'Cost' },
];

interface Alert {
  id: string;
  type: 'KPI' | 'Security';
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'Security', severity: 'Critical', message: 'Unusual login pattern detected from unauthorized IP.', timestamp: '2026-04-04 21:10:00', status: 'Active' },
  { id: '2', type: 'KPI', severity: 'Warning', message: 'EKS Cluster CPU utilization exceeded 85%.', timestamp: '2026-04-04 21:15:00', status: 'Active' },
  { id: '3', type: 'Security', severity: 'Info', message: 'IAM policy update: "ReadOnlyAccess" modified.', timestamp: '2026-04-04 20:45:00', status: 'Resolved' },
  { id: '4', type: 'KPI', severity: 'Critical', message: 'Database connection pool saturation > 95%.', timestamp: '2026-04-04 21:20:00', status: 'Active' },
];

const SEARCHABLE_DATA: SearchItem[] = [
  { title: "Cloud Alerts", description: "Monitor and configure real-time KPI and security alerts. Track critical events and system health.", tab: "alerts" },
  { title: "Infrastructure Tasks", description: "Manage and prioritize maintenance tasks like KMS rotation, EKS patching, and IAM reviews.", tab: "tasks" },
  // Diagram
  { title: "Edge Layer", description: "CDN & WAF (CloudFront/Cloud Armor). DDoS Protection, SSL Offloading, Caching", tab: "diagram" },
  { title: "Compute Layer", description: "Auto-Scaling Group / K8s. Horizontal Scaling, Health Checks (Liveness/Readiness), Target Group Health Checks, Spot Instances", tab: "diagram" },
  { title: "Data Layer", description: "Distributed DB (Aurora/Spanner). Multi-AZ Replication, Encryption at Rest, Auto-Backups", tab: "diagram" },
  // Stack - Networking
  { title: "Route 53 / Cloud DNS", description: "High-availability DNS with health checks.", tab: "stack", category: "Networking" },
  { title: "CloudFront / Cloud CDN", description: "Low-latency content delivery at the edge.", tab: "stack", category: "Networking" },
  { title: "WAF / Shield", description: "L7 protection and DDoS mitigation.", tab: "stack", category: "Networking" },
  { title: "Load Balancer / Ingress", description: "ALB/NLB with health check based routing and SSL termination.", tab: "stack", category: "Networking" },
  // Stack - Compute
  { title: "EKS / GKE", description: "Managed Kubernetes with Liveness/Readiness probes and Cluster Autoscaler.", tab: "stack", category: "Compute" },
  { title: "Lambda / Cloud Functions", description: "Event-driven serverless for async tasks.", tab: "stack", category: "Compute" },
  { title: "Fargate / Cloud Run", description: "Serverless containers with built-in health check endpoints.", tab: "stack", category: "Compute" },
  // Stack - Storage & DB
  { title: "Aurora / Cloud Spanner", description: "Relational DB with global consistency.", tab: "stack", category: "Storage & DB" },
  { title: "S3 / Cloud Storage", description: "Highly durable object storage with lifecycle policies.", tab: "stack", category: "Storage & DB" },
  { title: "ElastiCache / Redis", description: "In-memory data store for performance.", tab: "stack", category: "Storage & DB" },
  // Scaling
  { title: "Horizontal Scaling", description: "CPU Utilization > 70%, Request Count per Target, Custom CloudWatch Metrics", tab: "scaling" },
  { title: "Vertical Scaling", description: "Instance Type Optimization, Memory-Intensive Tasks, Compute Optimizer", tab: "scaling" },
  // Recovery
  { title: "Warm Standby Strategy", description: "A scaled-down version of a fully functional environment is always running in a secondary region.", tab: "recovery" },
  { title: "Data Replication", description: "Continuous sync of DB and Object storage to DR region.", tab: "recovery" },
  { title: "Pilot Services", description: "Core services running at minimal capacity.", tab: "recovery" },
  { title: "DNS Failover", description: "Automated health-check based traffic redirection.", tab: "recovery" },
  { title: "Auto-Scale Up", description: "DR environment scales to production size on failover.", tab: "recovery" },
  // Cost
  { title: "Spot Instances", description: "Used for stateless worker nodes and non-critical batch jobs.", tab: "cost" },
  { title: "S3 Lifecycle", description: "Automated transition of old logs to Glacier Instant Retrieval.", tab: "cost" },
  { title: "Serverless First", description: "Zero cost for idle resources using Lambda and Cloud Run.", tab: "cost" },
  // Security
  { title: "Zero Trust Access", description: "Identity-aware proxy for internal tools, removing the need for traditional VPNs.", tab: "security" },
  { title: "Encryption Everywhere", description: "TLS 1.3 for transit and AES-256 for data at rest with customer-managed keys (KMS).", tab: "security" },
  { title: "IAM Least Privilege", description: "Strict role-based access control with automated credential rotation.", tab: "security" },
  { title: "Static Analysis (SAST)", description: "Automated code scanning for vulnerabilities before merge.", tab: "security" },
  { title: "Container Image Scanning", description: "Scanning for known CVEs in the container registry.", tab: "security" },
  { title: "Infrastructure as Code (IaC) Linting", description: "Ensuring Terraform/CloudFormation follows security best practices.", tab: "security" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('diagram');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t));
  };

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : SEARCHABLE_DATA.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleResultClick = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Cloud className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Cloud Architect Pro</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Principal Design Framework</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              {['diagram', 'stack', 'scaling', 'recovery', 'cost', 'security', 'tasks', 'alerts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                    activeTab === tab 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-80 md:w-96 bg-[#16161a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Search components, config..."
                          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-600"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')}>
                            <X className="w-4 h-4 text-slate-500 hover:text-white" />
                          </button>
                        )}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto p-2">
                        {filteredResults.length > 0 ? (
                          filteredResults.map((result, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleResultClick(result.tab)}
                              className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{result.title}</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-white/5 px-1.5 py-0.5 rounded">{result.tab}</span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1">{result.description}</p>
                            </button>
                          ))
                        ) : searchQuery ? (
                          <div className="p-8 text-center">
                            <p className="text-sm text-slate-500">No results found for "{searchQuery}"</p>
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <p className="text-sm text-slate-500">Start typing to search...</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                    <div 
                      className="fixed inset-0 z-[55]" 
                      onClick={() => setIsSearchOpen(false)}
                    />
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'diagram' && (
            <motion.section
              key="diagram"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="max-w-3xl">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Architecture Flow</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  A multi-layered defense-in-depth strategy from the edge to the data persistence layer.
                </p>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                {/* Edge Layer */}
                <FlowCard 
                  icon={<Globe className="w-6 h-6 text-blue-400" />}
                  title="Edge Layer"
                  desc="CDN & WAF (CloudFront/Cloud Armor)"
                  items={['DDoS Protection', 'SSL Offloading', 'Caching']}
                />
                <Arrow />
                {/* Compute Layer */}
                <FlowCard 
                  icon={<Server className="w-6 h-6 text-indigo-400" />}
                  title="Compute Layer"
                  desc="Auto-Scaling Group / K8s"
                  items={['Liveness/Readiness Probes', 'Target Group Health Checks', 'Spot Instances']}
                />
                <Arrow />
                {/* Data Layer */}
                <FlowCard 
                  icon={<Database className="w-6 h-6 text-emerald-400" />}
                  title="Data Layer"
                  desc="Distributed DB (Aurora/Spanner)"
                  items={['Multi-AZ Replication', 'Encryption at Rest', 'Auto-Backups']}
                />
              </div>
            </motion.section>
          )}

          {activeTab === 'stack' && (
            <motion.section
              key="stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <StackCard 
                category="Networking"
                services={[
                  { name: 'Route 53 / Cloud DNS', reason: 'High-availability DNS with health checks.' },
                  { name: 'ALB / Ingress Controller', reason: 'L7 routing with health check based traffic redirection.' },
                  { name: 'WAF / Shield', reason: 'L7 protection and DDoS mitigation.' }
                ]}
              />
              <StackCard 
                category="Compute"
                services={[
                  { name: 'EKS / GKE', reason: 'Managed K8s with Liveness/Readiness probes for self-healing.' },
                  { name: 'Lambda / Cloud Functions', reason: 'Event-driven serverless for async tasks.' },
                  { name: 'Fargate / Cloud Run', reason: 'Serverless containers with automated health checks.' }
                ]}
              />
              <StackCard 
                category="Storage & DB"
                services={[
                  { name: 'Aurora / Cloud Spanner', reason: 'Relational DB with global consistency.' },
                  { name: 'S3 / Cloud Storage', reason: 'Highly durable object storage with lifecycle policies.' },
                  { name: 'ElastiCache / Redis', reason: 'In-memory data store for performance.' }
                ]}
              />
            </motion.section>
          )}

          {activeTab === 'scaling' && (
            <motion.section
              key="scaling"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Zap className="text-blue-400 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Horizontal Scaling</h3>
                  </div>
                  <ul className="space-y-4">
                    <ScalingItem title="CPU Utilization > 70%" desc="Triggers new instance provisioning within 60 seconds." />
                    <ScalingItem title="Health Check Failures" desc="Automatically replaces instances failing Liveness/Readiness probes." />
                    <ScalingItem title="Request Count per Target" desc="Scales based on incoming traffic volume to maintain latency." />
                  </ul>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Layers className="text-amber-400 w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Vertical Scaling</h3>
                  </div>
                  <ul className="space-y-4">
                    <ScalingItem title="Instance Type Optimization" desc="Right-sizing based on historical performance data." />
                    <ScalingItem title="Memory-Intensive Tasks" desc="Dynamic adjustment for batch processing workloads." />
                    <ScalingItem title="Compute Optimizer" desc="AI-driven recommendations for instance family upgrades." />
                  </ul>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'recovery' && (
            <motion.section
              key="recovery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold text-white">Warm Standby Strategy</h3>
                  <p className="text-slate-400 leading-relaxed">
                    A scaled-down version of a fully functional environment is always running in a secondary region.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">RTO</p>
                      <p className="text-2xl font-bold text-white">&lt; 15 Mins</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">RPO</p>
                      <p className="text-2xl font-bold text-white">&lt; 5 Mins</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <RecoveryStep number="01" title="Data Replication" desc="Continuous sync of DB and Object storage to DR region." />
                  <RecoveryStep number="02" title="Pilot Services" desc="Core services running at minimal capacity." />
                  <RecoveryStep number="03" title="DNS Failover" desc="Automated health-check based traffic redirection." />
                  <RecoveryStep number="04" title="Auto-Scale Up" desc="DR environment scales to production size on failover." />
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'cost' && (
            <motion.section
              key="cost"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-8">Monthly Cost Comparison (USD)</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#f8fafc' }}
                      />
                      <Legend />
                      <Bar dataKey="compute" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="storage" stackId="a" fill="#10b981" />
                      <Bar dataKey="security" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CostSavingCard title="Spot Instances" saving="60-90%" desc="Used for stateless worker nodes and non-critical batch jobs." />
                <CostSavingCard title="S3 Lifecycle" saving="40%" desc="Automated transition of old logs to Glacier Instant Retrieval." />
                <CostSavingCard title="Serverless First" saving="Variable" desc="Zero cost for idle resources using Lambda and Cloud Run." />
              </div>
            </motion.section>
          )}

          {activeTab === 'security' && (
            <motion.section
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SecurityMeasure 
                  icon={<Lock className="w-6 h-6 text-blue-400" />}
                  title="Zero Trust Access"
                  desc="Identity-aware proxy for internal tools, removing the need for traditional VPNs."
                />
                <SecurityMeasure 
                  icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
                  title="Encryption Everywhere"
                  desc="TLS 1.3 for transit and AES-256 for data at rest with customer-managed keys (KMS)."
                />
                <SecurityMeasure 
                  icon={<ShieldAlert className="w-6 h-6 text-rose-400" />}
                  title="IAM Least Privilege"
                  desc="Strict role-based access control with automated credential rotation."
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">CI/CD Security Hardening</h3>
                <div className="space-y-4">
                  <SecurityCheck title="Static Analysis (SAST)" desc="Automated code scanning for vulnerabilities before merge." />
                  <SecurityCheck title="Container Image Scanning" desc="Scanning for known CVEs in the container registry." />
                  <SecurityCheck title="Infrastructure as Code (IaC) Linting" desc="Ensuring Terraform/CloudFormation follows security best practices." />
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'tasks' && (
            <motion.section
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Infrastructure Tasks</h2>
                  <p className="text-slate-400 text-sm mt-1">Prioritize and track critical maintenance operations.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Priority</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {tasks.sort((a, b) => {
                  const priorityMap = { High: 0, Medium: 1, Low: 2 };
                  return priorityMap[a.priority] - priorityMap[b.priority];
                }).map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl border transition-all",
                      task.status === 'Completed' 
                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" 
                        : "bg-white/5 border-white/10 hover:border-blue-500/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                          task.status === 'Completed'
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-white/20 hover:border-blue-500"
                        )}
                      >
                        {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={cn(
                            "font-bold text-sm transition-all",
                            task.status === 'Completed' ? "text-slate-500 line-through" : "text-white"
                          )}>
                            {task.title}
                          </h4>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
                            task.priority === 'High' ? "bg-rose-500/10 text-rose-500" :
                            task.priority === 'Medium' ? "bg-amber-500/10 text-amber-500" :
                            "bg-blue-500/10 text-blue-500"
                          )}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{task.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.priority === 'High' ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" :
                        task.priority === 'Medium' ? "bg-amber-500" :
                        "bg-blue-500"
                      )} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'alerts' && (
            <motion.section
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Cloud Alerts & Monitoring</h2>
                  <p className="text-slate-400 text-sm mt-1">Real-time KPI and security event notifications.</p>
                </div>
                <button 
                  onClick={() => {
                    const newAlert: Alert = {
                      id: Date.now().toString(),
                      type: 'Security',
                      severity: 'Warning',
                      message: 'Simulated alert: New IAM user created without MFA.',
                      timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
                      status: 'Active'
                    };
                    setAlerts([newAlert, ...alerts]);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Simulate Alert
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Active Alerts
                  </h3>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={cn(
                          "p-4 rounded-xl border flex items-start gap-4 transition-all",
                          alert.status === 'Resolved' 
                            ? "bg-white/5 border-white/5 opacity-50" 
                            : alert.severity === 'Critical' 
                              ? "bg-rose-500/5 border-rose-500/20" 
                              : "bg-amber-500/5 border-amber-500/20"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-lg mt-1",
                          alert.severity === 'Critical' ? "bg-rose-500/20 text-rose-500" :
                          alert.severity === 'Warning' ? "bg-amber-500/20 text-amber-500" :
                          "bg-blue-500/20 text-blue-500"
                        )}>
                          {alert.type === 'Security' ? <ShieldAlert className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                                alert.severity === 'Critical' ? "bg-rose-500 text-white" :
                                alert.severity === 'Warning' ? "bg-amber-500 text-white" :
                                "bg-blue-500 text-white"
                              )}>
                                {alert.severity}
                              </span>
                              <span className="text-xs font-bold text-white">{alert.type} Alert</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-300 mb-2">{alert.message}</p>
                          {alert.status === 'Active' && (
                            <button 
                              onClick={() => setAlerts(alerts.map(a => a.id === alert.id ? { ...a, status: 'Resolved' } : a))}
                              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                            >
                              Mark as Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <RefreshCcw className="w-5 h-5 text-indigo-400" />
                    Alert Configuration
                  </h3>
                  <div className="space-y-4">
                    <AlertConfigItem 
                      title="CPU Threshold" 
                      desc="Notify if CPU > 80% for 5 mins" 
                      enabled={true} 
                    />
                    <AlertConfigItem 
                      title="DDoS Detection" 
                      desc="Trigger on WAF rate limit breach" 
                      enabled={true} 
                    />
                    <AlertConfigItem 
                      title="Unauthorized Access" 
                      desc="Alert on 403 errors from CloudFront" 
                      enabled={false} 
                    />
                    <AlertConfigItem 
                      title="Cost Spike" 
                      desc="Notify if daily spend > $200" 
                      enabled={true} 
                    />
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            Designed for Enterprise Scalability & Resilience. &copy; 2026 Cloud Architect Pro.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FlowCard({ icon, title, desc, items }: { icon: React.ReactNode, title: string, desc: string, items: string[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/30 transition-colors group">
      <div className="mb-4">{icon}</div>
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-slate-500 text-xs mb-4 font-medium">{desc}</p>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item} className="flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden md:flex justify-center">
      <ArrowRight className="text-slate-700 w-8 h-8" />
    </div>
  );
}

function StackCard({ category, services }: { category: string, services: { name: string, reason: string }[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
        {category}
      </h3>
      <div className="space-y-6">
        {services.map(s => (
          <div key={s.name} className="group">
            <p className="text-blue-400 font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors">{s.name}</p>
            <p className="text-slate-500 text-xs leading-relaxed">{s.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScalingItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex gap-4">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
      <div>
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </li>
  );
}

function RecoveryStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
      <span className="text-blue-500 font-mono font-bold text-lg">{number}</span>
      <div>
        <p className="text-white font-bold text-sm mb-1">{title}</p>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CostSavingCard({ title, saving, desc }: { title: string, saving: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-white font-bold">{title}</h4>
        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider">
          Save {saving}
        </span>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function SecurityMeasure({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="mb-4">{icon}</div>
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function SecurityCheck({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      <div>
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}

function AlertConfigItem({ title, desc, enabled }: { title: string, desc: string, enabled: boolean }) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div>
        <p className="text-white font-bold text-sm">{title}</p>
        <p className="text-slate-500 text-[10px]">{desc}</p>
      </div>
      <div className={cn(
        "w-10 h-5 rounded-full p-1 transition-colors relative",
        enabled ? "bg-blue-600" : "bg-slate-700"
      )}>
        <div className={cn(
          "w-3 h-3 rounded-full bg-white transition-transform",
          enabled ? "translate-x-5" : "translate-x-0"
        )} />
      </div>
    </div>
  );
}
