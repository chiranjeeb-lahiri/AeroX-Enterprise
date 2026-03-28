import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ArrowRight, X, MapPin, User, ShieldCheck, Star, Globe, PhoneCall, ChevronDown, LogOut, Luggage, Utensils, UserPlus, Percent, Filter, CheckCircle2, Armchair, Users, Download, MessageCircle, QrCode, Shield, CreditCard, Map } from 'lucide-react';
import { jsPDF } from "jspdf";
import AuthPage from './AuthPage';
import WebCheckIn from './WebCheckIn'; 

function EnterpriseFooter() {
  return (
    <footer className="bg-white text-slate-900 pt-16 pb-8 border-t border-slate-200 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16 text-left">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 mb-6"><Plane className="w-6 h-6 rotate-45 text-blue-600" /><span className="text-2xl font-black uppercase tracking-tight">AERO<span className="text-orange-500">X</span></span></div>
            <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">Handling millions of bookings daily with 99.9% uptime. Your safety and comfort is our primary flight plan.</p>
            <div className="flex gap-4 font-black tracking-widest text-[10px] text-slate-400"><span className="hover:text-blue-600 cursor-pointer transition">FACEBOOK</span><span className="hover:text-blue-600 cursor-pointer transition">TWITTER</span></div>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Our Products</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500"><li className="hover:text-blue-600 cursor-pointer transition">Domestic Flights</li><li className="hover:text-blue-600 cursor-pointer transition">International Flights</li><li className="hover:text-blue-600 cursor-pointer transition">Hotel Bookings</li><li className="hover:text-blue-600 cursor-pointer transition">Holiday Packages</li></ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500"><li className="hover:text-blue-600 cursor-pointer transition">About Us</li><li className="hover:text-blue-600 cursor-pointer transition">Investor Relations</li><li className="hover:text-blue-600 cursor-pointer transition">Careers</li><li className="hover:text-blue-600 cursor-pointer transition">Mobile App</li></ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-3 text-sm font-bold text-slate-500"><li className="hover:text-blue-600 cursor-pointer transition">Contact Us</li><li className="hover:text-blue-600 cursor-pointer transition">FAQs</li><li className="hover:text-blue-600 cursor-pointer transition">Cancellation Policy</li><li className="hover:text-blue-600 cursor-pointer transition">Refund Status</li></ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
             <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Customer Helpline</h4>
             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3"><PhoneCall className="text-blue-600 w-5 h-5"/><div><p className="text-[10px] font-black uppercase text-slate-400">24/7 Toll Free</p><p className="text-sm font-black text-slate-900">1800-AEROX-BOOK</p></div></div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"><p>© 2026 AeroX Global Travel Solutions Pvt. Ltd.</p><div className="flex gap-6 mt-4 md:mt-0"><span className="hover:text-slate-900 cursor-pointer transition">Terms of Service</span><span className="hover:text-slate-900 cursor-pointer transition">Privacy Policy</span></div></div>
      </div>
    </footer>
  );
}

