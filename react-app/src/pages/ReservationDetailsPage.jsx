import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/details.css';

const ReservationDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  const urlEmail = searchParams.get('email');
  const urlToken = searchParams.get('token');

  const fetchReservation = async (emailToUse, tokenToUse) => {
    setError('');
    setCancelMessage('');
    setReservation(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/reservations/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: emailToUse, token: tokenToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Greška prilikom dohvatanja rezervacije.');
      } else {
        setReservation(data);
      }
    } catch (err) {
      console.error(err);
      setError('Greška u komunikaciji sa serverom.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    setError('');
    setCancelMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCancelMessage(data.message || data.error || 'Greška prilikom otkazivanja rezervacije.');
      } else {
        setReservation((prev) => ({ ...prev, status: 'otkazano' }));
        setCancelMessage(data.message || 'Rezervacija je uspešno otkazana.');
      }
    } catch (err) {
      console.error(err);
      setCancelMessage('Greška u komunikaciji sa serverom.');
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  useEffect(() => {
    if (urlEmail && urlToken) {
      fetchReservation(urlEmail, urlToken);
      setEmail(urlEmail);
      setToken(urlToken);
    }
  }, [urlEmail, urlToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReservation(email.trim(), token.trim());
  };

  return (
    <div className="reservation-details-container">
      <h1>Detalji rezervacije</h1>

      {loading && <p className="loading">Učitavanje...</p>}

      {!reservation && !loading && (
        <form onSubmit={handleSubmit} className="reservation-form" noValidate>
          <input
            id="email"
            type="email"
            placeholder="Unesite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            id="token"
            type="text"
            placeholder="Unesite token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            maxLength={6}
            autoComplete="off"
            pattern="[A-Za-z0-9]{6}"
            title="Token mora imati 6 karaktera (slova i brojevi)"
          />

          <button type="submit" aria-label="Prikaži detalje rezervacije">
            Prikaži detalje
          </button>
        </form>
      )}

      {error && <p className="error">{error}</p>}

      {reservation && (
        <div className="reservation-summary">
          <h2>{reservation.client?.first_name} {reservation.client?.last_name}</h2>
          <p>Token: <strong>{reservation.token}</strong></p>
          <p>Promo kod: <strong>{reservation.generated_promo_code}</strong></p>
          <p>Status rezervacije: <strong>{reservation.status}</strong></p>
          <p>Ukupna cena: <strong>{reservation.total_price} RSD</strong></p>

          <h3>Rezervisane usluge:</h3>
          <ul>
            {reservation.items && reservation.items.length > 0 ? (
              reservation.items.map((item) => (
                <li key={item.item_id}>
                  {item.service
                    ? `${item.service.name} — ${
                        new Date(item.scheduled_at).toLocaleDateString('sr-RS', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\./g, '.')}
                        , ${
                        new Date(item.scheduled_at).toLocaleTimeString('sr-RS', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      `
                    : `Nepoznata usluga — ${
                        new Date(item.scheduled_at).toLocaleDateString('sr-RS', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).replace(/\./g, '.') + '.'}
                        , ${
                        new Date(item.scheduled_at).toLocaleTimeString('sr-RS', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      `}
                </li>
              ))
            ) : (
              <li>Nema rezervisanih usluga.</li>
            )}
          </ul>

          <p> <strong>Ukupno dugovanje:</strong> {reservation.client.total_debt.toFixed(2)} RSD </p>


          <div className="button-wrapper">
            {reservation.status !== 'otkazano' && (
              <button onClick={() => setShowConfirmDialog(true)}>Otkaži rezervaciju</button>
            )}
          </div>

          {showConfirmDialog && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Da li ste sigurni da želite da otkažete rezervaciju?</p>
                <div className="modal-buttons">
                  <button onClick={handleCancelReservation}>Da</button>
                  <button onClick={() => setShowConfirmDialog(false)}>Ne</button>
                </div>
              </div>
            </div>
          )}

          {cancelMessage && (
            <p
              className={`message ${
                reservation?.status === 'cancelled' ? 'success' : 'error'
              }`}
            >
              {cancelMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationDetailsPage;
