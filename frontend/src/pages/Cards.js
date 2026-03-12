import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { CreditCard, Plus, Snowflake, Trash2, Play, AlertCircle, X, Wifi, Eye, EyeOff, Copy, Check } from "lucide-react";

export default function Cards() {
  const { user, token } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showCVV, setShowCVV] = useState({});
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${API}/cards`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(response.data);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCard = async () => {
    setCreating(true);
    setError("");

    try {
      await axios.post(`${API}/cards`, {
        card_type: "virtual",
        card_name: "Virtual Card"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCards();
      setShowCreateModal(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create card");
    } finally {
      setCreating(false);
    }
  };

  const freezeCard = async (cardId) => {
    try {
      await axios.put(`${API}/cards/${cardId}/freeze`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCards();
    } catch (error) {
      console.error("Error freezing card:", error);
    }
  };

  const activateCard = async (cardId) => {
    try {
      await axios.put(`${API}/cards/${cardId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCards();
    } catch (error) {
      console.error("Error activating card:", error);
    }
  };

  const deleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    
    try {
      await axios.delete(`${API}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const copyToClipboard = async (text, cardId) => {
    await navigator.clipboard.writeText(text);
    setCopied(cardId);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in" data-testid="cards-page">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0C0F1A] mb-2">Virtual Cards</h1>
            <p className="text-neutral-500">Manage your virtual cards for secure payments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="create-card-btn"
          >
            <Plus className="w-5 h-5" />
            New Card
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        ) : cards.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              <CreditCard className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="font-semibold text-[#0C0F1A] mb-2 text-xl">No Cards Yet</h3>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              Create your first virtual card to start making secure online purchases
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={card.id} className="space-y-4" data-testid={`card-${index}`}>
                {/* Card Visual */}
                <div className={`virtual-card relative ${index % 2 === 0 ? '' : 'virtual-card-gold'}`}>
                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-auto">
                      <div className="font-display font-bold text-lg">
                        <span className={index % 2 === 0 ? 'text-white' : 'text-[#0C0F1A]'}>Londway</span>
                        <span className={index % 2 === 0 ? 'text-[#D4A853]' : 'text-[#0C0F1A]'}>Fond</span>
                      </div>
                      <Wifi className={`w-6 h-6 rotate-90 ${index % 2 === 0 ? 'text-white/50' : 'text-[#0C0F1A]/50'}`} />
                    </div>
                    
                    <div className="card-chip my-4" />
                    
                    <div className="flex items-center gap-2 mb-4">
                      <p className={`font-mono text-lg tracking-[0.2em] ${index % 2 === 0 ? 'text-white' : 'text-[#0C0F1A]'}`}>
                        {formatCardNumber(card.card_number)}
                      </p>
                      <button 
                        onClick={() => copyToClipboard(card.card_number, card.id)}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${index % 2 === 0 ? 'text-white/70' : 'text-[#0C0F1A]/70'}`}
                      >
                        {copied === card.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className={`text-[10px] uppercase tracking-wider mb-1 ${index % 2 === 0 ? 'text-white/50' : 'text-[#0C0F1A]/50'}`}>Card Holder</p>
                        <p className={`font-medium text-sm ${index % 2 === 0 ? 'text-white' : 'text-[#0C0F1A]'}`}>{card.card_holder}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-[10px] uppercase tracking-wider mb-1 ${index % 2 === 0 ? 'text-white/50' : 'text-[#0C0F1A]/50'}`}>Expires</p>
                        <p className={`font-mono ${index % 2 === 0 ? 'text-white' : 'text-[#0C0F1A]'}`}>{card.expiry_date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Frozen Overlay */}
                  {card.status === 'frozen' && (
                    <div className="absolute inset-0 bg-blue-900/90 rounded-[20px] flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/20 flex items-center justify-center mb-3">
                        <Snowflake className="w-8 h-8 text-blue-300" />
                      </div>
                      <p className="text-blue-200 font-semibold text-lg">Card Frozen</p>
                      <p className="text-blue-300/70 text-sm">Activate to use</p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 text-sm">CVV:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0C0F1A]">
                          {showCVV[card.id] ? card.cvv : '•••'}
                        </span>
                        <button 
                          onClick={() => setShowCVV({...showCVV, [card.id]: !showCVV[card.id]})}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          {showCVV[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-500 text-sm">Limit: </span>
                      <span className="font-mono font-semibold text-[#0C0F1A]">
                        ${card.spending_limit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {card.status === 'frozen' ? (
                      <button
                        onClick={() => activateCard(card.id)}
                        className="flex-1 py-2.5 px-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-emerald-100 transition-colors"
                        data-testid={`activate-card-${index}`}
                      >
                        <Play className="w-4 h-4" />
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => freezeCard(card.id)}
                        className="flex-1 py-2.5 px-4 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-blue-100 transition-colors"
                        data-testid={`freeze-card-${index}`}
                      >
                        <Snowflake className="w-4 h-4" />
                        Freeze
                      </button>
                    )}
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="py-2.5 px-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                      data-testid={`delete-card-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Card Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md animate-scale-in" data-testid="create-card-modal">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-[#0C0F1A]" />
                </div>
                <h2 className="text-2xl font-display font-bold text-[#0C0F1A]">Create Virtual Card</h2>
                <p className="text-neutral-500 mt-2">Instant virtual card for secure online purchases</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-3 mb-8 p-5 bg-neutral-50 rounded-2xl">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Card Type</span>
                  <span className="font-semibold text-[#0C0F1A]">Virtual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Spending Limit</span>
                  <span className="font-semibold text-[#0C0F1A]">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Validity</span>
                  <span className="font-semibold text-[#0C0F1A]">3 Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Card Fee</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
              </div>

              <button
                onClick={createCard}
                disabled={creating}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
                data-testid="confirm-create-card"
              >
                {creating ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Card
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
