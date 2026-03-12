import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { Download, Copy, Check, CreditCard, AlertCircle, Loader2 } from "lucide-react";

const depositAmounts = [50, 100, 250, 500, 1000, 2500];

export default function ReceiveMoney() {
  const { user, token } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(user?.account_number || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 10) {
      setError("Minimum deposit is $10.00");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/deposits/create`, {
        amount: parseFloat(amount),
        origin_url: window.location.origin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to initiate deposit");
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" data-testid="receive-money-page">
        <h1 className="font-display text-3xl font-bold text-[#0A1628] mb-2">Receive / Deposit</h1>
        <p className="text-[#64748B] mb-8">Add funds to your account or share your details</p>

        {/* Account Info Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0A1628]">Your Account Details</h2>
              <p className="text-[#64748B] text-sm">Share to receive transfers</p>
            </div>
          </div>

          <div className="bg-[#F8F9FA] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Account Number</p>
                <p className="font-mono text-xl font-bold text-[#0A1628]" data-testid="account-number">
                  {user?.account_number}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg hover:bg-[#F1F5F9] transition-colors"
                data-testid="copy-account-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#64748B]" />
                    <span className="text-[#64748B]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
              <p className="text-sm text-[#64748B]">Account Holder</p>
              <p className="font-semibold text-[#0A1628]">{user?.first_name} {user?.last_name}</p>
            </div>
          </div>
        </div>

        {/* Deposit Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#0A1628]">Add Funds</h2>
              <p className="text-[#64748B] text-sm">Deposit via card (Stripe)</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" data-testid="deposit-error">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Amount Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0A1628] mb-3">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-3">
              {depositAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-lg font-semibold transition-all ${
                    selectedAmount === amt
                      ? 'bg-[#C9A227] text-[#0A1628]'
                      : 'bg-[#F8F9FA] text-[#0A1628] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                  }`}
                  data-testid={`amount-${amt}`}
                >
                  {formatCurrency(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#0A1628] mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] font-mono"
                placeholder="0.00"
                min="10"
                step="0.01"
                data-testid="custom-amount-input"
              />
            </div>
            <p className="text-sm text-[#64748B] mt-1">Minimum deposit: $10.00</p>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={loading || (!selectedAmount && !customAmount)}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
            data-testid="deposit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Deposit {selectedAmount ? formatCurrency(selectedAmount) : customAmount ? formatCurrency(parseFloat(customAmount)) : 'Funds'}
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#64748B] mt-4">
            You'll be redirected to Stripe for secure payment
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
