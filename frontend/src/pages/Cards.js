import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth, API } from "@/App";
import axios from "axios";
import { CreditCard, Plus, Snowflake, Trash2, Play, AlertCircle, X, Wifi } from "lucide-react";

export default function Cards() {
  const { user, token } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

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

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <DashboardLayout>
      <div data-testid="cards-page">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#0A1628]">Cards</h1>
            <p className="text-[#64748B]">Manage your virtual cards</p>
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
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : cards.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-[#E2E8F0]" />
            <h3 className="text-lg font-semibold text-[#0A1628] mb-2">No Cards Yet</h3>
            <p className="text-[#64748B] mb-6">Create your first virtual card to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Virtual Card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={card.id} className="relative" data-testid={`card-${index}`}>
                {/* Card Visual */}
                <div className={`virtual-card ${index % 2 === 0 ? '' : 'virtual-card-gold'} aspect-[1.586/1]`}>
                  <div className="flex justify-between items-start mb-8">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_question-site/artifacts/4k3lqwwb_WhatsApp%20Image%202026-03-12%20at%2010.33.36.jpeg" 
                      alt="LONDWAYFOND" 
                      className="h-8 w-auto opacity-90"
                    />
                    <Wifi className="w-6 h-6 rotate-90 opacity-70" />
                  </div>
                  
                  <div className="card-chip mb-4" />
                  
                  <p className="font-mono text-lg tracking-wider mb-4">
                    {formatCardNumber(card.card_number)}
                  </p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70 mb-0.5">CARD HOLDER</p>
                      <p className="font-semibold text-sm">{card.card_holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70 mb-0.5">EXPIRES</p>
                      <p className="font-mono">{card.expiry_date}</p>
                    </div>
                  </div>

                  {card.status === 'frozen' && (
                    <div className="absolute inset-0 bg-blue-900/80 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <Snowflake className="w-12 h-12 text-blue-200 mx-auto mb-2" />
                        <p className="text-blue-200 font-semibold">Card Frozen</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-[#64748B]">CVV</p>
                      <p className="font-mono font-semibold text-[#0A1628]">{card.cvv}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#64748B]">Spending Limit</p>
                      <p className="font-mono font-semibold text-[#0A1628]">
                        ${card.spending_limit.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {card.status === 'frozen' ? (
                      <button
                        onClick={() => activateCard(card.id)}
                        className="flex-1 py-2 px-3 bg-green-50 text-green-600 rounded-lg flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                        data-testid={`activate-card-${index}`}
                      >
                        <Play className="w-4 h-4" />
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => freezeCard(card.id)}
                        className="flex-1 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                        data-testid={`freeze-card-${index}`}
                      >
                        <Snowflake className="w-4 h-4" />
                        Freeze
                      </button>
                    )}
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="py-2 px-3 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
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
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
            <div className="relative bg-white rounded-xl p-6 w-full max-w-md" data-testid="create-card-modal">
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-[#64748B] hover:text-[#0A1628]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C9A227]/10 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-[#C9A227]" />
                </div>
                <h2 className="text-xl font-display font-bold text-[#0A1628]">Create Virtual Card</h2>
                <p className="text-[#64748B] text-sm mt-1">Instant virtual card for online purchases</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#64748B]">Card Type</span>
                    <span className="font-medium text-[#0A1628]">Virtual</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[#64748B]">Spending Limit</span>
                    <span className="font-medium text-[#0A1628]">$5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Validity</span>
                    <span className="font-medium text-[#0A1628]">3 Years</span>
                  </div>
                </div>
              </div>

              <button
                onClick={createCard}
                disabled={creating}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
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
