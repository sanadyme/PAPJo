import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ===== FOLLOW-UP TEMPLATES =====
const FU_LIPID=[{param:"Total Cholesterol (mg/dL)",freq:"Every 3 months"},{param:"LDL (mg/dL)",freq:"Every 3 months"},{param:"HDL (mg/dL)",freq:"Every 3 months"},{param:"Triglycerides (mg/dL)",freq:"Every 3 months"},{param:"ALT (U/L)",freq:"Every 6 months"},{param:"AST (U/L)",freq:"Every 6 months"}];
const FU_OSTEO=[{param:"Bone Density (T-score)",freq:"Yearly"},{param:"Calcium Level (mg/dL)",freq:"Every 6 months"},{param:"Fracture Events",freq:"As occurs"},{param:"Side Effects (ONJ/Skin)",freq:"As occurs"}];
const FU_DM=[{param:"HbA1c (%)",freq:"Every 3 months"},{param:"Fasting Blood Glucose (mg/dL)",freq:"Weekly"},{param:"Hypoglycemic Events",freq:"As occurs"},{param:"Weight (kg)",freq:"Monthly"}];
const FU_HTN=[{param:"Systolic BP (mmHg)",freq:"Weekly"},{param:"Diastolic BP (mmHg)",freq:"Weekly"},{param:"Heart Rate (bpm)",freq:"Weekly"},{param:"Serum Creatinine (mg/dL)",freq:"Every 6 months"},{param:"Side Effects",freq:"As occurs"}];
const FU_AUTO=[{param:"CRP (mg/L)",freq:"Every 3 months"},{param:"ESR (mm/hr)",freq:"Every 3 months"},{param:"Infection Events",freq:"As occurs"},{param:"Side Effects",freq:"As occurs"}];
const FU_ONCO=[{param:"CBC - WBC (x10³/uL)",freq:"Every cycle"},{param:"Hemoglobin (g/dL)",freq:"Every cycle"},{param:"Platelets (x10³/uL)",freq:"Every cycle"},{param:"ALT (U/L)",freq:"Every cycle"},{param:"Side Effects / AEs",freq:"As occurs"}];
const FU_RESP=[{param:"FEV1 (%)",freq:"Every 6 months"},{param:"Peak Flow (L/min)",freq:"Monthly"},{param:"Exacerbation Events",freq:"As occurs"},{param:"Side Effects",freq:"As occurs"}];
const FU_PSYCH=[{param:"PHQ-9 Score",freq:"Every 3 months"},{param:"Side Effects",freq:"As occurs"},{param:"Weight (kg)",freq:"Monthly"}];
const FU_COAG=[{param:"INR",freq:"Weekly"},{param:"Hemoglobin (g/dL)",freq:"Monthly"},{param:"Bleeding Events",freq:"As occurs"},{param:"Side Effects",freq:"As occurs"}];

// ===== JFDA DRUG REGISTRY =====
const DRUGS_DB = [
  {id:"d1",activeIngredient:"Atorvastatin",tradeName:"Lipitor",company:"Pfizer",localAgent:"Pfizer Jordan",manufacturer:"Pfizer Inc.",mfrCountry:"USA",regType:"Originator",category:"Dyslipidemia",doses:["10mg","20mg","40mg","80mg"],followUp:FU_LIPID},
  {id:"d2",activeIngredient:"Atorvastatin",tradeName:"Atocor",company:"Dar Al Dawa",localAgent:"Dar Al Dawa",manufacturer:"Dar Al Dawa",mfrCountry:"Jordan",regType:"Generic",category:"Dyslipidemia",doses:["10mg","20mg","40mg"],followUp:FU_LIPID},
  {id:"d4",activeIngredient:"Rosuvastatin",tradeName:"Crestor",company:"AstraZeneca",localAgent:"AstraZeneca Jordan",manufacturer:"AstraZeneca",mfrCountry:"UK/Sweden",regType:"Originator",category:"Dyslipidemia",doses:["5mg","10mg","20mg","40mg"],followUp:FU_LIPID},
  {id:"d5",activeIngredient:"Rosuvastatin",tradeName:"Rosuvas",company:"Hikma",localAgent:"Hikma Pharmaceuticals",manufacturer:"Hikma Pharmaceuticals",mfrCountry:"Jordan",regType:"Generic",category:"Dyslipidemia",doses:["5mg","10mg","20mg"],followUp:FU_LIPID},
  {id:"d6",activeIngredient:"Simvastatin",tradeName:"Zocor",company:"MSD",localAgent:"MSD Jordan",manufacturer:"Merck Sharp & Dohme",mfrCountry:"USA",regType:"Originator",category:"Dyslipidemia",doses:["10mg","20mg","40mg"],followUp:FU_LIPID},
  {id:"d10",activeIngredient:"Alendronate",tradeName:"Fosamax",company:"MSD",localAgent:"MSD Jordan",manufacturer:"Merck Sharp & Dohme",mfrCountry:"USA",regType:"Originator",category:"Osteoporosis",doses:["70mg"],followUp:FU_OSTEO},
  {id:"d12",activeIngredient:"Denosumab",tradeName:"Prolia",company:"Amgen",localAgent:"Amgen (via Hikma)",manufacturer:"Amgen Inc.",mfrCountry:"USA",regType:"Originator",category:"Osteoporosis",doses:["60mg/mL"],followUp:FU_OSTEO},
  {id:"d13",activeIngredient:"Zoledronic Acid",tradeName:"Aclasta",company:"Novartis",localAgent:"Novartis Jordan",manufacturer:"Novartis Pharma",mfrCountry:"Switzerland",regType:"Originator",category:"Osteoporosis",doses:["5mg/100mL"],followUp:FU_OSTEO},
  {id:"d20",activeIngredient:"Insulin Glargine",tradeName:"Lantus",company:"Sanofi",localAgent:"Sanofi Jordan",manufacturer:"Sanofi-Aventis",mfrCountry:"France",regType:"Originator",category:"Diabetes",doses:["100 IU/mL"],followUp:FU_DM},
  {id:"d22",activeIngredient:"Empagliflozin",tradeName:"Jardiance",company:"Boehringer Ingelheim",localAgent:"Boehringer Ingelheim Jordan",manufacturer:"Boehringer Ingelheim",mfrCountry:"Germany",regType:"Originator",category:"Diabetes",doses:["10mg","25mg"],followUp:FU_DM},
  {id:"d23",activeIngredient:"Metformin",tradeName:"Glucophage",company:"Merck Serono",localAgent:"Merck Jordan",manufacturer:"Merck Sante",mfrCountry:"France",regType:"Originator",category:"Diabetes",doses:["500mg","850mg","1000mg"],followUp:FU_DM},
  {id:"d25",activeIngredient:"Sitagliptin",tradeName:"Januvia",company:"MSD",localAgent:"MSD Jordan",manufacturer:"Merck Sharp & Dohme",mfrCountry:"USA",regType:"Originator",category:"Diabetes",doses:["25mg","50mg","100mg"],followUp:FU_DM},
  {id:"d27",activeIngredient:"Semaglutide",tradeName:"Ozempic",company:"Novo Nordisk",localAgent:"Novo Nordisk Jordan",manufacturer:"Novo Nordisk",mfrCountry:"Denmark",regType:"Originator",category:"Diabetes",doses:["0.25mg","0.5mg","1mg"],followUp:FU_DM},
  {id:"d30",activeIngredient:"Amlodipine",tradeName:"Norvasc",company:"Pfizer",localAgent:"Pfizer Jordan",manufacturer:"Pfizer Inc.",mfrCountry:"USA",regType:"Originator",category:"Hypertension",doses:["5mg","10mg"],followUp:FU_HTN},
  {id:"d31",activeIngredient:"Amlodipine",tradeName:"Amlocard",company:"Hikma",localAgent:"Hikma Pharmaceuticals",manufacturer:"Hikma Pharmaceuticals",mfrCountry:"Jordan",regType:"Generic",category:"Hypertension",doses:["5mg","10mg"],followUp:FU_HTN},
  {id:"d32",activeIngredient:"Valsartan",tradeName:"Diovan",company:"Novartis",localAgent:"Novartis Jordan",manufacturer:"Novartis Pharma",mfrCountry:"Switzerland",regType:"Originator",category:"Hypertension",doses:["80mg","160mg","320mg"],followUp:FU_HTN},
  {id:"d36",activeIngredient:"Rivaroxaban",tradeName:"Xarelto",company:"Bayer",localAgent:"Bayer Jordan",manufacturer:"Bayer AG",mfrCountry:"Germany",regType:"Originator",category:"Anticoagulant",doses:["10mg","15mg","20mg"],followUp:FU_COAG},
  {id:"d40",activeIngredient:"Adalimumab",tradeName:"Humira",company:"AbbVie",localAgent:"AbbVie Jordan",manufacturer:"AbbVie Inc.",mfrCountry:"USA",regType:"Originator",category:"Autoimmune",doses:["40mg/0.4mL"],followUp:FU_AUTO},
  {id:"d41",activeIngredient:"Etanercept",tradeName:"Enbrel",company:"Pfizer",localAgent:"Pfizer Jordan",manufacturer:"Pfizer/Wyeth",mfrCountry:"USA",regType:"Originator",category:"Autoimmune",doses:["25mg","50mg"],followUp:FU_AUTO},
  {id:"d50",activeIngredient:"Trastuzumab",tradeName:"Herceptin",company:"Roche",localAgent:"Roche Jordan",manufacturer:"F. Hoffmann-La Roche",mfrCountry:"Switzerland",regType:"Originator",category:"Oncology",doses:["150mg","440mg"],followUp:FU_ONCO},
  {id:"d52",activeIngredient:"Pembrolizumab",tradeName:"Keytruda",company:"MSD",localAgent:"MSD Jordan",manufacturer:"Merck Sharp & Dohme",mfrCountry:"USA",regType:"Originator",category:"Oncology",doses:["25mg/mL"],followUp:FU_ONCO},
  {id:"d60",activeIngredient:"Budesonide/Formoterol",tradeName:"Symbicort",company:"AstraZeneca",localAgent:"AstraZeneca Jordan",manufacturer:"AstraZeneca",mfrCountry:"UK/Sweden",regType:"Originator",category:"Respiratory",doses:["160/4.5mcg","320/9mcg"],followUp:FU_RESP},
  {id:"d70",activeIngredient:"Sertraline",tradeName:"Zoloft",company:"Pfizer",localAgent:"Pfizer Jordan",manufacturer:"Pfizer Inc.",mfrCountry:"USA",regType:"Originator",category:"Psychiatry",doses:["50mg","100mg"],followUp:FU_PSYCH},
  {id:"d72",activeIngredient:"Pregabalin",tradeName:"Lyrica",company:"Pfizer",localAgent:"Pfizer Jordan",manufacturer:"Pfizer Inc.",mfrCountry:"USA",regType:"Originator",category:"Neuropathy",doses:["75mg","150mg","300mg"],followUp:FU_PSYCH},
];

