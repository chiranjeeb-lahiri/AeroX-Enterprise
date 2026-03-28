import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Luggage, ShieldAlert, Download, Plane } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function WebCheckIn({ booking, onClose }) {
  const [step, setStep] = useState('declaration'); 
  const [accepted, setAccepted] = useState(false);

  const boardingTime = "05:45 AM"; 
  const gate = ["A12", "B4", "C22", "D1"][Math.floor(Math.random() * 4)];
  const simulatedSeat = booking?.seat || "12A"; 

  const qrData = JSON.stringify({
    pnr: booking?.bookingId || "UNKNOWN",
    name: booking?.passengerDetails?.name || "PASSENGER",
    flight: booking?.airline || "AEROX",
    date: booking?.date || "TODAY",
    status: "BOARDING_VALID"
  });

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/80 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full relative overflow-hidden my-10 border-4 border-slate-100"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-50 bg-slate-100 p-2 rounded-full transition hover:rotate-90"><X className="w-6 h-6"/></button>

        {step === 'declaration' && (
          <div className="p-12 text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Web Check-In</h2>
            <p className="text-slate-500 font-bold mb-10 tracking-widest uppercase text-sm">PNR: {booking?.bookingId || "PENDING"}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                <Luggage className="w-10 h-10 text-orange-500 mb-4"/>
                <h3 className="font-black text-xl text-slate-900 mb-2">Baggage Rules</h3>
                <p className="text-sm font-medium text-slate-600">Cabin baggage is restricted to 1 piece (up to 7kg). Laptops must be in hand luggage.</p>
              </div>
              <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                <ShieldAlert className="w-10 h-10 text-blue-600 mb-4"/>
                <h3 className="font-black text-xl text-slate-900 mb-2">Prohibited Items</h3>
                <p className="text-sm font-medium text-slate-600">Ensure you are not carrying any flammable liquids or sharp objects.</p>
              </div>
            </div>

            <label className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl cursor-pointer border border-slate-200 hover:border-blue-400 transition text-left">
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="w-6 h-6 rounded mt-1 cursor-pointer" />
              <div>
                <p className="font-black text-slate-900">I acknowledge and accept the security guidelines.</p>
                <p className="text-xs text-slate-500 font-bold mt-1">By proceeding, you confirm your baggage complies with regulations.</p>
              </div>
            </label>

            <div className="mt-10 text-right">
              <button disabled={!accepted} onClick={() => setStep('boardingPass')} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition disabled:opacity-50 cursor-pointer shadow-xl">Generate Boarding Pass</button>
            </div>
          </div>
        )}

        {step === 'boardingPass' && (
          <div className="p-8 md:p-16 bg-slate-50 flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-widest uppercase flex items-center gap-3"><CheckCircle2 className="text-green-500 w-8 h-8"/> Check-In Successful</h2>
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-200 text-left">
              <div className="bg-slate-900 text-white p-8 relative">
                <div className="flex justify-between items-center mb-6"><span className="font-black tracking-widest uppercase text-blue-400">{booking?.airline || "AEROX"}</span><Plane className="w-6 h-6 text-slate-500"/></div>
                <div className="flex justify-between items-end">
                  <div><p className="text-5xl font-black">{(booking?.source || "SRC").substring(0,3).toUpperCase()}</p><p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{(booking?.source || "Source").split(' ')[0]}</p></div>
                  <div className="pb-2"><Plane className="w-8 h-8 text-orange-500 mx-4" /></div>
                  <div className="text-right"><p className="text-5xl font-black">{(booking?.destination || "DST").substring(0,3).toUpperCase()}</p><p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{(booking?.destination || "Destination").split(' ')[0]}</p></div>
                </div>
              </div>
              <div className="relative h-8 bg-white flex items-center justify-center overflow-hidden"><div className="absolute w-8 h-8 bg-slate-50 rounded-full -left-4"></div><div className="w-full border-t-2 border-dashed border-slate-200"></div><div className="absolute w-8 h-8 bg-slate-50 rounded-full -right-4"></div></div>
              <div className="p-8 bg-white grid grid-cols-3 gap-6">
                <div className="col-span-2"><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Passenger</p><p className="font-black text-sm text-slate-900 uppercase truncate">{booking?.passengerDetails?.name || 'PASSENGER'}</p></div>
                <div><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Date</p><p className="font-black text-sm text-slate-900">{booking?.date || "TBD"}</p></div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100"><p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-1">Gate</p><p className="font-black text-xl text-orange-600">{gate}</p></div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100"><p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Board</p><p className="font-black text-xl text-blue-600">{boardingTime}</p></div>
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200"><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Seat</p><p className="font-black text-xl text-slate-900">{simulatedSeat}</p></div>
              </div>
              <div className="p-8 bg-slate-50 flex flex-col items-center justify-center border-t border-slate-100">
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4"><QRCodeSVG value={qrData} size={140} level="H" /></div>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Scan at Security Gate</p>
              </div>
            </div>
            <button onClick={onClose} className="mt-8 text-slate-500 font-bold hover:text-slate-900 transition flex items-center gap-2 cursor-pointer"><Download className="w-4 h-4"/> Save to Apple Wallet</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}