function MainApp({ activeUser, authToken, isLoggedIn, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState(location.state?.openProfile ? 'profile' : 'search');
  
  const [searchTab, setSearchTab] = useState('flights'); 
  const [tripType, setTripType] = useState('oneway'); 
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(''); 
  const [returnDate, setReturnDate] = useState(''); 
  const [fareType, setFareType] = useState('regular');
  
  const [passengers, setPassengers] = useState(1);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterNonStop, setFilterNonStop] = useState(false);
  
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingStep, setBookingStep] = useState('passenger'); 
  
  const [passengerNames, setPassengerNames] = useState(['']); 
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [addons, setAddons] = useState({ baggage: false, meal: false });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentData, setPaymentData] = useState({ upi: '', cardNum: '', expiry: '', cvv: '' });
  const [isPaying, setIsPaying] = useState(false);
  
  const [myBookings, setMyBookings] = useState([]);
  const [showScarcity, setShowScarcity] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [checkInFlight, setCheckInFlight] = useState(null);

  const airlineLogos = {
    "Air India": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Air_India_Logo.svg",
    "IndiGo": "https://upload.wikimedia.org/wikipedia/commons/6/69/IndiGo_Airlines_logo.svg",
    "Vistara": "https://upload.wikimedia.org/wikipedia/commons/c/c4/Vistara_Logo.svg",
    "Emirates": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
    "British Airways": "https://upload.wikimedia.org/wikipedia/en/9/98/British_Airways_Logo.svg"
  };

  useEffect(() => {
    if (location.state?.openProfile) setView('profile');
    if (isLoggedIn && activeUser && authToken) fetchMyBookings(activeUser);
  }, [location.state, isLoggedIn, activeUser, authToken]);

  useEffect(() => {
    if (showScarcity) {
      const timer = setTimeout(() => setShowScarcity(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showScarcity]);

  useEffect(() => {
    setPassengerNames(Array(passengers).fill(''));
  }, [passengers]);

  const fetchMyBookings = async (email) => {
    try {
      const response = await fetch(`http://localhost:8000/api/bookings?email=${email}`, { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (response.ok) {
        const data = await response.json();
        setMyBookings(data.map(d => ({ bookingId: d.pnr, source: d.source, destination: d.destination, airline: d.airline, date: d.date || d.travel_date, totalPaid: d.total_paid || 0, passengerDetails: { name: d.passenger_name } })));
      }
    } catch (e) { console.error(e); }
  };

  const cancelTicket = async (pnr) => {
    if(window.confirm("Cancel journey?")) {
      await fetch(`http://localhost:8000/api/bookings/${pnr}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${authToken}` } });
      setMyBookings(myBookings.filter(x => x.bookingId !== pnr));
    }
  };

  const downloadTicket = (booking) => {
    if(!booking) return;
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42); doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.text("AEROX", 20, 28);
    doc.setFont("helvetica", "normal"); doc.setFontSize(12); doc.text("E-Ticket & Itinerary Receipt", 130, 28);
    doc.setDrawColor(200, 200, 200); doc.setFillColor(248, 250, 252); doc.roundedRect(20, 60, 170, 40, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42); doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.text("PASSENGER DETAILS", 25, 70);
    doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text(`Passenger Names: ${booking.passengerDetails?.name || activeUser}`, 25, 82); doc.text(`PNR Number: ${booking.bookingId}`, 25, 92);
    doc.setTextColor(22, 163, 74); doc.setFont("helvetica", "bold"); doc.text("STATUS: CONFIRMED", 140, 92);
    doc.setFillColor(248, 250, 252); doc.roundedRect(20, 110, 170, 60, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42); doc.setFontSize(14); doc.text("FLIGHT ITINERARY", 25, 120);
    doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text(`Airline: ${booking.airline}`, 25, 132); doc.text(`Travel Date: ${booking.date}`, 25, 142);
    doc.setFont("helvetica", "bold"); doc.text(`From: ${booking.source}`, 25, 157); doc.text(`To: ${booking.destination}`, 120, 157);
    doc.setFillColor(248, 250, 252); doc.roundedRect(20, 180, 170, 35, 3, 3, 'FD');
    doc.setFontSize(14); doc.text("PAYMENT SUMMARY", 25, 190);
    doc.setFontSize(11); doc.setFont("helvetica", "normal"); doc.text(`Total Fare Paid: INR ${(booking.totalPaid || 0).toLocaleString()}`, 25, 202);
    doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.text("This is a computer generated document. No signature is required.", 105, 275, null, null, "center");
    doc.save(`AeroX_Ticket_${booking.bookingId}.pdf`);
  };

  const handleSearch = (src = source, dest = destination) => {
    if(!src || !dest) return alert("Validation Error: Please enter both destinations.");
    setHasSearched(true); setLoading(true); 
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/flights?source=${src}&destination=${dest}`);
        const data = await response.json();
        const mult = fareType === 'regular' ? 1 : 0.85;
        setFlights(data.map((f, i) => ({ 
          ...f, 
          price: Math.floor(f.price * mult) * passengers, 
          logoUrl: airlineLogos[f.airline] || "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        })));
        setShowScarcity(true);
      } catch (e) { console.error(e); }
      setLoading(false); 
    }, 1800); 
  };

  const handleInteractiveRouteClick = (src, dest) => {
    setSource(src); setDestination(dest);
    setDate(new Date().toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleSearch(src, dest);
  };

  const getCalendarDates = () => {
    const base = date ? new Date(date) : new Date();
    return [-3, -2, -1, 0, 1, 2, 3].map(i => {
      const d = new Date(base); d.setDate(base.getDate() + i);
      return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), price: (flights[0]?.price || 5830) + (i * 450) };
    });
  };

  const getTotalPrice = () => {
    if (!selectedFlight) return 0;
    let total = selectedFlight.price;
    if (selectedSeat && (selectedSeat.startsWith('1') || selectedSeat.startsWith('2'))) total += (950 * passengers);
    if (addons.baggage) total += (1500 * passengers);
    if (addons.meal) total += (550 * passengers);
    return total;
  };

  const handleNameChange = (index, value) => {
    const newNames = [...passengerNames];
    newNames[index] = value;
    setPassengerNames(newNames);
  };

  const processPayment = async () => {
    if (passengerNames.some(name => name.trim() === '')) return alert("Validation Error: Please enter all passenger names.");
    setIsPaying(true);
    
    const bookingData = { 
      pnr: `PNR-${Math.floor(Math.random() * 90000) + 10000}`, 
      source: selectedFlight?.source || "", 
      destination: selectedFlight?.destination || "", 
      airline: selectedFlight?.airline || "", 
      date: date || selectedFlight?.date || "Upcoming", 
      totalPaid: getTotalPrice(), 
      passengerName: passengerNames.join(', '), 
      passengerEmail: activeUser 
    };
    
    try {
      const response = await fetch("http://localhost:8000/api/bookings", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` }, body: JSON.stringify(bookingData) });
      if (response.ok) {
        fetchMyBookings(activeUser); setSelectedFlight(null); setView('profile'); setHasSearched(false); setBookingStep('passenger'); setSelectedSeat(null);
        setShowWhatsApp(true); setTimeout(() => setShowWhatsApp(false), 5000);
      } else {
        const errorData = await response.json(); alert(`Booking failed: ${errorData.detail || "Server error"}`);
      }
    } catch (error) { console.error(error); alert("Network error. Could not connect to the backend server.");
    } finally { setIsPaying(false); }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans flex flex-col relative overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white z-50 border-b border-slate-200 h-20 flex items-center justify-between px-8 lg:px-16 shadow-sm sticky top-0">
        <div className="flex items-center gap-12">
          <button onClick={() => {setView('search'); setHasSearched(false);}} className="text-2xl font-black flex items-center gap-2 text-blue-800 cursor-pointer tracking-tight">
            <Plane className="rotate-45 text-orange-500 w-8 h-8" /> AERO<span className="text-slate-900">X</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <span onClick={() => {setView('search'); setHasSearched(false);}} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition"><MapPin className="w-4 h-4"/> Book <ChevronDown className="w-3 h-3"/></span>
            <span onClick={() => {if(isLoggedIn) setView('profile'); else navigate('/auth');}} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition"><Luggage className="w-4 h-4"/> Trips <ChevronDown className="w-3 h-3"/></span>
            <span onClick={() => {if(isLoggedIn) setView('profile'); else navigate('/auth');}} className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition"><QrCode className="w-4 h-4"/> Check-in</span>
            <span className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition text-orange-600"><Star className="w-4 h-4"/> AeroX Pro <ChevronDown className="w-3 h-3"/></span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden lg:flex text-xs font-bold text-slate-500 border-b border-dashed border-slate-400 cursor-pointer hover:text-blue-600">Tariff Sheet</span>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button onClick={() => setView('profile')} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-black cursor-pointer border border-blue-100 transition hover:bg-blue-100 text-sm"><User className="w-4 h-4"/> {activeUser?.split('@')?.[0] || 'User'}</button>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition cursor-pointer p-2 bg-slate-50 rounded-full hover:bg-red-50 border border-slate-200"><LogOut className="w-4 h-4"/></button>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold shadow-md cursor-pointer hover:bg-blue-600 transition-all text-sm flex items-center gap-2">Login <ChevronDown className="w-4 h-4"/></button>
          )}
        </div>
      </nav>

      <main className="flex-grow relative text-left">
        {view === 'search' && (
          <>
            {/* HERO BACKGROUND & SEARCH WIDGET (INDIGO STYLE) */}
            {!hasSearched && (
              <div className="w-full bg-gradient-to-b from-[#e3f0fa] to-[#f4f7fb] pt-16 pb-32 px-4 flex flex-col items-center relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl w-full text-center lg:text-left mb-10 z-10 px-4">
                   <h1 className="text-4xl md:text-5xl font-medium text-slate-800 tracking-tight leading-tight">Embark on a journey of inspiration<br/>with AeroX, where <span className="text-green-600 font-bold">discovery meets the sky.</span></h1>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-6xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100 z-20">
                  <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <button onClick={()=>setSearchTab('flights')} className={`flex-1 py-5 font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition ${searchTab==='flights' ? 'bg-blue-800 text-white shadow-inner' : 'text-slate-500 hover:bg-slate-100 cursor-pointer'}`}><Plane className="w-5 h-5"/> Flights</button>
                    <button onClick={()=>{alert("Hotel booking integration is locked.");}} className={`flex-1 py-5 font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition text-slate-500 hover:bg-slate-100 cursor-pointer`}><MapPin className="w-5 h-5"/> Hotels <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[8px]">Earn Miles</span></button>
                    <button onClick={()=>{alert("Sightseeing integration is locked.");}} className={`flex-1 py-5 font-black text-sm uppercase tracking-widest flex justify-center items-center gap-3 transition text-slate-500 hover:bg-slate-100 cursor-pointer`}><Map className="w-5 h-5"/> Sight Seeing <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px]">50% Off</span></button>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={tripType==='oneway'} onChange={()=>setTripType('oneway')} className="w-4 h-4 text-blue-600 cursor-pointer" /><span className="font-bold text-slate-700 text-sm">One Way</span></label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={tripType==='roundtrip'} onChange={()=>setTripType('roundtrip')} className="w-4 h-4 text-blue-600 cursor-pointer" /><span className="font-bold text-slate-700 text-sm">Round Trip</span></label>
                      </div>
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-2">Currency: <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-800">INR ₹</span></div>
                    </div>
                    <div className="border-2 border-slate-200 rounded-2xl flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-200 hover:border-blue-300 transition-colors">
                      <div className="flex-1 p-4 relative group hover:bg-slate-50 transition rounded-l-2xl">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">From</label>
                        <input type="text" placeholder="Flying from?" value={source} onChange={e=>setSource(e.target.value)} className="w-full bg-transparent font-black text-xl text-slate-900 outline-none placeholder-slate-300 uppercase" />
                      </div>
                      <div className="absolute hidden md:flex items-center justify-center w-8 h-8 bg-white border-2 border-slate-200 rounded-full left-[20%] top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10 text-blue-600 shadow-sm"><ArrowRight className="w-4 h-4"/></div>
                      <div className="flex-1 p-4 hover:bg-slate-50 transition">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">To</label>
                        <input type="text" placeholder="Going to?" value={destination} onChange={e=>setDestination(e.target.value)} className="w-full bg-transparent font-black text-xl text-slate-900 outline-none placeholder-slate-300 uppercase" />
                      </div>
                      <div className="flex-1 p-4 hover:bg-slate-50 transition cursor-pointer relative">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Departure</label>
                        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-transparent font-black text-lg text-blue-700 outline-none cursor-pointer" />
                      </div>
                      
                      {tripType === 'roundtrip' ? (
                        <div className="flex-1 p-4 hover:bg-slate-50 transition cursor-pointer relative">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return</label>
                          <input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} className="w-full bg-transparent font-black text-lg text-blue-700 outline-none cursor-pointer" />
                        </div>
                      ) : (
                        <div className="flex-1 p-4 hover:bg-slate-50 transition opacity-50 cursor-pointer" onClick={() => setTripType('roundtrip')}>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Return</label>
                          <p className="font-bold text-sm mt-1 text-slate-500">Book round trip to save more</p>
                        </div>
                      )}

                      <div className="flex-1 p-4 hover:bg-slate-50 transition cursor-pointer rounded-r-2xl relative" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Travelers & Class</label>
                        <p className="font-black text-xl text-slate-900">{passengers} Passenger{passengers > 1 ? 's' : ''}</p>
                        
                        {showPassengerDropdown && (
                          <div className="absolute top-full mt-2 right-0 bg-white shadow-2xl rounded-2xl p-5 z-50 border border-slate-100 min-w-[220px]" onClick={e => e.stopPropagation()}>
                             <div className="flex justify-between items-center mb-4">
                               <span className="font-bold text-slate-700">Adults</span>
                               <div className="flex items-center gap-3">
                                 <button onClick={() => passengers > 1 && setPassengers(passengers - 1)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black text-lg hover:bg-slate-200 transition">-</button>
                                 <span className="font-black text-lg w-4 text-center">{passengers}</span>
                                 <button onClick={() => setPassengers(passengers + 1)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-black text-lg hover:bg-blue-200 transition">+</button>
                               </div>
                             </div>
                             <button onClick={() => setShowPassengerDropdown(false)} className="w-full bg-slate-900 text-white py-2 rounded-xl font-bold mt-2">Done</button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <span className="text-xs font-bold text-slate-500 mr-2">Special Fares:</span>
                        {['regular', 'student', 'armed', 'senior', 'doctor'].map(f => (
                          <button key={f} onClick={()=>setFareType(f)} className={`whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-[10px] transition cursor-pointer uppercase tracking-widest ${fareType===f ? 'bg-blue-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f}</button>
                        ))}
                      </div>
                      <button onClick={() => handleSearch()} className="w-full md:w-auto bg-orange-500 text-white px-12 py-4 rounded-xl font-black text-lg hover:bg-orange-600 transition shadow-[0_10px_20px_rgba(249,115,22,0.2)] cursor-pointer flex items-center justify-center gap-2">SEARCH FLIGHTS <ArrowRight className="w-5 h-5"/></button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* HAS SEARCHED: FLIGHT RESULTS UI */}
            {hasSearched && (
              <div className="max-w-7xl mx-auto p-4 py-8 relative z-20">
                <div className="flex gap-2 overflow-x-auto mb-10 pb-2 hide-scrollbar">
                  {getCalendarDates().map((item, i) => (
                    <div key={i} className={`min-w-[150px] p-4 rounded-2xl border-2 text-center transition cursor-pointer ${i===3 ? 'border-blue-600 bg-blue-50 shadow-md scale-105' : 'border-slate-200 bg-white hover:border-blue-300'}`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                      <p className={`font-black text-lg ${i===3?'text-blue-800':'text-slate-800'}`}>₹{item.price.toLocaleString()}</p>
                      {i === 2 && <span className="text-[8px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter mt-1 inline-block">Cheapest</span>}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-72 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h3 className="font-black text-lg mb-4 flex items-center gap-2 text-blue-800"><Filter className="w-5 h-5"/> Filters</h3><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={filterNonStop} onChange={()=>setFilterNonStop(!filterNonStop)} className="w-5 h-5 rounded border-slate-300 text-blue-600 cursor-pointer" /><span className="font-bold text-slate-600">Non-Stop Only</span></label></div>
                    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"><Percent className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10" /><h4 className="font-black text-xl mb-2 relative z-10 text-left">HDFC Offer</h4><p className="text-sm text-blue-200 mb-6 relative z-10 font-medium">Flat ₹2,000 OFF on domestic flights.</p><div className="bg-white text-blue-900 px-4 py-2 rounded-lg font-black text-sm tracking-widest relative z-10 text-center uppercase">CODE: HDFC2000</div></div>
                  </div>

                  <div className="flex-1 space-y-5">
                    {loading ? (
                      [1, 2, 3].map((skeleton) => (
                        <div key={skeleton} className="bg-white p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between shadow-sm animate-pulse">
                          <div className="flex items-center gap-6"><div className="w-12 h-12 bg-slate-100 rounded-xl"></div><div><div className="w-24 h-5 bg-slate-200 rounded-md mb-2"></div><div className="w-16 h-3 bg-slate-100 rounded-md"></div></div></div>
                          <div className="flex items-center gap-12 mt-4 md:mt-0"><div className="text-right"><div className="w-16 h-6 bg-slate-200 rounded-md mb-2"></div><div className="w-10 h-3 bg-slate-100 rounded-md ml-auto"></div></div><div className="w-24 flex flex-col items-center"><div className="w-12 h-2 bg-slate-100 rounded-md mb-2"></div><div className="h-[2px] bg-slate-200 w-full"></div></div><div><div className="w-16 h-6 bg-slate-200 rounded-md mb-2"></div><div className="w-10 h-3 bg-slate-100 rounded-md"></div></div></div>
                          <div className="text-right mt-4 md:mt-0"><div className="w-24 h-8 bg-slate-200 rounded-md mb-3 ml-auto"></div><div className="w-32 h-12 bg-slate-200 rounded-xl"></div></div>
                        </div>
                      ))
                    ) : (
                      flights.filter(f => filterNonStop ? (f?.duration?.includes('2h') || f?.duration?.includes('3h')) : true).map((f, i) => (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={i} className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row items-center justify-between group hover:shadow-xl hover:border-blue-200 transition-all relative overflow-hidden">
                          {f.tag && <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-br-lg z-10">{f.tag}</div>}
                          
                          <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 p-1">
                              <img src={f.logoUrl} alt={f.airline} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div><h3 className="text-lg font-black text-slate-800">{f.airline}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{f.id}</p></div>
                          </div>
                          
                          <div className="flex items-center gap-8 md:gap-12 mt-6 md:mt-0 w-full md:w-auto justify-center">
                            <div className="text-right"><p className="text-2xl font-black text-slate-800">{f.depart}</p><p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{f?.source?.split(' ')[0]}</p></div>
                            <div className="w-24 text-center"><p className="text-[10px] font-black text-slate-400 mb-1">{f.duration}</p><div className="h-[2px] bg-slate-200 w-full relative"><Plane className="w-4 h-4 text-slate-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/></div><p className="text-[9px] font-black text-green-600 uppercase mt-2 tracking-widest">Non-stop</p></div>
                            <div className="text-left"><p className="text-2xl font-black text-slate-800">Arrival</p><p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{f?.destination?.split(' ')[0]}</p></div>
                          </div>
                          <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-slate-100 mt-6 md:mt-0 pt-6 md:pt-0 md:pl-8 w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between">
                            <p className="text-3xl font-black text-slate-900 md:mb-1">₹{f?.price?.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-slate-400 mb-3">{passengers} Passenger{passengers > 1 ? 's' : ''}</p>
                            <button onClick={() => { if(!isLoggedIn) return navigate('/auth'); setSelectedFlight(f); }} className="bg-blue-800 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-900 transition shadow-md cursor-pointer tracking-widest">BOOK NOW</button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DESTINATIONS & ADD-ONS (INDIGO STYLE) */}
            {!hasSearched && (
              <div className="w-full bg-white pb-24 z-20 relative">
                <div className="max-w-7xl mx-auto px-6 text-center mt-8 mb-12">
                   <p className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase mb-4">Where are you planning to go next?</p>
                   <h2 className="text-3xl md:text-4xl font-medium text-slate-800 tracking-tight">Save on your journey by <span className="text-green-600 font-bold">exploring</span> these routes</h2>
                </div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                  {[ 
                    { src: 'Delhi', dest: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600', price: '₹4,023' }, 
                     
                    { src: 'Mumbai', dest: 'Bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600', price: '₹14,783' },
                    { src: 'Delhi', dest: 'Kolkata', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=600', price: '₹5,046' }, 
                  ].map((route, i) => (
                    <div key={i} onClick={() => handleInteractiveRouteClick(route.src, route.dest)} className="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <img src={route.img} alt={route.dest} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                        <div><h3 className="text-2xl font-medium text-white mb-1">{route.src} to {route.dest}</h3><p className="text-sm font-bold text-slate-300">Flights starting at {route.price}</p></div>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:bg-white group-hover:text-slate-900 transition-colors"><ArrowRight className="w-5 h-5 -rotate-45" /></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="max-w-7xl mx-auto px-6 mb-16">
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900">
                    <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600" alt="Traveler" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
                    <div className="relative z-10 p-10 md:p-16 h-full flex flex-col justify-between min-h-[500px]">
                      <div><h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-2">Add more <span className="text-green-400 font-bold">AeroX Add-ons</span></h2><h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">to your journey</h2><p className="mt-4 text-slate-300 font-bold text-sm uppercase tracking-widest">*T&C apply</p></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div onClick={()=>alert("Fast Forward available in checkout.")} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white cursor-pointer hover:bg-white/20 transition group"><h3 className="text-2xl font-medium mb-4 leading-tight">Pre book Fast forward<br/>at up to 70% discount</h3><div className="flex justify-between items-end"><p className="text-xs text-slate-300 font-bold w-2/3">Priority check-in and anytime boarding.</p><div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowRight className="w-4 h-4 -rotate-45"/></div></div></div>
                        <div onClick={()=>alert("Baggage options available during checkout.")} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white cursor-pointer hover:bg-white/20 transition group"><h3 className="text-2xl font-medium mb-4 leading-tight">Pre-paid excess<br/>baggage starting at ₹1515</h3><div className="flex justify-between items-end"><p className="text-xs text-slate-300 font-bold w-2/3">Excess baggage and additional piece.</p><div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowRight className="w-4 h-4 -rotate-45"/></div></div></div>
                        <div onClick={()=>alert("XL Seats can be selected in Step 2 of booking.")} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white cursor-pointer hover:bg-white/20 transition group"><h3 className="text-2xl font-medium mb-4 leading-tight">Emergency XL (Extra<br/>legroom) seats at ₹500</h3><div className="flex justify-between items-end"><p className="text-xs text-slate-300 font-bold w-2/3">Window, aisle or seat with extra legroom.</p><div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowRight className="w-4 h-4 -rotate-45"/></div></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* PROFILE / DASHBOARD VIEW */}
        {view === 'profile' && (
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-[3rem] p-12 text-white flex items-center gap-8 mb-12 shadow-2xl relative overflow-hidden border-b-8 border-orange-500">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
               <div className="w-32 h-32 bg-white text-blue-900 rounded-full flex items-center justify-center text-5xl font-black border-4 border-white/20 shadow-xl relative z-10">{activeUser ? activeUser[0].toUpperCase() : 'U'}</div>
               <div className="text-left relative z-10"><h2 className="text-5xl font-black mb-2 tracking-tight">Welcome Back.</h2><p className="text-blue-200 text-xl font-bold tracking-wider">{activeUser}</p><span className="mt-4 inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase"><ShieldCheck className="w-4 h-4"/> PRO MEMBER</span></div>
            </div>
            
            <h2 className="text-3xl font-black mb-8 text-slate-800 flex items-center gap-3"><Luggage className="w-8 h-8 text-blue-600"/> My Bookings</h2>
            
            {myBookings.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center border border-slate-200 shadow-sm"><Plane className="w-16 h-16 text-slate-200 mx-auto mb-4"/><h3 className="text-xl font-bold text-slate-500 mb-6">No upcoming flights found.</h3><button onClick={() => setView('search')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition cursor-pointer">Book a Flight</button></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {myBookings.map(b => (
                  <div key={b.bookingId} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group hover:border-blue-300 transition-all">
                    <div className="flex justify-between mb-8 text-left border-b border-slate-100 pb-6"><span className="bg-slate-100 text-slate-800 px-4 py-1.5 rounded-lg font-black text-[10px] tracking-widest uppercase">PNR: {b.bookingId}</span><span className="text-green-600 font-black text-xs uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Confirmed</span></div>
                    <div className="flex justify-between items-center mb-8 text-left"><div><p className="text-4xl font-black text-slate-900">{(b?.source || "SRC")?.substring(0,3)?.toUpperCase()}</p><p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{b?.source?.split(' ')[0]}</p></div><div className="w-24 text-center relative"><div className="h-[2px] bg-slate-200 w-full"></div><Plane className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1"/></div><div className="text-right"><p className="text-4xl font-black text-slate-900">{(b?.destination || "DST")?.substring(0,3)?.toUpperCase()}</p><p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{b?.destination?.split(' ')[0]}</p></div></div>
                    <div className="bg-slate-50 p-5 rounded-xl mb-6 border border-slate-100 text-left flex justify-between items-center"><div><p className="font-black text-slate-900 text-sm mb-1">{b.airline} • {b.date}</p><p className="text-xs text-slate-500 font-bold">Passenger(s): <span className="text-slate-800">{b.passengerDetails?.name}</span></p></div><div className="text-right"><p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Paid</p><p className="font-black text-lg text-slate-800">₹{(b.totalPaid || 0).toLocaleString()}</p></div></div>
                    <div className="flex gap-3">
                      <button onClick={() => setCheckInFlight(b)} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition uppercase tracking-widest text-[10px] cursor-pointer shadow-md flex justify-center items-center gap-2"><QrCode className="w-4 h-4"/> Check-In</button>
                      <button onClick={() => downloadTicket(b)} className="flex-1 bg-blue-50 text-blue-700 font-bold border border-blue-100 py-3 rounded-xl hover:bg-blue-100 transition uppercase tracking-widest text-[10px] cursor-pointer flex justify-center items-center gap-2"><Download className="w-4 h-4"/> E-Ticket</button>
                      <button onClick={() => cancelTicket(b.bookingId)} className="w-12 bg-red-50 text-red-500 font-bold border border-red-100 py-3 rounded-xl hover:bg-red-100 transition cursor-pointer flex justify-center items-center"><X className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {selectedFlight && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl bg-slate-900/80 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full flex flex-col md:flex-row overflow-hidden relative my-10 border border-slate-200">
              <button onClick={() => setSelectedFlight(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-50 bg-slate-100 p-2 rounded-full cursor-pointer transition hover:rotate-90"><X className="w-5 h-5"/></button>
              
              <div className="bg-slate-50 p-10 md:w-[35%] border-r border-slate-200 text-left flex flex-col h-full min-h-[500px]">
                <h4 className="font-black text-xl mb-6 text-slate-800 tracking-tight">Fare Summary</h4>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-auto">
                  <p className="font-black text-xl text-slate-900">{selectedFlight?.source?.split(' ')[0]} <ArrowRight className="w-4 h-4 inline text-slate-400 mx-1"/> {selectedFlight?.destination?.split(' ')[0]}</p>
                  <p className="text-blue-700 font-black mt-2 text-xs uppercase tracking-widest">{selectedFlight?.airline}</p>
                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 font-bold text-slate-500 text-sm">
                    <div className="flex justify-between"><span>Base Fare (x{passengers})</span><span className="text-slate-900 font-black">₹{(selectedFlight?.price || 0).toLocaleString()}</span></div>
                    {selectedSeat && <div className="flex justify-between text-purple-600"><span>Seat ({selectedSeat})</span><span className="font-black">+ ₹{950 * passengers}</span></div>}
                    {addons.baggage && <div className="flex justify-between text-blue-600"><span>Extra Baggage</span><span className="font-black">+ ₹{1500 * passengers}</span></div>}
                  </div>
                </div>
                <div className="flex justify-between items-end bg-blue-900 p-6 rounded-2xl text-white shadow-lg mt-6">
                  <span className="font-black text-sm opacity-70 uppercase tracking-widest">Total</span><span className="font-black text-3xl tracking-tight">₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <div className="p-10 md:w-[65%] bg-white overflow-y-auto max-h-[85vh]">
                <div className="flex justify-between mb-10 border-b border-slate-100 pb-6 relative">
                   <div className="absolute bottom-[-1px] left-0 h-[2px] bg-orange-500 transition-all rounded-full" style={{width: bookingStep==='passenger'?'25%':bookingStep==='seats'?'50%':bookingStep==='services'?'75%':'100%'}}></div>
                   {['Details', 'Seats', 'Extras', 'Pay'].map((s, idx) => (
                    <span key={s} className={`text-[9px] font-black uppercase tracking-[0.2em] ${bookingStep.toLowerCase().includes(s.toLowerCase().substring(0,3)) ? 'text-orange-500' : 'text-slate-300'}`}>{idx+1}. {s}</span>
                  ))}
                </div>

                {bookingStep === 'passenger' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <h3 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3 tracking-tight"><UserPlus className="w-8 h-8 text-orange-500"/> Traveller Details</h3>
                    <div className="space-y-4 mb-8">
                      {passengerNames.map((name, index) => (
                        <input key={index} type="text" placeholder={`Passenger ${index + 1} Full Legal Name`} value={name} onChange={e => handleNameChange(index, e.target.value)} className="w-full p-5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-700" />
                      ))}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <input type="email" placeholder="Contact Email" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} className="p-5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-700" />
                        <input type="tel" placeholder="Contact Mobile" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} className="p-5 bg-slate-50 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-slate-700" />
                      </div>
                    </div>
                    <button onClick={() => setBookingStep('seats')} className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-lg shadow-lg hover:bg-blue-600 transition cursor-pointer flex justify-center items-center gap-2 tracking-widest uppercase">Choose Seat <ArrowRight className="w-5 h-5"/></button>
                  </div>
                )}

                {bookingStep === 'seats' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center">
                    <h3 className="text-2xl font-black mb-8 text-slate-900 uppercase tracking-tight">Select Your Seat</h3>
                    <div className="bg-slate-50 p-8 rounded-3xl mb-8 border border-slate-200 w-full max-w-sm">
                      <div className="grid grid-cols-7 gap-3">
                        {['A','B','C',' ','D','E','F'].map((col, idx) => ( <div key={idx} className="text-center font-black text-slate-400 text-[10px] mb-2">{col}</div> ))}
                        {[1, 2, 3, 4, 5].map(row => (
                          <div key={row} className="flex col-span-7 gap-3 items-center">
                            {['A','B','C','AISLE','D','E','F'].map((col, idx) => {
                              if (col === 'AISLE') return <div key={idx} className="flex items-center justify-center font-black text-slate-300 text-[10px] w-6">{row}</div>
                              const seatId = `${row}${col}`;
                              const isPremium = row <= 2;
                              const isSelected = selectedSeat === seatId;
                              return (
                                <button key={idx} onClick={() => setSelectedSeat(seatId)} className={`w-8 h-10 rounded-lg transition-all border-b-4 cursor-pointer flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-700 text-white scale-110 shadow-md z-10' : isPremium ? 'bg-purple-100 border-purple-300 text-purple-600 hover:bg-purple-200' : 'bg-white border-slate-200 text-slate-400 hover:bg-blue-50'}`}><Armchair className="w-4 h-4"/></button>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setBookingStep('services')} className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-lg shadow-lg hover:bg-blue-600 transition cursor-pointer tracking-widest uppercase">Confirm Seat {selectedSeat || 'TBA'}</button>
                  </div>
                )}

                {bookingStep === 'services' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                    <h3 className="text-3xl font-black mb-8 text-slate-900 tracking-tight flex items-center gap-3"><Luggage className="w-8 h-8 text-blue-600"/> Add-ons</h3>
                    <div className="space-y-4 mb-8">
                      <div onClick={()=>setAddons({...addons, baggage: !addons.baggage})} className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${addons.baggage ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}>
                         <div className="flex justify-between items-center"><div className="flex gap-4 items-center"><Luggage className="w-8 h-8 text-blue-600"/><div><h4 className="text-lg font-black text-slate-900">Priority Baggage</h4><p className="text-slate-500 font-bold text-xs mt-1">Extra 15kg + Express Delivery</p></div></div><span className="text-lg font-black text-blue-700">+ ₹{1500 * passengers}</span></div>
                      </div>
                      <div onClick={()=>setAddons({...addons, meal: !addons.meal})} className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${addons.meal ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-slate-200 hover:border-blue-300'}`}>
                         <div className="flex justify-between items-center"><div className="flex gap-4 items-center"><Utensils className="w-8 h-8 text-orange-500"/><div><h4 className="text-lg font-black text-slate-900">Gourmet Dining</h4><p className="text-slate-500 font-bold text-xs mt-1">Hot meal by Chef</p></div></div><span className="text-lg font-black text-blue-700">+ ₹{550 * passengers}</span></div>
                      </div>
                    </div>
                    <button onClick={() => setBookingStep('payment')} className="w-full bg-slate-900 text-white py-5 rounded-xl font-black text-lg shadow-lg hover:bg-blue-600 transition cursor-pointer tracking-widest uppercase">Proceed to Pay</button>
                  </div>
                )}

                {bookingStep === 'payment' && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                    {isPaying ? (
                       <div className="py-20 flex flex-col items-center"><div className="w-16 h-16 border-4 border-blue-100 border-t-orange-500 rounded-full animate-spin mb-6"></div><h3 className="text-2xl font-black text-slate-900 tracking-tight">Processing Payment...</h3></div>
                    ) : (
                      <>
                        <h3 className="text-3xl font-black mb-8 text-slate-900 tracking-tight uppercase flex items-center justify-center gap-3"><Shield className="w-8 h-8 text-green-500"/> Secure Pay</h3>
                        <div className="flex gap-4 mb-6">
                           <button onClick={()=>setPaymentMethod('upi')} className={`flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition cursor-pointer border ${paymentMethod==='upi'?'bg-blue-600 border-blue-600 text-white':'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>UPI</button>
                           <button onClick={()=>setPaymentMethod('card')} className={`flex-1 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition cursor-pointer border ${paymentMethod==='card'?'bg-slate-900 border-slate-900 text-white':'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>Card</button>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 mb-8 text-left min-h-[160px] flex flex-col justify-center">
                           {paymentMethod === 'card' ? (
                             <div className="space-y-3">
                               <div className="relative"><CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/><input type="text" maxLength="16" placeholder="Card Number" value={paymentData.cardNum} onChange={e=>setPaymentData({...paymentData, cardNum: e.target.value})} className="w-full p-4 pl-12 bg-white rounded-xl border border-slate-200 outline-none font-bold text-slate-700" /></div>
                               <div className="flex gap-3"><input type="text" placeholder="MM/YY" className="flex-1 p-4 bg-white rounded-xl border border-slate-200 outline-none font-bold text-slate-700 text-center" /><input type="password" placeholder="CVV" className="flex-1 p-4 bg-white rounded-xl border border-slate-200 outline-none font-bold text-slate-700 text-center" /></div>
                             </div>
                           ) : (
                             <div className="text-center">
                               <input type="text" placeholder="Enter UPI ID (e.g., name@okicici)" value={paymentData.upi} onChange={e=>setPaymentData({...paymentData, upi: e.target.value})} className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none font-bold text-slate-700 mb-3 text-center" />
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Open your UPI app after clicking Pay</p>
                             </div>
                           )}
                        </div>
                        <button onClick={processPayment} className="w-full bg-orange-500 text-white py-5 rounded-xl font-black text-xl shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:bg-orange-600 transition cursor-pointer tracking-tight">Confirm & Pay ₹{getTotalPrice().toLocaleString()}</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScarcity && (
           <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed bottom-10 right-10 z-[200] bg-white p-5 rounded-2xl shadow-xl border-l-4 border-orange-500 flex items-center gap-4">
              <div className="bg-orange-50 p-2 rounded-lg"><Users className="text-orange-500 w-5 h-5"/></div>
              <div><p className="text-sm font-black text-slate-900 tracking-tight">High Demand!</p><p className="text-xs font-bold text-slate-500">12 people viewed this flight.</p></div>
              <button onClick={()=>setShowScarcity(false)} className="text-slate-400 hover:text-slate-900 ml-2 cursor-pointer"><X className="w-4 h-4"/></button>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWhatsApp && (
           <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3">
              <MessageCircle className="w-5 h-5"/>
              <p className="font-bold text-sm tracking-tight">Ticket sent to WhatsApp ending in ****{contactPhone?.slice(-4) || '1234'}</p>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkInFlight && (
          <WebCheckIn booking={checkInFlight} onClose={() => setCheckInFlight(null)} />
        )}
      </AnimatePresence>

      <EnterpriseFooter />
    </div>
  );
}

export default function App() {
  const [activeUser, setActiveUser] = useState(localStorage.getItem('aero_user') || '');
  const [authToken, setAuthToken] = useState(localStorage.getItem('aero_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('aero_token'));

  const loginUser = (email, token) => {
    localStorage.setItem('aero_user', email);
    localStorage.setItem('aero_token', token);
    setActiveUser(email); setAuthToken(token); setIsLoggedIn(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('aero_user'); localStorage.removeItem('aero_token');
    setActiveUser(''); setAuthToken(''); setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp activeUser={activeUser} authToken={authToken} isLoggedIn={isLoggedIn} handleLogout={logoutUser} />} />
        <Route path="/auth" element={<AuthPage loginUser={loginUser} />} />
      </Routes>
    </Router>
  );
}