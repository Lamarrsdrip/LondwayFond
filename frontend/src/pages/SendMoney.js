import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { Send, Search, ArrowRight, CheckCircle, AlertCircle, User } from "lucide-react";

export default function SendMoney() {
  const { token, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const lookupAccount = async () => {
    if (!accountNumber || accountNumber.length < 5) {
      setError("Please enter a valid account number");
      return;
    }

    setSearchLoading(true);
    setError("");
    setRecipient(null);

    try {
      const response = await axios.get(`${API}/transfers/lookup/${accountNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipient(response.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Account not found");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/transfers/send`, {
        recipient_account: accountNumber,
        amount: parseFloat(amount),
        description: description || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(response.data);
      await refreshUser();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRecipient(null);
    setAccountNumber("");
    setAmount("");
    setDescription("");
    setError("");
    setSuccess(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" data-testid="send-money-page">
        <h1 className="font-display text-3xl font-bold text-[#0A1628] mb-2">Send Money</h1>
        <p className="text-[#64748B] mb-8">Transfer funds to another LONDWAYFOND account</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { num: 1, label: "Recipient" },
            { num: 2, label: "Amount" },
            { num: 3, label: "Complete" }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s.num 
                  ? 'bg-[#C9A227] text-[#0A1628]' 
                  : 'bg-[#E2E8F0] text-[#64748B]'
              }`}>
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className={`ml-2 hidden sm:inline ${step >= s.num ? 'text-[#0A1628]' : 'text-[#64748B]'}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                  step > s.num ? 'bg-[#C9A227]' : 'bg-[#E2E8F0]'
                }`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" data-testid="send-error">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Find Recipient */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-[#C9A227]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A1628]">Find Recipient</h2>
                <p className="text-[#64748B] text-sm">Enter the account number</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] font-mono"
                  placeholder="LWF1234567890"
                  data-testid="recipient-account-input"
                />
              </div>

              <button
                onClick={lookupAccount}
                disabled={searchLoading || !accountNumber}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                data-testid="search-recipient-btn"
              >
                {searchLoading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    Search Account <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && recipient && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
            {/* Recipient Card */}
            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0A1628] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0A1628]">{recipient.name}</p>
                <p className="text-[#64748B] text-sm font-mono">{recipient.account_number}</p>
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="ml-auto text-[#C9A227] text-sm hover:underline"
              >
                Change
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] text-xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] text-2xl font-mono"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    data-testid="amount-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="What's this for?"
                  data-testid="description-input"
                />
              </div>

              <button
                onClick={handleTransfer}
                disabled={loading || !amount}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                data-testid="send-money-btn"
              >
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send {amount ? formatCurrency(parseFloat(amount)) : 'Money'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && success && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#0A1628] mb-2">
              Transfer Successful!
            </h2>
            <p className="text-[#64748B] mb-6">
              You've sent {formatCurrency(success.amount)} to {success.recipient}
            </p>
            
            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6">
              <p className="text-sm text-[#64748B]">Transaction ID</p>
              <p className="font-mono text-[#0A1628]">{success.transaction_id}</p>
            </div>

            <button
              onClick={resetForm}
              className="btn-secondary"
              data-testid="new-transfer-btn"
            >
              Make Another Transfer
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
