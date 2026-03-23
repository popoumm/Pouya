import React, { useState, useEffect } from 'react';
import { GlassCard, GlassButton, GlassInput } from './GlassUI';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Info, 
  Zap,
  Activity,
  History,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Trade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  time: string;
  isSimulated: boolean;
}

interface Order {
  price: number;
  amount: number;
  total: number;
  isSimulated: boolean;
}

export default function TradingModule({ isPublic = false }: { isPublic?: boolean }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('2450000');
  const basePrice = 2450000; // Base gold price in Toman

  // Simulation Engine
  useEffect(() => {
    // Initial Order Book
    const generateInitialOrders = () => {
      const newBids: Order[] = [];
      const newAsks: Order[] = [];
      
      for (let i = 0; i < 8; i++) {
        const bidPrice = basePrice - (i * 500) - (Math.random() * 200);
        const askPrice = basePrice + (i * 500) + (Math.random() * 200);
        
        newBids.push({
          price: Math.round(bidPrice),
          amount: Number((Math.random() * 5 + 0.1).toFixed(2)),
          total: 0,
          isSimulated: true
        });
        
        newAsks.push({
          price: Math.round(askPrice),
          amount: Number((Math.random() * 5 + 0.1).toFixed(2)),
          total: 0,
          isSimulated: true
        });
      }
      
      setBids(newBids.sort((a, b) => b.price - a.price));
      setAsks(newAsks.sort((a, b) => a.price - b.price));
    };

    generateInitialOrders();

    // Live Trade Simulator
    const tradeInterval = setInterval(() => {
      const isBuy = Math.random() > 0.5;
      const priceVar = (Math.random() - 0.5) * 1000;
      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        price: Math.round(basePrice + priceVar),
        amount: Number((Math.random() * 2 + 0.05).toFixed(3)),
        type: isBuy ? 'buy' : 'sell',
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isSimulated: Math.random() > 0.2 // 80% simulated for early stage feel
      };

      setTrades(prev => [newTrade, ...prev].slice(0, 15));

      // Update Order Book slightly based on trade
      if (isBuy) {
        setAsks(prev => {
          const next = [...prev];
          if (next.length > 0) next[0].amount = Math.max(0.01, next[0].amount - 0.01);
          return next;
        });
      } else {
        setBids(prev => {
          const next = [...prev];
          if (next.length > 0) next[0].amount = Math.max(0.01, next[0].amount - 0.01);
          return next;
        });
      }
    }, 3000);

    return () => clearInterval(tradeInterval);
  }, []);

  const handleTrade = () => {
    if (!amount || !price) return;
    
    const newTrade: Trade = {
      id: Math.random().toString(36).substr(2, 9),
      price: Number(price),
      amount: Number(amount),
      type: tradeType,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isSimulated: false
    };

    setTrades(prev => [newTrade, ...prev].slice(0, 15));
    setAmount('');
    // In a real app, this would send a request to the backend
  };

  return (
    <div className={`grid grid-cols-1 ${isPublic ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
      {/* Order Book */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
              <Zap size={20} className="text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold">دفتر سفارشات</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/20 italic">
            <Info size={12} />
            <span>نقدینگی آزمایشی</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sell Orders (Asks) */}
          <div>
            <div className="text-[10px] text-[#FF4D4D] font-bold uppercase tracking-widest mb-4 px-2 flex justify-between">
              <span>فروش</span>
              <span>قیمت</span>
            </div>
            <div className="space-y-1">
              {asks.slice(0, 10).map((order, i) => (
                <div key={`ask-${i}`} className="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-[#FF4D4D]/5 transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#FF4D4D]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="text-[10px] font-medium text-white/60 relative z-10">{order.amount}</span>
                  <span className="text-xs font-bold text-[#FF4D4D] relative z-10">{order.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Orders (Bids) */}
          <div>
            <div className="text-[10px] text-[#00FFA3] font-bold uppercase tracking-widest mb-4 px-2 flex justify-between">
              <span>قیمت</span>
              <span>خرید</span>
            </div>
            <div className="space-y-1">
              {bids.slice(0, 10).map((order, i) => (
                <div key={`bid-${i}`} className="flex justify-between items-center py-1.5 px-2 rounded-lg hover:bg-[#00FFA3]/5 transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00FFA3]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="text-xs font-bold text-[#00FFA3] relative z-10">{order.price.toLocaleString()}</span>
                  <span className="text-[10px] font-medium text-white/60 relative z-10">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 py-4 border-t border-white/5 flex items-center justify-center gap-4 bg-white/[0.02] rounded-xl">
          <span className="text-2xl font-bold gold-text">{basePrice.toLocaleString()}</span>
          <Activity size={16} className="text-[#00FFA3] animate-pulse" />
        </div>
      </GlassCard>

      {/* Trading Form - Hidden in Public Mode */}
      {!isPublic && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-[#FFD700]" />
            </div>
            <h3 className="text-xl font-bold">معامله سریع</h3>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 mb-8">
            <button 
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tradeType === 'buy' ? 'bg-[#00FFA3] text-black shadow-lg shadow-[#00FFA3]/20' : 'text-white/40 hover:text-white'}`}
            >
              خرید طلا
            </button>
            <button 
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tradeType === 'sell' ? 'bg-[#FF4D4D] text-black shadow-lg shadow-[#FF4D4D]/20' : 'text-white/40 hover:text-white'}`}
            >
              فروش طلا
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest px-2">
                <span>قیمت واحد (تومان)</span>
                <span>Market Price</span>
              </div>
              <GlassInput 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="text-lg font-bold py-4"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest px-2">
                <span>مقدار (گرم)</span>
                <span>Amount</span>
              </div>
              <GlassInput 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-bold py-4"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/40">ارزش کل</span>
                <span className="font-bold">{(Number(amount || 0) * Number(price || 0)).toLocaleString()} تومان</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-white/40">موجودی در دسترس</span>
                <div className="flex items-center gap-1 text-[#00FFA3]">
                  <Wallet size={12} />
                  <span className="font-bold">۱۲,۵۰۰,۰۰۰</span>
                </div>
              </div>
            </div>

            <GlassButton 
              className={`w-full py-5 text-lg ${tradeType === 'buy' ? 'bg-[#00FFA3] shadow-[#00FFA3]/20' : 'bg-[#FF4D4D] shadow-[#FF4D4D]/20'}`}
              onClick={handleTrade}
              disabled={!amount}
            >
              {tradeType === 'buy' ? 'تایید خرید طلا' : 'تایید فروش طلا'}
            </GlassButton>
          </div>
        </GlassCard>
      )}

      {/* Live Trades */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <History size={20} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">معاملات زنده</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40">
            Live Feed
          </div>
        </div>

        <div className="overflow-hidden h-[380px] relative">
          <div className="absolute inset-0 overflow-y-auto no-scrollbar space-y-3">
            <AnimatePresence initial={false}>
              {trades.map((trade) => (
                <motion.div 
                  key={trade.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      trade.type === 'buy' ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-[#FF4D4D]/10 text-[#FF4D4D]'
                    }`}>
                      {trade.type === 'buy' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                    </div>
                    <div>
                      <p className={`font-bold ${trade.isSimulated ? 'text-white/40 italic' : 'text-white'}`}>
                        {trade.price.toLocaleString()}
                        {trade.isSimulated && <span className="text-[8px] ml-2 opacity-50 font-normal">Simulated</span>}
                      </p>
                      <p className="text-[10px] text-white/20">{trade.time}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{trade.amount} گرم</p>
                    <p className="text-[10px] text-white/30">حجم</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
        </div>
      </GlassCard>
    </div>
  );
}
