"use client";
import React from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import html2pdf from "html2pdf.js";
import { Search, Bell, Star, Settings, LogOut, CircleHelp, Download, ChevronRight, ChevronDown, TrendingUp, Wallet, XOctagon, Handshake, BarChart3, Users, Menu } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";

// --- Small UI helpers ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
);

const CardHeader = ({ title, right }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <h3 className="text-sm font-semibold text-gray-700 tracking-wide">{title}</h3>
    {right}
  </div>
);

const StatBadge = ({ children }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
    <TrendingUp className="w-3 h-3" /> {children}
  </span>
);

const MutedBtn = ({ children }) => (
  <button className="text-[11px] font-medium px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
    {children}
  </button>
);

// --- Demo data ---
const monthlyMIS = [
  { name: "Jan", a: 0.2, b: 0.15, c: 0.05 },
  { name: "Feb", a: 0.25, b: 0.12, c: 0.08 },
  { name: "Mar", a: 0.18, b: 0.1, c: 0.12 },
  { name: "Apr", a: 0.28, b: 0.16, c: 0.2 },
  { name: "May", a: 0.32, b: 0.22, c: 0.12 },
  { name: "Jun", a: 0.12, b: 0.1, c: 0.18 },
];

const sipBusiness = [
  { name: "Mar", value: 2.2, count: 120 },
  { name: "Apr", value: 1.5, count: 110 },
  { name: "May", value: 1.4, count: 105 },
  { name: "Jun", value: 1.6, count: 112 },
];

function ClientsBubble() {
  const bubbles = [
    { status: "Online", value: 60, color: "bg-amber-500", size: "w-16 h-16", top: "10%", left: "65%" },
    { status: "New", value: 2, color: "bg-green-500", size: "w-12 h-12", top: "65%", left: "70%" },
    { status: "Active", value: 541, color: "bg-red-500", size: "w-56 h-56", top: "30%", left: "35%" },
    { status: "Inactive", value: 3824, color: "bg-orange-600", size: "w-24 h-24", top: "60%", left: "10%" },
  ];

  return (
    <div className="relative w-full h-[250px]">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className={`absolute ${b.size} rounded-full ${b.color} flex flex-col items-center justify-center text-white shadow-lg`}
          style={{ top: b.top, left: b.left }}
        >
          <div className="text-sm font-bold">{b.value}</div>
          <div className="text-[10px] opacity-80">{b.status}</div>
        </div>
      ))}
    </div>
  );
}

function ExportPDFButton({ targetId }: { targetId: string }) {
  const handleDownload = async () => {
  const element = document.getElementById("dashboard-to-pdf");
  if (!element) return;

  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      canvasWidth: element.scrollWidth,
      canvasHeight: element.scrollHeight,
    });

    const pdf = new jsPDF("p", "pt", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    // Add more pages if needed
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save("dashboard.pdf");
  } catch (err) {
    console.error("Error generating PDF:", err);
  }
};
return (
    <button
      onClick={handleDownload}
      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >
      Download PDF
    </button>
  );
}

function TopNav() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-2 flex items-center gap-3">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 grid place-content-center text-white font-bold">W</div>
        <div className="leading-tight">
          <div className="text-sm font-bold">WealthElite</div>
          <div className="text-[10px] text-gray-500 -mt-0.5">INVESTMENT ADVISOR SUITE</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl ml-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input placeholder="ex. Live portfolio" className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30" />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-3 text-gray-500">
        <CircleHelp className="w-5 h-5" />
        <Bell className="w-5 h-5" />
        <Star className="w-5 h-5" />
        <Settings className="w-5 h-5" />
        <LogOut className="w-5 h-5" />
      </div>
    </div>
  );
}