const COMPANIES=[...new Set(DRUGS_DB.map(d=>d.company))];
const LOCATIONS_JO=["Amman","Irbid","Zarqa","Aqaba","Madaba","Jerash","Ajloun","Karak","Mafraq","Salt","Tafilah","Ma'an","Balqa","Ramtha"];
const ID_TYPES=[{value:"national",label:"National ID (الرقم الوطني)",placeholder:"10-digit National ID",docHint:"Jordanian national ID card"},{value:"passport",label:"Passport Number",placeholder:"Passport number",docHint:"passport from any country"},{value:"unhcr",label:"UNHCR Refugee ID",placeholder:"UNHCR ID number",docHint:"UNHCR refugee document"},{value:"military",label:"Military / Security ID",placeholder:"Military or security ID number",docHint:"military or security ID card"},{value:"iqama",label:"Residency Permit (إقامة)",placeholder:"Residency permit number",docHint:"Jordanian residency permit"},{value:"other",label:"Other Government ID",placeholder:"ID number",docHint:"government-issued identification document"}];
const genPAPId=()=>"PAP-"+Date.now().toString(36).toUpperCase()+"-"+Math.random().toString(36).substring(2,6).toUpperCase();

const INIT_PATIENTS=[
  {nationalId:"9901234567",idType:"national",name:"Ahmad Al-Masri",papId:"PAP-M1K2A-X7B3",doctor:"Dr. Khaled Haddad",reason:"Osteoporosis",drugId:"d10",dose:"70mg",frequency:"Once weekly",location:"Amman",registeredDate:"2025-08-15",discount:60,reports:[
    {date:"2025-11-10",params:{"Bone Density (T-score)":"-2.1","Calcium Level (mg/dL)":"8.9"},notes:"Stable"},{date:"2026-02-20",params:{"Bone Density (T-score)":"-1.9","Calcium Level (mg/dL)":"9.5"},notes:"Improving"}]},
  {nationalId:"9807654321",idType:"national",name:"Fatima Yousef",papId:"PAP-K8R3L-Q2M1",doctor:"Dr. Lina Naser",reason:"Familial hypercholesterolemia",drugId:"d1",dose:"40mg",frequency:"Once daily",location:"Irbid",registeredDate:"2025-06-01",discount:50,reports:[
    {date:"2025-09-01",params:{"Total Cholesterol (mg/dL)":"245","LDL (mg/dL)":"160","HDL (mg/dL)":"42","Triglycerides (mg/dL)":"190","ALT (U/L)":"28","AST (U/L)":"22"},notes:"Baseline"},
    {date:"2025-12-05",params:{"Total Cholesterol (mg/dL)":"198","LDL (mg/dL)":"112","HDL (mg/dL)":"48","Triglycerides (mg/dL)":"155"},notes:"Good response"},
    {date:"2026-03-10",params:{"Total Cholesterol (mg/dL)":"185","LDL (mg/dL)":"98","HDL (mg/dL)":"52","Triglycerides (mg/dL)":"140","ALT (U/L)":"30","AST (U/L)":"25"},notes:"Target achieved"}]},
  {nationalId:"9912345678",idType:"national",name:"Omar Khalil",papId:"PAP-N4T7W-J6P2",doctor:"Dr. Sami Abu-Rish",reason:"Type 2 Diabetes",drugId:"d20",dose:"20 units",frequency:"Once daily at bedtime",location:"Zarqa",registeredDate:"2025-10-01",discount:45,reports:[
    {date:"2026-01-05",params:{"HbA1c (%)":"8.2","Fasting Blood Glucose (mg/dL)":"165","Weight (kg)":"92"},notes:"Starting insulin"},
    {date:"2026-04-01",params:{"HbA1c (%)":"7.1","Fasting Blood Glucose (mg/dL)":"128","Weight (kg)":"93"},notes:"Improving"}]},
  {nationalId:"P8834521",idType:"passport",name:"Sarah Williams",papId:"PAP-P4R8T-V2N6",doctor:"Dr. Reem Jarrar",reason:"Rheumatoid Arthritis",drugId:"d40",dose:"40mg",frequency:"Every 2 weeks",location:"Amman",registeredDate:"2025-07-20",discount:70,reports:[
    {date:"2025-10-20",params:{"CRP (mg/L)":"12","ESR (mm/hr)":"35"},notes:"Baseline"},{date:"2026-01-20",params:{"CRP (mg/L)":"5","ESR (mm/hr)":"18"},notes:"Good response"}]},
  {nationalId:"UNHCR-830-24-JO-19845",idType:"unhcr",name:"Mohammed Al-Ahmad",papId:"PAP-U7K1S-Q5W3",doctor:"Dr. Khaled Haddad",reason:"Severe Osteoporosis",drugId:"d12",dose:"60mg",frequency:"Every 6 months",location:"Mafraq",registeredDate:"2025-09-10",discount:65,reports:[
    {date:"2026-03-10",params:{"Bone Density (T-score)":"-2.8","Calcium Level (mg/dL)":"9.2"},notes:"6-month check"}]},
  {nationalId:"9876543210",idType:"national",name:"Hasan Smadi",papId:"PAP-B2X5M-W3E7",doctor:"Dr. Lina Naser",reason:"Mixed Dyslipidemia",drugId:"d4",dose:"20mg",frequency:"Once daily",location:"Madaba",registeredDate:"2025-11-15",discount:50,reports:[
    {date:"2026-02-15",params:{"Total Cholesterol (mg/dL)":"220","LDL (mg/dL)":"140","HDL (mg/dL)":"38","Triglycerides (mg/dL)":"210"},notes:"Baseline"}]},
];

