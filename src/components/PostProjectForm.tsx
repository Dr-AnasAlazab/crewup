/** @format */
"use client";

import { useState, useRef, useCallback } from "react";
import {
  Calendar,
  ChevronDown,
  CloudUpload,
  FileText,
  X,
  Plus,
} from "lucide-react";
import StepTracker from "@/src/components/StepTracker";
import {
  formatCurrency,
  parseCurrencyToNumber,
} from "@/src/utils/helperFunctions";
import { createPost, getTrades } from "../actions/dataActions";
import { redirect } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type ProjectType = "commercial" | "residential" | "industrial";

interface UploadedFile {
  name: string;
  size: string;
  raw: File;
}

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
  { value: "industrial", label: "Industrial" },
];

// const BUDGET_RANGES = [
//   "$0 - $50,000",
//   "$50,000 - $100,000",
//   "$100,000 - $250,000",
//   "$250,000 - $500,000",
//   "$500,000 - $1,000,000",
//   "$1,000,000+",
// ];

// const TIMELINE_OPTIONS = [
//   "ASAP",
//   "Apr 15, 2024 - Jul 30, 2024",
//   "May 1, 2024 - Aug 31, 2024",
//   "Jun 1, 2024 - Dec 31, 2024",
//   "Jan 2025 - Jun 2025",
// ];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block text-sm font-bold text-slate-900 mb-1.5">
      {children}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
      {optional && (
        <span className="text-slate-400 font-normal ml-1">(Optional)</span>
      )}
    </label>
  );
}