function RedMenuBar() {
  const items = [
    "HOME","CRM","UTILITIES","INSURANCE","ASSETS","MUTUAL","RESEARCH","TRANSACT ONLINE","GOAL GPS","FINANCIAL PLANNING","WEALTH REPORT","OTHER"
  ];
  return (
    <div className="bg-red-600 text-white rounded-2xl px-3 py-2 mt-3 shadow-sm">
      <div className="flex items-center gap-5 text-[12px] font-medium overflow-x-auto whitespace-nowrap">
        {items.map((x) => (
          <button key={x} className="hover:opacity-90 flex items-center gap-1">
            <span>{x}</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </button>
        ))}
      </div>
    </div>
  );
}

function KPIBlock({ title, value, unit, subtext }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] text-gray-500">Current</div>
          <div className="flex items-end gap-2 mt-1">
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            <div className="text-gray-400 mb-0.5">{unit}</div>
          </div>
          <div className="mt-2"><StatBadge>{subtext}</StatBadge></div>
        </div>
        <MutedBtn>View Report</MutedBtn>
      </div>
    </Card>
  );
}

function SmallMetric({ icon: Icon, title }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 grid place-content-center"><Icon className="w-5 h-5"/></div>
        <div className="flex-1">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="text-xs text-gray-400">0.00 INR</div>
        </div>
        <MutedBtn>View Report</MutedBtn>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Dashboard container for PDF */}
      <div className="max-w-[1200px] mx-auto" id="dashboard-to-pdf">
        
        {/* PDF Export Button */}
        <div className="flex justify-end mb-2">
          <ExportPDFButton targetId="dashboard-to-pdf" />
        </div>
        <div id="dashboard-to-pdf">
        {/* Your existing components */}
        <TopNav />
        <RedMenuBar />
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <KPIBlock title="AUM" value="AUM 12.19" unit="Cr" subtext="+0.77% MoM" />
          <KPIBlock title="SIP" value="SIP 1.39" unit="Lakh" subtext="+0% MoM" />
        </div>

        {/* Small metrics row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <SmallMetric icon={Wallet} title="Purchases" />
          <SmallMetric icon={Download} title="Redemptions" />
          <SmallMetric icon={XOctagon} title="Rej. Transactions" />
          <SmallMetric icon={Handshake} title="SIP Rejections" />
          <SmallMetric icon={BarChart3} title="New SIP" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Card>
            <CardHeader title="CLIENTS" right={<MutedBtn>Download Report</MutedBtn>} />
            <div className="h-[280px] px-3 pb-4">
              <ClientsBubble />
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"/> Online</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-600"/> New</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"/> Active</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"/> InActive</div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="SIP BUSINESS CHART" right={<MutedBtn>View Report</MutedBtn>} />
            <div className="h-[280px] px-3 pb-4">
              <ComposedSIP />
            </div>
          </Card>

          
            <Card>
            <CardHeader title="MONTHLY MIS" right={<MutedBtn>View Report</MutedBtn>} />
            <div className="h-[280px] px-3 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyMIS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v)=>`${v.toFixed(2)} Cr`} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="a" name="Equity" stroke="#22c55e" fillOpacity={1} fill="url(#a)" />
                  <Area type="monotone" dataKey="b" name="Debt" stroke="#3b82f6" fillOpacity={1} fill="url(#b)" />
                  <Area type="monotone" dataKey="c" name="Hybrid" stroke="#ef4444" fillOpacity={1} fill="url(#c)" />
                  {/* ...rest of AreaChart... */}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


function ComposedSIP() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={sipBusiness} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" domain={[0, 2.8]} />
        <YAxis yAxisId="right" orientation="right" domain={[0, 130]} />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="value"
          name="SIP Value (Cr)"
          fill="#0ea5e9"
          radius={[8, 8, 0, 0]}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="count"
          name="SIP Count"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}


/*
HOW TO USE in Next.js 14 (App Router):
1) Create a new project: 
   npx create-next-app@latest dashboard --ts --tailwind --eslint --app
2) Install deps:
   npm i recharts lucide-react
3) Save this file as app/page.tsx and start the dev server:
   npm run dev
*/