// ===== ICONS =====
const Icon=({type,size=20})=>{const s={width:size,height:size,display:"inline-block",verticalAlign:"middle"};const i={
  home:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10"/></svg>,
  user:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>,
  building:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 6h2m-2 4h2m-2 4h2m4-8h2m-2 4h2m-2 4h2"/></svg>,
  shield:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 4v6c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z"/></svg>,
  pill:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 1.5l-8 8a4.95 4.95 0 007 7l8-8a4.95 4.95 0 00-7-7z"/><path d="M8.5 8.5l7 7"/></svg>,
  check:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  upload:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  file:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
  arrow:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  back:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  alert:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>,
  map:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  logout:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  rx:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h6a4 4 0 010 8H6z"/><path d="M12 11l6 10M15 17l4-2"/></svg>,
  id:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/></svg>,
  dollar:<svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
};return i[type]||null;};

// ===== STYLES =====
const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
:root{--bg:#F0F4F4;--surface:#FFFFFF;--surface2:#E8EDED;--text:#1A2C2C;--text2:#5F7A7A;--primary:#0D7377;--primary-light:#E0F2F2;--primary-dark:#065456;--accent:#D64545;--accent-light:#FDF0F0;--blue:#0891B2;--blue-light:#ECFEFF;--amber:#D97706;--amber-light:#FFFBEB;--border:#D1DDDD;--radius:10px;--shadow:0 1px 3px rgba(0,0,0,.06)}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text)}
.fade-in{animation:fadeIn .3s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.landing{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:linear-gradient(160deg,#043B3E,#0D7377 40%,#14919B)}
.landing-card{background:rgba(255,255,255,.97);border-radius:16px;padding:44px 36px;max-width:460px;width:100%;box-shadow:0 25px 60px rgba(0,0,0,.25);position:relative;z-index:1}
.landing h1{font-family:'Playfair Display',serif;font-size:28px;color:var(--primary-dark);margin-bottom:4px}
.subtitle{color:var(--text2);font-size:14px;margin-bottom:28px}
.jordan-badge{display:inline-flex;align-items:center;gap:6px;background:var(--primary-light);color:var(--primary);font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;margin-bottom:16px}
.role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.role-btn{padding:14px 10px;border:2px solid var(--border);border-radius:var(--radius);background:var(--surface);cursor:pointer;text-align:center;transition:.2s;font-family:inherit}
.role-btn:hover,.role-btn.active{border-color:var(--primary);background:var(--primary-light)}
.role-btn span{display:block;font-size:12px;font-weight:600;margin-top:4px}.role-btn small{font-size:10px;color:var(--text2)}
.input-group{margin-bottom:14px}.input-group label{display:block;font-size:11px;font-weight:600;color:var(--text2);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px}
.input-group input,.input-group select,.input-group textarea{width:100%;padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;background:var(--surface)}
.input-group input:focus,.input-group select:focus,.input-group textarea:focus{outline:none;border-color:var(--primary)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;border:none;border-radius:8px;font-size:14px;font-weight:600;font-family:inherit;cursor:pointer;transition:.2s}
.btn-primary{background:var(--primary);color:#fff}.btn-primary:hover{background:var(--primary-dark)}
.btn-outline{background:transparent;color:var(--primary);border:1.5px solid var(--primary)}.btn-outline:hover{background:var(--primary-light)}
.btn-sm{padding:6px 12px;font-size:13px}.btn-full{width:100%}
.layout{display:flex;min-height:100vh}
.sidebar{width:230px;background:var(--primary-dark);color:#fff;padding:20px 0;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:10}
.sidebar-brand{padding:0 18px 20px;font-family:'Playfair Display',serif;font-size:18px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:6px}
.sidebar-brand small{display:block;font-family:'DM Sans',sans-serif;font-size:10px;opacity:.6;font-weight:400}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 18px;font-size:13px;cursor:pointer;transition:.15s;color:rgba(255,255,255,.7)}
.nav-item:hover{background:rgba(255,255,255,.08);color:#fff}.nav-item.active{background:rgba(255,255,255,.12);color:#fff;font-weight:600}
.sidebar-footer{margin-top:auto;padding:14px 18px;border-top:1px solid rgba(255,255,255,.1)}
.main{margin-left:230px;flex:1;padding:24px 28px;max-width:1200px}
.card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);padding:18px;box-shadow:var(--shadow)}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px;margin-bottom:20px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px}
.stat-card .label{font-size:11px;color:var(--text2);font-weight:500;text-transform:uppercase;letter-spacing:.3px}
.stat-card .value{font-size:24px;font-weight:700;margin-top:3px}.stat-card .sub{font-size:11px;color:var(--primary);font-weight:500;margin-top:2px}
.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;padding:8px 10px;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--text2);border-bottom:2px solid var(--border);font-weight:600}
td{padding:8px 10px;border-bottom:1px solid var(--border)}tr:hover td{background:var(--primary-light)}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.badge-green{background:var(--primary-light);color:var(--primary)}.badge-amber{background:var(--amber-light);color:var(--amber)}
.badge-blue{background:var(--blue-light);color:var(--blue)}.badge-red{background:var(--accent-light);color:var(--accent)}
.param-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.file-drop{border:2px dashed var(--border);border-radius:var(--radius);padding:20px;text-align:center;color:var(--text2);cursor:pointer;transition:.2s}
.file-drop:hover{border-color:var(--primary);background:var(--primary-light)}
.pap-id-card{background:linear-gradient(135deg,#043B3E,#0D7377);color:#fff;border-radius:12px;padding:20px;margin-bottom:20px}
.pap-id-card h3{font-family:'Playfair Display',serif;font-size:13px;opacity:.7;margin-bottom:4px}
.pap-id-card .id-number{font-size:22px;font-weight:700;letter-spacing:2px;font-family:monospace}
@media(max-width:768px){.sidebar{display:none}.main{margin-left:0;padding:14px}.stat-grid{grid-template-columns:1fr 1fr}.param-grid{grid-template-columns:1fr}.role-grid{grid-template-columns:1fr}.landing-card{padding:28px 20px}}`;

// ===== TREND CHARTS =====
const COLORS=["#0D7377","#0891B2","#D97706","#D64545","#7C3AED","#059669"];
function TrendCharts({reports,followUp}){
  if(!reports||reports.length<2||!followUp)return null;
  const numP=followUp.filter(f=>{const v=reports.filter(r=>r.params[f.param]&&!isNaN(parseFloat(r.params[f.param])));return v.length>=2;});
  if(!numP.length)return null;
  const groups=[];const used=new Set();
  numP.forEach(p=>{if(used.has(p.param))return;const u=(p.param.match(/\(([^)]+)\)/)||[])[1]||p.param;
    const g=numP.filter(q=>!used.has(q.param)&&((q.param.match(/\(([^)]+)\)/)||[])[1]||q.param)===u);
    g.forEach(x=>used.add(x.param));groups.push({unit:u,params:g});});
  return(<div style={{marginTop:20}}><h3 style={{fontSize:15,marginBottom:14}}>📈 Results Trending</h3>
    <div style={{display:"grid",gridTemplateColumns:groups.length===1?"1fr":"1fr 1fr",gap:14}}>
      {groups.map((g,gi)=>{const data=reports.filter(r=>g.params.some(p=>r.params[p.param]&&!isNaN(parseFloat(r.params[p.param])))).map(r=>{const pt={date:r.date};g.params.forEach(p=>{const v=parseFloat(r.params[p.param]);if(!isNaN(v))pt[p.param]=v;});return pt;});
        if(data.length<2)return null;
        return(<div key={gi} className="card" style={{padding:14}}><h4 style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>{g.params.length===1?g.params[0].param:g.unit}</h4>
          <ResponsiveContainer width="100%" height={200}><LineChart data={data} margin={{top:5,right:8,left:-15,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E3DF"/><XAxis dataKey="date" tick={{fontSize:9}} tickFormatter={d=>{const p=d.split("-");return p[1]+"/"+p[2];}}/><YAxis tick={{fontSize:9}}/>
            <Tooltip contentStyle={{fontSize:11,borderRadius:8}}/>{g.params.length>1&&<Legend wrapperStyle={{fontSize:10}}/>}
            {g.params.map((p,pi)=>(<Line key={p.param} type="monotone" dataKey={p.param} name={p.param.replace(/\s*\([^)]*\)/g,"")} stroke={COLORS[pi%COLORS.length]} strokeWidth={2} dot={{r:3}} connectNulls/>))}
          </LineChart></ResponsiveContainer></div>);})}</div></div>);
}

// ===== AI HELPERS =====
const readBase64=(file)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=()=>rej("fail");r.readAsDataURL(file);});
const getMediaType=(file)=>{const m={pdf:"application/pdf",png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",tiff:"image/tiff"};return m[file.name.toLowerCase().split(".").pop()]||file.type;};
async function callClaude(content,prompt){const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:[content,{type:"text",text:prompt}]}]})});const d=await r.json();return(d.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();}

// ===== PHARMACY PORTAL =====
function PharmacyPortal({patients,onLogout}){
  const[nid,setNid]=useState("");const[result,setResult]=useState(null);const[searched,setSearched]=useState(false);
  const lookup=()=>{setSearched(true);setResult(patients.find(x=>x.nationalId===nid||x.papId===nid||x.nationalId.toLowerCase()===nid.toLowerCase())||null);};
  const drug=result?DRUGS_DB.find(d=>d.id===result.drugId):null;
  const idLabel=result?(ID_TYPES.find(t=>t.value===result.idType)||ID_TYPES[0]).label:"";
  return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">Pharmacy<small>PAP Jordan</small></div>
    <div className="nav-item active"><Icon type="rx" size={18}/> Verify Patient</div>
    <div className="sidebar-footer"><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Sign Out</div></div></div>
    <div className="main fade-in">
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,marginBottom:20}}>PAP Patient Verification</h2>
      <div className="card" style={{maxWidth:580}}>
        <p style={{fontSize:13,color:"var(--text2)",marginBottom:14}}>Enter any patient ID (National ID, Passport, UNHCR, Military ID) or PAP Confirmation ID</p>
        <div className="input-group"><label>Patient ID / PAP Confirmation ID</label>
          <div style={{display:"flex",gap:8}}><input placeholder="e.g. 9807654321 / P8834521 / PAP-K8R3L-Q2M1" value={nid} onChange={e=>setNid(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookup()} style={{flex:1}}/>
            <button className="btn btn-primary" onClick={lookup}>Verify</button></div></div>
        {searched&&!result&&<div style={{padding:14,background:"var(--accent-light)",borderRadius:8,color:"var(--accent)",fontSize:13,textAlign:"center",marginTop:8}}>
          <Icon type="alert" size={18}/><p style={{marginTop:4,fontWeight:600}}>Not found in PAP program</p><p style={{fontSize:11}}>No patient matches this ID across any ID type</p></div>}
        {result&&drug&&(<div className="fade-in" style={{marginTop:16}}>
          <div className="pap-id-card"><h3>PAP Confirmation</h3><div className="id-number">{result.papId}</div>
            <div style={{display:"flex",gap:20,marginTop:10,fontSize:12,flexWrap:"wrap"}}>
              <div><span style={{opacity:.7}}>Patient</span><div style={{fontWeight:600}}>{result.name}</div></div>
              <div><span style={{opacity:.7}}>{idLabel}</span><div style={{fontWeight:600}}>{result.nationalId}</div></div></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="stat-card"><div className="label">Medication</div><div className="value" style={{fontSize:16}}>{drug.tradeName}</div><div className="sub">{drug.activeIngredient} — {result.dose}</div></div>
            <div className="stat-card" style={{background:"var(--primary-light)",border:"2px solid var(--primary)"}}><div className="label">PAP Discount</div><div className="value" style={{color:"var(--primary)"}}>{result.discount}%</div><div className="sub">Apply at dispensing</div></div>
            <div className="stat-card"><div className="label">Frequency</div><div className="value" style={{fontSize:13}}>{result.frequency}</div></div>
            <div className="stat-card"><div className="label">Prescriber</div><div className="value" style={{fontSize:13}}>{result.doctor}</div></div></div>
          <p style={{fontSize:10,color:"var(--text2)",marginTop:10,textAlign:"center"}}>Company: {drug.company} — Location: {result.location} — Enrolled: {result.registeredDate}</p></div>)}
      </div></div></div>);
}

// ===== LANDING =====
function Landing({patients,onLogin,onRegister}){
  const[role,setRole]=useState("patient");const[step,setStep]=useState("role");const[nid,setNid]=useState("");const[idType,setIdType]=useState("national");
  const[compSel,setCompSel]=useState(COMPANIES[0]);const[error,setError]=useState("");
  const[regForm,setReg]=useState({name:"",doctor:"",reason:"",drugId:"d1",drugSearch:"",dose:"",frequency:"",location:"Amman"});
  const[idExtracting,setIdExtracting]=useState(false);const[idStatus,setIdStatus]=useState("");
  const fileRef=useRef(null);const drug=DRUGS_DB.find(d=>d.id===regForm.drugId);
  const idInfo=ID_TYPES.find(t=>t.value===idType)||ID_TYPES[0];

  const handleIdUpload=async(files)=>{if(!files.length)return;const file=files[0];const mt=getMediaType(file);
    if(!mt.startsWith("image/")&&mt!=="application/pdf"){setIdStatus("Upload an image or PDF");return;}
    setIdExtracting(true);setIdStatus("🔍 Reading document...");
    try{const b64=await readBase64(file);
      const block=mt==="application/pdf"?{type:"document",source:{type:"base64",media_type:mt,data:b64}}:{type:"image",source:{type:"base64",media_type:mt,data:b64}};
      const text=await callClaude(block,`Extract the ID number and full name from this ${idInfo.docHint}. This could be a Jordanian national ID, passport, UNHCR refugee document, military ID, residency permit, or driving license. Identify the document type. Respond ONLY JSON: {"id_number":"the ID/passport/document number","name":"full name in English or transliterated","doc_type":"national|passport|unhcr|military|iqama|other"}`);
      const r=JSON.parse(text);
      if(r.id_number){setNid(r.id_number);if(r.doc_type&&ID_TYPES.some(t=>t.value===r.doc_type))setIdType(r.doc_type);}
      if(r.name)setReg(f=>({...f,name:r.name}));
      setIdStatus("✅ "+[r.name,r.id_number,r.doc_type?"("+r.doc_type+")":""].filter(Boolean).join(" — "));
    }catch(e){setIdStatus("⚠ Could not read document");}setIdExtracting(false);};

  const handleLogin=()=>{setError("");
    if(role==="patient"){const p=patients.find(x=>x.nationalId===nid);if(p)onLogin("patient",p);else if(nid)setStep("register");else setError("Enter your ID number");}
    else if(role==="company")onLogin("company",{company:compSel});
    else if(role==="pharmacy")onLogin("pharmacy",{});
    else onLogin("authority",{});};
  const handleRegister=()=>{if(!regForm.name||!regForm.doctor||!regForm.dose||!regForm.frequency){setError("Fill all required fields");return;}
    const p={nationalId:nid,idType,papId:genPAPId(),name:regForm.name,doctor:regForm.doctor,reason:regForm.reason,drugId:regForm.drugId,dose:regForm.dose,frequency:regForm.frequency,location:regForm.location,registeredDate:new Date().toISOString().split("T")[0],discount:Math.floor(Math.random()*30)+40,reports:[]};
    onRegister(p);onLogin("patient",p);};

  return(<div className="landing"><div className="landing-card fade-in">
    <div className="jordan-badge">💊 PAP Jordan</div><h1>PAP Jordan</h1><p className="subtitle">Patient Access Program — Improving access to essential medications</p>
    {step==="role"&&(<><div className="role-grid">
      {[{id:"patient",icon:"user",label:"Patient",desc:"Register & track"},{id:"company",icon:"building",label:"Company",desc:"PAP dashboard"},{id:"pharmacy",icon:"rx",label:"Pharmacy",desc:"Verify & dispense"},{id:"authority",icon:"shield",label:"JFDA",desc:"Oversight"}].map(r=>(
        <button key={r.id} className={`role-btn ${role===r.id?"active":""}`} onClick={()=>setRole(r.id)}><Icon type={r.icon} size={22}/><span>{r.label}</span><small>{r.desc}</small></button>))}
    </div><button className="btn btn-primary btn-full" onClick={()=>setStep("login")}>Continue <Icon type="arrow" size={16}/></button></>)}

    {step==="login"&&(<><button className="btn btn-outline btn-sm" onClick={()=>setStep("role")} style={{marginBottom:14}}><Icon type="back" size={14}/> Back</button>
      {error&&<p style={{color:"var(--accent)",fontSize:12,marginBottom:8}}>{error}</p>}
      {role==="patient"?(<>
        <div className="input-group"><label>Upload ID Document (auto-extract)</label>
          <input type="file" ref={fileRef} onChange={e=>handleIdUpload(e.target.files)} accept="image/*,.pdf" style={{display:"none"}}/>
          <div className="file-drop" onClick={()=>fileRef.current?.click()} style={{padding:12,marginBottom:6,borderColor:idExtracting?"var(--amber)":"var(--border)"}}>
            {idExtracting?<><div style={{display:"inline-block",width:18,height:18,border:"2px solid var(--amber)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/><p style={{fontSize:11,marginTop:4}}>Reading...</p></>
            :<><Icon type="id" size={22}/><p style={{fontSize:11,marginTop:4}}>Upload: National ID, Passport, UNHCR card, Military ID, or Residency Permit</p></>}</div>
          {idStatus&&<p style={{fontSize:10,color:idStatus.startsWith("✅")?"var(--primary)":"var(--amber)",marginBottom:4}}>{idStatus}</p>}</div>
        <div className="input-group"><label>ID Type</label>
          <select value={idType} onChange={e=>setIdType(e.target.value)} style={idType!=="national"?{borderColor:"var(--blue)",background:"var(--blue-light)"}:{}}>
            {ID_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
        <div className="input-group"><label>{idInfo.label}</label><input placeholder={idInfo.placeholder} value={nid} onChange={e=>setNid(e.target.value)} style={nid?{borderColor:"var(--primary)",background:"var(--primary-light)"}:{}}/></div>
        <button className="btn btn-primary btn-full" onClick={handleLogin}>Access My Account</button>
        <p style={{fontSize:10,color:"var(--text2)",marginTop:8,textAlign:"center"}}>New patients directed to registration</p>
      </>):role==="company"?(<>
        <div className="input-group"><label>Company</label><select value={compSel} onChange={e=>setCompSel(e.target.value)}>{COMPANIES.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="input-group"><label>Access Code</label><input type="password" placeholder="Company code"/></div>
        <button className="btn btn-primary btn-full" onClick={handleLogin}>Login</button>
      </>):role==="pharmacy"?(<>
        <div className="input-group"><label>Pharmacy License</label><input placeholder="License number"/></div>
        <div className="input-group"><label>Pharmacy Name</label><input placeholder="e.g. Al-Safa Pharmacy"/></div>
        <button className="btn btn-primary btn-full" onClick={handleLogin}>Access Portal</button>
      </>):(<>
        <div className="input-group"><label>JFDA Credentials</label><input placeholder="Admin ID"/></div>
        <button className="btn btn-primary btn-full" onClick={handleLogin}>Access JFDA Portal</button>
      </>)}
    </>)}

    {step==="register"&&(<><button className="btn btn-outline btn-sm" onClick={()=>setStep("login")} style={{marginBottom:12}}><Icon type="back" size={14}/> Back</button>
      <p style={{fontSize:12,color:"var(--primary)",fontWeight:600,marginBottom:10}}>New patient — {idInfo.label}: {nid}</p>
      {error&&<p style={{color:"var(--accent)",fontSize:12,marginBottom:8}}>{error}</p>}
      <div className="input-group"><label>Full Name *</label><input value={regForm.name} onChange={e=>setReg({...regForm,name:e.target.value})} style={regForm.name?{borderColor:"var(--primary)",background:"var(--primary-light)"}:{}}/></div>
      <div className="input-group"><label>Prescribing Doctor *</label><input value={regForm.doctor} onChange={e=>setReg({...regForm,doctor:e.target.value})}/></div>
      <div className="input-group"><label>Reason for Treatment</label><textarea rows={2} value={regForm.reason} onChange={e=>setReg({...regForm,reason:e.target.value})}/></div>
      <div className="input-group"><label>Search Medication (JFDA)</label>
        <input placeholder="Trade name, ingredient, company..." value={regForm.drugSearch} onChange={e=>setReg({...regForm,drugSearch:e.target.value})} style={{marginBottom:4}}/>
        <select value={regForm.drugId} onChange={e=>setReg({...regForm,drugId:e.target.value})}>
          {(()=>{const q=(regForm.drugSearch||"").toLowerCase();const fl=q?DRUGS_DB.filter(d=>d.tradeName.toLowerCase().includes(q)||d.activeIngredient.toLowerCase().includes(q)||d.company.toLowerCase().includes(q)||d.category.toLowerCase().includes(q)):DRUGS_DB;
            const gr={};fl.forEach(d=>{if(!gr[d.category])gr[d.category]=[];gr[d.category].push(d);});
            return Object.entries(gr).map(([c,ds])=>(<optgroup key={c} label={"── "+c+" ──"}>{ds.map(d=><option key={d.id} value={d.id}>{d.tradeName} ({d.activeIngredient}) — {d.company} [{d.regType}]</option>)}</optgroup>));})()}
        </select></div>
      {drug&&<div style={{fontSize:10,color:"var(--text2)",marginBottom:8,padding:"6px 10px",background:"var(--primary-light)",borderRadius:6}}>
        <strong style={{color:"var(--primary)"}}>{drug.tradeName}</strong> — {drug.manufacturer} ({drug.mfrCountry}) — {drug.localAgent}</div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div className="input-group"><label>Dose *</label><input placeholder="e.g. 40mg" value={regForm.dose} onChange={e=>setReg({...regForm,dose:e.target.value})}/></div>
        <div className="input-group"><label>Frequency *</label><input placeholder="e.g. Once daily" value={regForm.frequency} onChange={e=>setReg({...regForm,frequency:e.target.value})}/></div></div>
      <div className="input-group"><label>Location</label><select value={regForm.location} onChange={e=>setReg({...regForm,location:e.target.value})}>{LOCATIONS_JO.map(l=><option key={l}>{l}</option>)}</select></div>
      <button className="btn btn-primary btn-full" onClick={handleRegister}>Register & Enter</button>
    </>)}
  </div></div>);
}

// ===== PATIENT PORTAL =====
function PatientPortal({user,patients,setPatients,subView,setSubView,onLogout}){
  const patient=patients.find(p=>p.nationalId===user.nationalId)||user;const drug=DRUGS_DB.find(d=>d.id===patient.drugId);
  const[reportForm,setReportForm]=useState({});const[reportNotes,setReportNotes]=useState("");const[showOK,setShowOK]=useState(false);
  const[files,setFiles]=useState([]);const[extracting,setExtracting]=useState(false);const[exStatus,setExStatus]=useState("");const[dragOver,setDragOver]=useState(false);
  const fRef=useRef(null);

  const extract=async(file,b64)=>{const mt=getMediaType(file);if(!mt.startsWith("image/")&&mt!=="application/pdf")return;
    setExtracting(true);setExStatus("🔍 Analyzing...");
    try{const bl=mt==="application/pdf"?{type:"document",source:{type:"base64",media_type:mt,data:b64}}:{type:"image",source:{type:"base64",media_type:mt,data:b64}};
      const ps=drug?.followUp.map(f=>f.param).join(", ")||"";
      const t=await callClaude(bl,`Extract clinical values from this lab report. Patient takes ${drug?.tradeName} (${drug?.activeIngredient}). Needed: ${ps}. ONLY JSON: {"extracted_params":{"Param":"value"},"side_effects":"or None","notes":"obs","confidence":"high/med/low"}`);
      const r=JSON.parse(t);const nf={...reportForm};let c=0;
      if(r.extracted_params)for(const[k,v]of Object.entries(r.extracted_params)){const m=drug?.followUp.find(f=>f.param===k)||drug?.followUp.find(f=>k.toLowerCase().includes(f.param.toLowerCase().split(" ")[0]));if(m){nf[m.param]=String(v);c++;}}
      setReportForm(nf);let n=reportNotes;if(r.side_effects&&r.side_effects!=="None")n+=(n?"\n":"")+r.side_effects;if(r.notes&&r.notes!=="None")n+=(n?"\n":"")+r.notes;setReportNotes(n);
      setExStatus(`✅ ${c} params extracted (${r.confidence||"med"})`);
    }catch(e){setExStatus("⚠ Enter values manually");}setExtracting(false);};
  const handleFiles=async(fl)=>{for(const f of Array.from(fl)){try{const b=await readBase64(f);const mt=getMediaType(f);setFiles(p=>[...p,{name:f.name,preview:mt.startsWith("image/")?`data:${mt};base64,${b}`:null}]);await extract(f,b);}catch(e){}}};
  const submit=()=>{const nr={date:new Date().toISOString().split("T")[0],params:{...reportForm},notes:reportNotes,files:files.map(f=>({name:f.name}))};
    setPatients(patients.map(p=>p.nationalId===patient.nationalId?{...p,reports:[...p.reports,nr]}:p));
    setReportForm({});setReportNotes("");setFiles([]);setExStatus("");setShowOK(true);setTimeout(()=>{setShowOK(false);setSubView("dashboard");},1500);};

  return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">PAP Jordan<small>Patient Portal</small></div>
    {["dashboard","report","history"].map(v=>(<div key={v} className={`nav-item ${subView===v?"active":""}`} onClick={()=>setSubView(v)}><Icon type={v==="dashboard"?"home":v==="report"?"upload":"file"} size={18}/>{v==="dashboard"?"Dashboard":v==="report"?"Submit Report":"History & Trends"}</div>))}
    <div className="sidebar-footer"><div style={{fontSize:10,opacity:.6,marginBottom:4}}>{patient.name}</div><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Sign Out</div></div></div>
    <div className="main fade-in">
      {subView==="dashboard"&&(<>
        <div className="pap-id-card"><h3>PAP Confirmation ID</h3><div className="id-number">{patient.papId||"N/A"}</div>
          <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,flexWrap:"wrap"}}><div><span style={{opacity:.7}}>Name</span><div style={{fontWeight:600}}>{patient.name}</div></div><div><span style={{opacity:.7}}>{(ID_TYPES.find(t=>t.value===patient.idType)||ID_TYPES[0]).label}</span><div style={{fontWeight:600}}>{patient.nationalId}</div></div></div></div>
        <div className="stat-grid">
          <div className="stat-card"><div className="label">Medication</div><div className="value" style={{fontSize:17}}>{drug?.tradeName}</div><div className="sub">{drug?.activeIngredient} — {patient.dose}</div></div>
          <div className="stat-card"><div className="label">Discount</div><div className="value" style={{color:"var(--primary)"}}>{patient.discount}%</div><div className="sub">PAP by {drug?.company}</div></div>
          <div className="stat-card"><div className="label">Reports</div><div className="value">{patient.reports.length}</div></div>
          <div className="stat-card"><div className="label">Doctor</div><div className="value" style={{fontSize:13}}>{patient.doctor}</div><div className="sub">{patient.reason}</div></div></div>
        <div className="card"><h3 style={{fontSize:14,marginBottom:8}}>Follow-Up Parameters</h3>
          <table><thead><tr><th>Parameter</th><th>Frequency</th><th>Last Value</th></tr></thead>
          <tbody>{drug?.followUp.map((f,i)=>{const lr=[...patient.reports].reverse().find(r=>r.params[f.param]);
            return(<tr key={i}><td style={{fontWeight:500}}>{f.param}</td><td><span className="badge badge-blue">{f.freq}</span></td>
              <td>{lr?<><span style={{fontWeight:600}}>{lr.params[f.param]}</span> <span style={{fontSize:9,color:"var(--text2)"}}>({lr.date})</span></>:<span className="badge badge-amber">Pending</span>}</td></tr>);})}</tbody></table></div>
        <TrendCharts reports={patient.reports} followUp={drug?.followUp}/></>)}

      {subView==="report"&&(<>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:16}}>Submit Report — {drug?.tradeName}</h2>
        {showOK?<div className="card" style={{textAlign:"center",padding:36}}><Icon type="check" size={40}/><h3 style={{marginTop:6,color:"var(--primary)"}}>Submitted!</h3></div>:(<>
          <div className="card" style={{marginBottom:14}}><h3 style={{fontSize:13,marginBottom:10}}>📄 Upload Lab Results</h3>
            <input type="file" ref={fRef} onChange={e=>{if(e.target.files.length)handleFiles(e.target.files);}} accept=".pdf,.png,.jpg,.jpeg,.tiff,.gif" multiple style={{display:"none"}}/>
            <div className="file-drop" onClick={()=>fRef.current?.click()} onDrop={e=>{e.preventDefault();setDragOver(false);handleFiles(e.dataTransfer.files);}} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
              style={{padding:14,borderColor:dragOver?"var(--primary)":extracting?"var(--amber)":"var(--border)",background:dragOver?"var(--primary-light)":extracting?"var(--amber-light)":"transparent"}}>
              {extracting?<><div style={{display:"inline-block",width:20,height:20,border:"2px solid var(--amber)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/><p style={{fontSize:11,marginTop:4}}>Analyzing...</p></>
              :<><Icon type="upload" size={26}/><p style={{fontSize:12,marginTop:4}}>Drop files or click — PDF/Image</p></>}</div>
            {files.map((f,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:4,background:"var(--surface2)",borderRadius:4,marginTop:4,fontSize:11}}>
              {f.preview?<img src={f.preview} style={{width:28,height:28,objectFit:"cover",borderRadius:3}}/>:<Icon type="file" size={16}/>}<span style={{flex:1}}>{f.name}</span><span className="badge badge-green">OK</span></div>))}
            {exStatus&&<p style={{fontSize:10,marginTop:6,padding:"4px 8px",borderRadius:4,background:exStatus.startsWith("✅")?"var(--primary-light)":"var(--amber-light)",color:exStatus.startsWith("✅")?"var(--primary)":"var(--amber)"}}>{exStatus}</p>}</div>
          <div className="card"><h3 style={{fontSize:13,marginBottom:8}}>Parameters</h3>
            <div className="param-grid">{drug?.followUp.map((f,i)=>(<div className="input-group" key={i}><label style={{display:"flex",gap:4}}>{f.param}{reportForm[f.param]&&<span style={{background:"var(--primary-light)",color:"var(--primary)",fontSize:8,padding:"0 4px",borderRadius:6}}>AI</span>}</label>
              <input placeholder={f.param} value={reportForm[f.param]||""} onChange={e=>setReportForm({...reportForm,[f.param]:e.target.value})} style={reportForm[f.param]?{borderColor:"var(--primary)",background:"var(--primary-light)"}:{}}/></div>))}</div>
            <div className="input-group" style={{marginTop:4}}><label>Notes / Side Effects</label><textarea rows={2} value={reportNotes} onChange={e=>setReportNotes(e.target.value)}/></div>
            <div style={{display:"flex",gap:8,marginTop:6}}><button className="btn btn-primary" onClick={submit} disabled={extracting}><Icon type="check" size={16}/> Submit</button>
              {Object.keys(reportForm).length>0&&<button className="btn btn-outline" onClick={()=>{setReportForm({});setReportNotes("");setExStatus("");}}>Clear</button>}</div></div></>)}</>)}

      {subView==="history"&&(<>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:4}}>History & Trends</h2>
        <TrendCharts reports={patient.reports} followUp={drug?.followUp}/>
        {patient.reports.length===0?<div className="card" style={{textAlign:"center",padding:24,color:"var(--text2)",marginTop:14}}><Icon type="file" size={24}/><p style={{marginTop:4}}>No reports yet</p></div>
        :<div className="card" style={{marginTop:14}}><table><thead><tr><th>Date</th>{drug?.followUp.map((f,i)=><th key={i} style={{fontSize:8}}>{f.param.replace(/\s*\([^)]*\)/g,"")}</th>)}<th>Notes</th></tr></thead>
          <tbody>{[...patient.reports].reverse().map((r,i)=>(<tr key={i}><td style={{fontWeight:500,fontSize:11}}>{r.date}</td>{drug?.followUp.map((f,j)=><td key={j} style={{fontSize:11}}>{r.params[f.param]||"—"}</td>)}<td style={{fontSize:10,color:"var(--text2)"}}>{r.notes||"—"}</td></tr>))}</tbody></table></div>}</>)}
    </div></div>);
}

// ===== COMPANY PORTAL =====
function CompanyPortal({company,patients,drugPrices,setDrugPrices,subView,setSubView,selectedProject,setSelectedProject,selectedPatient,setSelectedPatient,onLogout}){
  const cDrugs=DRUGS_DB.filter(d=>d.company===company);const cPats=patients.filter(p=>cDrugs.some(d=>d.id===p.drugId));

  if(selectedPatient){const pat=cPats.find(p=>p.nationalId===selectedPatient);const drug=DRUGS_DB.find(d=>d.id===pat?.drugId);
    return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">{company}<small>PAP Jordan</small></div><div className="nav-item active"><Icon type="home" size={18}/> Projects</div><div className="sidebar-footer"><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Out</div></div></div>
      <div className="main fade-in"><button className="btn btn-outline btn-sm" onClick={()=>setSelectedPatient(null)} style={{marginBottom:12}}><Icon type="back" size={14}/> Back</button>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>{pat?.name}</h2>
        <p style={{color:"var(--text2)",fontSize:11,marginBottom:14}}>PAP: {pat?.papId} — {drug?.tradeName} {pat?.dose} — {pat?.doctor}</p>
        <div className="stat-grid"><div className="stat-card"><div className="label">Reports</div><div className="value">{pat?.reports.length}</div></div>
          <div className="stat-card"><div className="label">Discount</div><div className="value">{pat?.discount}%</div></div>
          <div className="stat-card"><div className="label">Enrolled</div><div className="value" style={{fontSize:13}}>{pat?.registeredDate}</div></div>
          {drugPrices[drug?.id]>0&&<div className="stat-card"><div className="label">Savings/Unit</div><div className="value" style={{fontSize:13,color:"var(--primary)"}}>{(drugPrices[drug.id]*pat?.discount/100).toFixed(2)} JOD</div></div>}</div>
        <div className="card"><h3 style={{fontSize:13,marginBottom:8}}>Outcomes</h3>{!pat?.reports.length?<p style={{color:"var(--text2)",fontSize:11}}>No reports</p>:
          <div className="table-wrap"><table><thead><tr><th>Date</th>{drug?.followUp.map((f,i)=><th key={i} style={{fontSize:8}}>{f.param.replace(/\s*\([^)]*\)/g,"")}</th>)}<th>Notes</th></tr></thead>
          <tbody>{pat?.reports.map((r,i)=>(<tr key={i}><td style={{fontSize:10}}>{r.date}</td>{drug?.followUp.map((f,j)=><td key={j} style={{fontSize:10}}>{r.params[f.param]||"—"}</td>)}<td style={{fontSize:9}}>{r.notes||"—"}</td></tr>))}</tbody></table></div>}</div>
        <TrendCharts reports={pat?.reports||[]} followUp={drug?.followUp}/></div></div>);}

  if(selectedProject){const drug=DRUGS_DB.find(d=>d.id===selectedProject);const pp=patients.filter(p=>p.drugId===selectedProject);const locs={};pp.forEach(p=>{locs[p.location]=(locs[p.location]||0)+1;});const price=drugPrices[drug?.id];
    return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">{company}<small>PAP Jordan</small></div><div className="nav-item active"><Icon type="home" size={18}/> Projects</div><div className="sidebar-footer"><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Out</div></div></div>
      <div className="main fade-in"><button className="btn btn-outline btn-sm" onClick={()=>setSelectedProject(null)} style={{marginBottom:12}}><Icon type="back" size={14}/> All</button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:18}}>PAP: {drug?.tradeName}</h2><span className="badge badge-green">{drug?.category}</span></div>
        <div className="card" style={{marginBottom:14,background:"var(--blue-light)",padding:12}}>
          <h4 style={{fontSize:12,marginBottom:6}}><Icon type="dollar" size={16}/> Pricing Calculator</h4>
          <div style={{display:"flex",gap:10,alignItems:"end",flexWrap:"wrap"}}>
            <div className="input-group" style={{margin:0,flex:"1 1 160px"}}><label>Listed Price (JOD)</label>
              <input type="number" step="0.01" placeholder="Enter price" value={price||""} onChange={e=>{const v=parseFloat(e.target.value);setDrugPrices({...drugPrices,[drug.id]:isNaN(v)?null:v});}}/></div>
            {price>0&&<div style={{display:"flex",gap:14,fontSize:12,padding:"6px 0"}}>
              <div><div style={{fontSize:9,color:"var(--text2)"}}>Avg Discount</div><div style={{fontWeight:700,fontSize:16}}>{pp.length?Math.round(pp.reduce((s,p)=>s+p.discount,0)/pp.length):0}%</div></div>
              <div><div style={{fontSize:9,color:"var(--text2)"}}>Patient Pays</div><div style={{fontWeight:700,fontSize:16,color:"var(--primary)"}}>{(price*(1-(pp.length?pp.reduce((s,p)=>s+p.discount,0)/pp.length/100:0))).toFixed(2)}</div></div>
              <div><div style={{fontSize:9,color:"var(--text2)"}}>Total Given</div><div style={{fontWeight:700,fontSize:16,color:"var(--accent)"}}>{pp.reduce((s,p)=>s+price*p.discount/100,0).toFixed(2)}</div></div></div>}</div></div>
        <div className="stat-grid"><div className="stat-card"><div className="label">Patients</div><div className="value">{pp.length}</div></div><div className="stat-card"><div className="label">Reports</div><div className="value">{pp.reduce((s,p)=>s+p.reports.length,0)}</div></div><div className="stat-card"><div className="label">Locations</div><div className="value">{Object.keys(locs).length}</div></div></div>
        <div className="card"><h3 style={{fontSize:13,marginBottom:8}}>Patients</h3>
          <div className="table-wrap"><table><thead><tr><th>PAP ID</th><th>Name</th><th>Dose</th><th>Location</th><th>Discount</th>{price>0&&<th>Saved</th>}<th>Reports</th><th></th></tr></thead>
          <tbody>{pp.map(p=>(<tr key={p.nationalId}><td style={{fontFamily:"monospace",fontSize:10}}>{p.papId}</td><td style={{fontWeight:500}}>{p.name}</td><td>{p.dose}</td><td>{p.location}</td><td><span className="badge badge-green">{p.discount}%</span></td>
            {price>0&&<td style={{color:"var(--primary)",fontWeight:600}}>{(price*p.discount/100).toFixed(2)}</td>}<td>{p.reports.length}</td><td><button className="btn btn-outline btn-sm" onClick={()=>setSelectedPatient(p.nationalId)}>View</button></td></tr>))}</tbody></table></div></div></div></div>);}

  return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">{company}<small>PAP Jordan</small></div><div className="nav-item active"><Icon type="home" size={18}/> Projects</div>
    <div className="sidebar-footer"><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Sign Out</div></div></div>
    <div className="main fade-in"><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:16}}>{company} — PAP Jordan</h2>
      <div className="stat-grid"><div className="stat-card"><div className="label">Projects</div><div className="value">{cDrugs.length}</div></div><div className="stat-card"><div className="label">Patients</div><div className="value">{cPats.length}</div></div><div className="stat-card"><div className="label">Reports</div><div className="value">{cPats.reduce((s,p)=>s+p.reports.length,0)}</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {cDrugs.map(d=>{const dp=patients.filter(p=>p.drugId===d.id);const pr=drugPrices[d.id];
          return(<div className="card" key={d.id} style={{cursor:"pointer"}} onClick={()=>setSelectedProject(d.id)}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div><h4 style={{fontSize:14}}>{d.tradeName}</h4><p style={{fontSize:10,color:"var(--text2)"}}>{d.activeIngredient}</p></div><span className="badge badge-blue">{d.category}</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}><div><span style={{fontSize:9,color:"var(--text2)"}}>Patients</span><div style={{fontSize:18,fontWeight:700}}>{dp.length}</div></div><div><span style={{fontSize:9,color:"var(--text2)"}}>Reports</span><div style={{fontSize:18,fontWeight:700}}>{dp.reduce((s,p)=>s+p.reports.length,0)}</div></div></div>
            {pr>0&&<div style={{fontSize:10,color:"var(--text2)",marginTop:6}}>Price: {pr} JOD — Total discount: {dp.reduce((s,p)=>s+pr*p.discount/100,0).toFixed(2)} JOD</div>}
            <div style={{marginTop:8,fontSize:10,color:"var(--primary)",fontWeight:600}}>View →</div></div>);})}</div></div></div>);
}

// ===== AUTHORITY =====
function AuthorityPortal({patients,subView,setSubView,onLogout}){
  const tot=patients.length;const cs=COMPANIES.map(c=>{const ds=DRUGS_DB.filter(d=>d.company===c);const ps=patients.filter(p=>ds.some(d=>d.id===p.drugId));return{company:c,projects:ds.length,patients:ps.length,reports:ps.reduce((s,p)=>s+p.reports.length,0)};});
  const locs={};patients.forEach(p=>{locs[p.location]=(locs[p.location]||0)+1;});
  return(<div className="layout"><div className="sidebar"><div className="sidebar-brand">JFDA<small>Authority</small></div>
    {[{id:"dashboard",icon:"home",label:"Overview"},{id:"drugs",icon:"pill",label:"Registry"},{id:"compliance",icon:"shield",label:"Compliance"}].map(v=>(<div key={v.id} className={`nav-item ${subView===v.id?"active":""}`} onClick={()=>setSubView(v.id)}><Icon type={v.icon} size={18}/> {v.label}</div>))}
    <div className="sidebar-footer"><div className="nav-item" onClick={onLogout}><Icon type="logout" size={18}/> Out</div></div></div>
    <div className="main fade-in"><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,marginBottom:16}}>JFDA — PAP Jordan Oversight</h2>
      <div className="stat-grid"><div className="stat-card"><div className="label">Drugs</div><div className="value">{DRUGS_DB.length}</div></div><div className="stat-card"><div className="label">Companies</div><div className="value">{COMPANIES.length}</div></div><div className="stat-card"><div className="label">Patients</div><div className="value">{tot}</div></div><div className="stat-card"><div className="label">Reports</div><div className="value">{patients.reduce((s,p)=>s+p.reports.length,0)}</div></div></div>
      {subView==="dashboard"&&(<><div className="card" style={{marginBottom:14}}><h3 style={{fontSize:13,marginBottom:8}}>Companies</h3>
        <table><thead><tr><th>Company</th><th>Projects</th><th>Patients</th><th>Reports</th><th>Status</th></tr></thead>
        <tbody>{cs.map(c=>(<tr key={c.company}><td style={{fontWeight:600}}>{c.company}</td><td>{c.projects}</td><td>{c.patients}</td><td>{c.reports}</td><td>{c.reports>=c.patients?<span className="badge badge-green">Good</span>:<span className="badge badge-amber">Review</span>}</td></tr>))}</tbody></table></div>
        <div className="card"><h3 style={{fontSize:13,marginBottom:8}}>Locations</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:8}}>{Object.entries(locs).sort((a,b)=>b[1]-a[1]).map(([l,c])=>(<div key={l} style={{background:"var(--primary-light)",padding:8,borderRadius:6,textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,color:"var(--primary)"}}>{c}</div><div style={{fontSize:10}}>{l}</div></div>))}</div></div></>)}
      {subView==="drugs"&&<div className="card"><h3 style={{fontSize:13,marginBottom:8}}>JFDA Registry ({DRUGS_DB.length})</h3><div className="table-wrap"><table><thead><tr><th>Trade</th><th>Ingredient</th><th>Company</th><th>Agent</th><th>Origin</th><th>Type</th><th>Category</th><th>Pts</th></tr></thead>
        <tbody>{DRUGS_DB.map(d=>(<tr key={d.id}><td style={{fontWeight:600}}>{d.tradeName}</td><td>{d.activeIngredient}</td><td>{d.company}</td><td style={{fontSize:10}}>{d.localAgent}</td><td style={{fontSize:10}}>{d.mfrCountry}</td><td><span className={`badge ${d.regType==="Originator"?"badge-green":"badge-amber"}`}>{d.regType}</span></td><td><span className="badge badge-blue">{d.category}</span></td><td>{patients.filter(p=>p.drugId===d.id).length}</td></tr>))}</tbody></table></div></div>}
      {subView==="compliance"&&(<><div className="card" style={{marginBottom:14}}><h3 style={{fontSize:13,marginBottom:8}}>Anti-Abuse</h3><table><thead><tr><th>Location</th><th>Pts</th><th>%</th><th>Status</th></tr></thead>
        <tbody>{Object.entries(locs).sort((a,b)=>b[1]-a[1]).map(([l,c])=>(<tr key={l}><td><Icon type="map" size={12}/> {l}</td><td style={{fontWeight:600}}>{c}</td><td>{Math.round(c/tot*100)}%</td><td><span className="badge badge-green">Jordan ✓</span></td></tr>))}</tbody></table></div>
        <div className="card"><h3 style={{fontSize:13,marginBottom:8}}>Non-Compliant</h3><table><thead><tr><th>Patient</th><th>PAP ID</th><th>Drug</th><th>Company</th><th>Status</th></tr></thead>
        <tbody>{patients.filter(p=>!p.reports.length).map(p=>{const d=DRUGS_DB.find(x=>x.id===p.drugId);return(<tr key={p.nationalId}><td>{p.name}</td><td style={{fontFamily:"monospace",fontSize:10}}>{p.papId}</td><td>{d?.tradeName}</td><td>{d?.company}</td><td><span className="badge badge-red">No reports</span></td></tr>);})}
        {patients.every(p=>p.reports.length>0)&&<tr><td colSpan={5} style={{textAlign:"center",color:"var(--primary)"}}>All compliant ✓</td></tr>}</tbody></table></div></>)}
    </div></div>);
}

// ===== APP =====
export default function App(){
  const[view,setView]=useState("landing");const[user,setUser]=useState(null);const[patients,setPatients]=useState(INIT_PATIENTS);
  const[subView,setSubView]=useState("dashboard");const[selProj,setSelProj]=useState(null);const[selPat,setSelPat]=useState(null);
  const[selComp,setSelComp]=useState(COMPANIES[0]);const[drugPrices,setDrugPrices]=useState({});const[loaded,setLoaded]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("pap-data");if(r?.value){const d=JSON.parse(r.value);if(d.patients?.length)setPatients(d.patients);if(d.prices)setDrugPrices(d.prices);}}catch(e){}setLoaded(true);})();},[]);
  useEffect(()=>{if(!loaded)return;(async()=>{try{await window.storage.set("pap-data",JSON.stringify({patients,prices:drugPrices}));}catch(e){}})();},[patients,drugPrices,loaded]);

  const login=(r,d)=>{setUser(d);setView(r);setSubView("dashboard");setSelProj(null);setSelPat(null);if(r==="company")setSelComp(d.company);};
  const out=()=>{setView("landing");setUser(null);};
  return(<><style>{CSS}</style><div>
    {view==="landing"&&<Landing patients={patients} onLogin={login} onRegister={p=>setPatients([...patients,p])}/>}
    {view==="patient"&&<PatientPortal user={user} patients={patients} setPatients={setPatients} subView={subView} setSubView={setSubView} onLogout={out}/>}
    {view==="company"&&<CompanyPortal company={selComp} patients={patients} drugPrices={drugPrices} setDrugPrices={setDrugPrices} subView={subView} setSubView={setSubView} selectedProject={selProj} setSelectedProject={setSelProj} selectedPatient={selPat} setSelectedPatient={setSelPat} onLogout={out}/>}
    {view==="pharmacy"&&<PharmacyPortal patients={patients} onLogout={out}/>}
    {view==="authority"&&<AuthorityPortal patients={patients} subView={subView} setSubView={setSubView} onLogout={out}/>}
  </div></>);
}
