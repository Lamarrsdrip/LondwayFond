import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { Send, Search, ArrowRight, CheckCircle, AlertCircle, User, Globe, Building2 } from "lucide-react";

export default function SendMoney() {
  const { token, refreshUser } = useAuth();
  const [transferType, setTransferType] = useState(null); // 'local' or 'international'
  const [step, setStep] = useState(0); // 0 = select type, 1 = recipient, 2 = amount, 3 = complete
  const [recipient, setRecipient] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // International transfer fields
  const [internationalDetails, setInternationalDetails] = useState({
    bankName: "",
    swiftCode: "",
    recipientName: "",
    recipientAddress: "",
    country: ""
  });

  const selectTransferType = (type) => {
    setTransferType(type);
    setStep(1);
    setError("");
  };

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

  const proceedInternational = () => {
    if (!internationalDetails.bankName || !internationalDetails.swiftCode || 
        !internationalDetails.recipientName || !internationalDetails.country || !accountNumber) {
      setError("Please fill in all required fields");
      return;
    }
    setRecipient({
      name: internationalDetails.recipientName,
      account_number: accountNumber,
      bank: internationalDetails.bankName,
      country: internationalDetails.country
    });
    setStep(2);
    setError("");
  };

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    if (transferType === 'local') {
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
    } else {
      // International transfer - simulated (would need real SWIFT integration)
      setTimeout(async () => {
        setSuccess({
          transaction_id: `INT-${Date.now()}`,
          amount: parseFloat(amount),
          recipient: internationalDetails.recipientName,
          bank: internationalDetails.bankName,
          country: internationalDetails.country,
          status: "Processing",
          note: "International transfers typically take 2-5 business days"
        });
        setStep(3);
        setLoading(false);
      }, 2000);
    }
  };

  const resetForm = () => {
    setTransferType(null);
    setStep(0);
    setRecipient(null);
    setAccountNumber("");
    setAmount("");
    setDescription("");
    setError("");
    setSuccess(null);
    setInternationalDetails({
      bankName: "",
      swiftCode: "",
      recipientName: "",
      recipientAddress: "",
      country: ""
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStepLabel = () => {
    if (step === 0) return "Select Type";
    if (step === 1) return "Recipient";
    if (step === 2) return "Amount";
    return "Complete";
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto" data-testid="send-money-page">
        <h1 className="font-display text-3xl font-bold text-[#0A1628] mb-2">Send Money</h1>
        <p className="text-[#64748B] mb-8">Transfer funds locally or internationally</p>

        {/* Progress Steps */}
        {step > 0 && (
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
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700" data-testid="send-error">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Step 0: Select Transfer Type */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => selectTransferType('local')}
              className="bg-white rounded-xl border-2 border-[#E2E8F0] p-8 hover:border-[#C9A227] transition-all group text-left"
              data-testid="local-transfer-btn"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-[#C9A227] transition-colors">
                <Building2 className="w-8 h-8 text-blue-600 group-hover:text-[#0A1628] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1628] mb-2">Local Transfer</h3>
              <p className="text-[#64748B]">
                Transfer to other LondwayFond Bank accounts instantly with zero fees
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#C9A227] font-medium">
                <span>Instant</span>
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Free</span>
              </div>
            </button>

            <button
              onClick={() => selectTransferType('international')}
              className="bg-white rounded-xl border-2 border-[#E2E8F0] p-8 hover:border-[#C9A227] transition-all group text-left"
              data-testid="international-transfer-btn"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-[#C9A227] transition-colors">
                <Globe className="w-8 h-8 text-purple-600 group-hover:text-[#0A1628] transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0A1628] mb-2">International Transfer</h3>
              <p className="text-[#64748B]">
                Send money to any bank worldwide via SWIFT network
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#C9A227] font-medium">
                <span>2-5 Business Days</span>
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Fees Apply</span>
              </div>
            </button>
          </div>
        )}

        {/* Step 1: Find Recipient - Local */}
        {step === 1 && transferType === 'local' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A1628]">Local Transfer</h2>
                <p className="text-[#64748B] text-sm">Enter LondwayFond account number</p>
              </div>
              <button onClick={resetForm} className="ml-auto text-[#64748B] hover:text-[#0A1628] text-sm">
                Change type
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] font-mono"
                  placeholder="Enter 12-digit account number"
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

        {/* Step 1: Enter Details - International */}
        {step === 1 && transferType === 'international' && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A1628]">International Transfer</h2>
                <p className="text-[#64748B] text-sm">Enter recipient bank details</p>
              </div>
              <button onClick={resetForm} className="ml-auto text-[#64748B] hover:text-[#0A1628] text-sm">
                Change type
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A1628] mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={internationalDetails.recipientName}
                    onChange={(e) => setInternationalDetails({...internationalDetails, recipientName: e.target.value})}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                    placeholder="Full name"
                    data-testid="intl-recipient-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A1628] mb-2">
                    Country *
                  </label>
                  <select
                    value={internationalDetails.country}
                    onChange={(e) => setInternationalDetails({...internationalDetails, country: e.target.value})}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                    data-testid="intl-country"
                  >
                    <option value="">Select country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                    <option value="China">China</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={internationalDetails.bankName}
                  onChange={(e) => setInternationalDetails({...internationalDetails, bankName: e.target.value})}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="e.g., Bank of America, HSBC"
                  data-testid="intl-bank-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A1628] mb-2">
                    SWIFT/BIC Code *
                  </label>
                  <input
                    type="text"
                    value={internationalDetails.swiftCode}
                    onChange={(e) => setInternationalDetails({...internationalDetails, swiftCode: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] font-mono uppercase"
                    placeholder="e.g., BOFAUS3N"
                    data-testid="intl-swift"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A1628] mb-2">
                    Account Number/IBAN *
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] font-mono"
                    placeholder="Account or IBAN"
                    data-testid="intl-account"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A1628] mb-2">
                  Recipient Address (Optional)
                </label>
                <input
                  type="text"
                  value={internationalDetails.recipientAddress}
                  onChange={(e) => setInternationalDetails({...internationalDetails, recipientAddress: e.target.value})}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227]"
                  placeholder="Street address, city"
                  data-testid="intl-address"
                />
              </div>

              <button
                onClick={proceedInternational}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                data-testid="proceed-intl-btn"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 2 && recipient && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8">
            {/* Recipient Card */}
            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                transferType === 'local' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {transferType === 'local' ? (
                  <User className="w-6 h-6 text-blue-600" />
                ) : (
                  <Globe className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#0A1628]">{recipient.name}</p>
                <p className="text-[#64748B] text-sm font-mono">{recipient.account_number}</p>
                {transferType === 'international' && (
                  <p className="text-[#64748B] text-xs">{recipient.bank}, {recipient.country}</p>
                )}
              </div>
              <button 
                onClick={() => setStep(1)} 
                className="text-[#C9A227] text-sm hover:underline"
              >
                Change
              </button>
            </div>

            {/* Fee Notice for International */}
            {transferType === 'international' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>International Transfer Fee:</strong> $25.00 flat fee + 0.5% of transfer amount
                </p>
              </div>
            )}

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
                {transferType === 'international' && amount && parseFloat(amount) > 0 && (
                  <p className="text-sm text-[#64748B] mt-2">
                    Total with fees: {formatCurrency(parseFloat(amount) + 25 + (parseFloat(amount) * 0.005))}
                  </p>
                )}
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
              {transferType === 'local' ? 'Transfer Successful!' : 'Transfer Initiated!'}
            </h2>
            <p className="text-[#64748B] mb-6">
              {transferType === 'local' 
                ? `You've sent ${formatCurrency(success.amount)} to ${success.recipient}`
                : `Your international transfer of ${formatCurrency(success.amount)} is being processed`
              }
            </p>
            
            <div className="bg-[#F8F9FA] rounded-lg p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-[#64748B]">Transaction ID</span>
                <span className="font-mono text-[#0A1628] text-sm">{success.transaction_id}</span>
              </div>
              {transferType === 'international' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#64748B]">Status</span>
                    <span className="text-yellow-600 font-medium text-sm">{success.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#64748B]">Estimated Arrival</span>
                    <span className="text-[#0A1628] text-sm">2-5 Business Days</span>
                  </div>
                </>
              )}
            </div>

            {transferType === 'international' && success.note && (
              <p className="text-sm text-[#64748B] mb-6">{success.note}</p>
            )}

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