function InputField({
  name,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface PostProjectFormProps {
  trades: string[]; // Pass trades as a prop
}

export default function PostProjectForm({ trades }: PostProjectFormProps) {
  const AVAILABLE_TRADES = trades; // Fetch trades from the database or define them statically if needed

  // Form state
  const [title, setTitle] = useState("Office Building Build-Out");
  const [projectType, setProjectType] = useState<ProjectType>("commercial");
  const [location, setLocation] = useState("Austin, TX");
  const [budget_max, setBudgetMax] = useState("");
  const [budget_min, setBudgetMin] = useState("");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [tradeDropdownOpen, setTradeDropdownOpen] = useState(false);
  const [description, setDescription] = useState(
    "We are looking for experienced subcontractors for an office build-out project.\nThe project includes framing, drywall, electrical, HVAC, and finishes.\nPlease include your availability, relevant experience, and any questions.",
  );
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      name: "Office_BuildOut_Plans.pdf",
      size: "2.4 MB",
      raw: new File([], ""),
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const removeTrade = (trade: string) =>
    setSelectedTrades((prev) => prev.filter((t) => t !== trade));

  const addTrade = (trade: string) => {
    if (!selectedTrades.includes(trade)) {
      setSelectedTrades((prev) => [...prev, trade]);
    }
    setTradeDropdownOpen(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      size: formatFileSize(f.size),
      raw: f,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const removeFile = (index: number) =>
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    selectedTrades.forEach((t) => fd.append("trades", t));
    createPost(fd); // Call the server action to create the post
    console.log("Step 1 data:", Object.fromEntries(fd.entries()));

    // onNext(fd);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Step tracker */}
      <StepTracker currentStep={1} />

      {/* Divider */}
      <div className="border-t border-slate-100 mb-7" />

      {/* ── Row 1: Project Title + Project Type ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Project Title */}
        <div>
          <Label required>Project Title</Label>
          <InputField
            name="title"
            placeholder="e.g. Office Building Build-Out"
            value={title}
            onChange={setTitle}
          />
        </div>

        {/* Project Type — radio cards */}
        <div>
          <Label required>Project Type</Label>
          <div className="flex gap-2">
            {PROJECT_TYPES.map(({ value, label }) => {
              const isSelected = projectType === value;
              return (
                <label
                  key={value}
                  className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-all text-sm font-medium select-none ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={value}
                    checked={isSelected}
                    onChange={() => setProjectType(value)}
                    className="hidden"
                  />
                  {/* Radio dot */}
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-blue-600" : "border-slate-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </span>
                  {label}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 2: Location + Timeline ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Location */}
        <div>
          <Label required>Location</Label>
          <InputField
            name="location"
            placeholder="City, State"
            value={location}
            onChange={setLocation}
          />
        </div>

        {/* Timeline */}
        <div>
          <Label required>Timeline</Label>
          <div className="relative">
            <label>Time start</label>
            <input
              name="timeline_start"
              type="date"
              className="w-full appearance-none pl-10 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
            />
            <label>Time end</label>
            <input
              name="timeline_end"
              type="date"
              className="w-full appearance-none pl-10 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
            />
            {/* <select
              name="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full appearance-none pl-10 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
            >
              {TIMELINE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select> */}
            {/* <Calendar
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            /> */}
          </div>
        </div>
      </div>

      {/* ── Row 3: Budget Range + Trade Needed ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Budget Range */}
        <div>
          <Label required>Budget Range</Label>
          <div className="relative">
            <input
              name="budget_min"
              type="text" // Changed to text to allow $ and commas
              placeholder="$100"
              value={formatCurrency(budget_min)} // Displays cleanly formatted string
              onChange={(e) => {
                const rawNumber = parseCurrencyToNumber(e.target.value);
                // Enforce your maximum logic manually if needed
                if (Number(rawNumber) <= 10000000) {
                  setBudgetMin(rawNumber.toString()); // Stores raw "433333" in state
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />

            {/* ── Budget Max Input ── */}
            <input
              name="budget_max"
              type="text"
              placeholder="$10,000,000"
              value={formatCurrency(budget_max)}
              onChange={(e) => {
                const rawNumber = parseCurrencyToNumber(e.target.value);
                if (Number(rawNumber) <= 10000000) {
                  setBudgetMax(rawNumber.toString());
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
            {/* <select
              name="budget_min"
              value={budget_min}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-9 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
            >
              <option key={budget_min} value={budget_min}>
                {budget_min}
              </option>
            </select>
            <select
              name="budget_max"
              value={budget_max}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-9 text-sm text-slate-900 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors cursor-pointer"
            >
              <option key={budget_max} value={budget_max}>
                {budget_max}
              </option>
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            /> */}
          </div>
        </div>

        {/* Trade Needed */}
        <div>
          <Label required>Trade Needed</Label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTradeDropdownOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white hover:border-slate-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            >
              <span className="text-slate-400">Select a Trade</span>
              <ChevronDown size={15} className="text-slate-400 hrink-0" />
            </button>

            {/* Dropdown */}
            {tradeDropdownOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                {AVAILABLE_TRADES.filter(
                  (t) => !selectedTrades.includes(t),
                ).map((trade) => (
                  <button
                    key={trade}
                    type="button"
                    onClick={() => addTrade(trade)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    {trade}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected trade tags */}
          {selectedTrades.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {selectedTrades.map((trade) => (
                <span
                  key={trade}
                  className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {trade}
                  <button
                    type="button"
                    onClick={() => removeTrade(trade)}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setTradeDropdownOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={13} />
                Add Trade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Project Description ── */}
      <div className="mb-5">
        <Label required>Project Description</Label>
        <div className="relative">
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Describe your project, scope of work, requirements, and any specific qualifications needed."
            className="w-full px-4 py-3 text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl bg-white resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
          />
          <span className="absolute bottom-3 right-4 text-xs text-slate-400 pointer-events-none">
            {description.length} / 1000
          </span>
        </div>
      </div>

      {/* ── Project Documents ── */}
      <div className="mb-7">
        <Label optional>Project Documents</Label>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-1 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <CloudUpload size={28} className="text-blue-600 mb-1" />
          <p className="text-sm text-slate-700">
            Drag & drop files here or{" "}
            <span className="text-blue-600 font-semibold">click to upload</span>
          </p>
          <p className="text-xs text-slate-400">
            Plans, drawings, specifications, or any other relevant documents.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.dwg,.xlsx,.docx,.doc,.png,.jpg"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white"
              >
                <FileText size={18} className="text-blue-500 flex-shrink-0" />
                <span className="flex-1 text-sm text-slate-700 font-medium truncate">
                  {file.name}
                </span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {file.size}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit Button ── */}
      <div className="border-t border-slate-100 pt-5">
        <button
          type="submit"
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Next: Scope & Budget
        </button>
      </div>
    </form>
  );
}
