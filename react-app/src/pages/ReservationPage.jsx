import React, { useState, useEffect } from 'react';
import '../styles/reservations.css';
import { useNavigate } from 'react-router-dom';


const ReservationPage = () => {
  const [services, setServices] = useState([]);
  const [client, setClient] = useState({ email: '', firstName: '', lastName: '' });
  const [items, setItems] = useState([{ serviceId: '', date: '', time: '' }]);
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0); 
  const navigate = useNavigate();


  useEffect(() => {
    fetch('http://localhost:8000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Greška prilikom dohvatanja usluga:', err));
  }, []);

  useEffect(() => {
    let sum = 0;
    for (let item of items) {
      const service = services.find(s => s.service_id === Number(item.serviceId));
      if (service) sum += parseFloat(service.price);
    }
    setTotalPrice(sum);
    setDiscountPercent(0);
    setFinalPrice(sum);
    setMessage('');
  }, [items, services]);

  const addItem = () => {
    setItems([...items, { serviceId: '', date: '', time: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handlePromoCodeChange = (code) => {
    setPromoCode(code);
    setDiscountPercent(0);
    setFinalPrice(totalPrice);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client.email || !client.firstName || !client.lastName) {
      setMessage('Molimo popunite sva polja klijenta.');
      return;
    }

    for (let item of items) {
      if (!item.serviceId || !item.date || !item.time) {
        setMessage('Molimo popunite sve informacije o uslugama.');
        return;
      }

      const selectedDateTime = new Date(`${item.date}T${item.time}:00`);
      const now = new Date();

        if (selectedDateTime < now) {
            setMessage('Nije moguće rezervisati termin u prošlosti.');
            return;
        }
    
        }

    const formattedItems = items.map(item => ({
      service_id: Number(item.serviceId),
      scheduled_at: `${item.date} ${item.time}:00`
    }));

    const payload = {
      email: client.email,
      first_name: client.firstName,
      last_name: client.lastName,
      services: formattedItems,
      promo_code: promoCode.length > 0 ? promoCode : null,
    };

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
            const messages = Object.values(data.errors).flat().join('\n');
            setMessage(messages);
        } else if (data.error) {
            setMessage(data.error); 
        } else {
            setMessage('Greška pri čuvanju rezervacije.');
        }
        return;
    }


      if (data.discountPercent !== undefined) setDiscountPercent(data.discountPercent);
      if (data.totalPrice !== undefined) setFinalPrice(data.totalPrice);

      setMessage(`Uspešna rezervacija! Vaš token je: ${data.reservation_token}`);
      navigate(`/reservation/details?email=${client.email}&token=${data.reservation_token}`);
    } catch (error) {
      console.error('Greška:', error);
      setMessage('Došlo je do greške pri slanju zahteva.');
    }
  };

  return (
    <div className="reservation-container">
      <h1>Rezervacija termina</h1>
      {message && <p className="message">{message}</p>}
      <form className="reservation-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ime"
          value={client.firstName}
          onChange={e => setClient({ ...client, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Prezime"
          value={client.lastName}
          onChange={e => setClient({ ...client, lastName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={client.email}
          onChange={e => setClient({ ...client, email: e.target.value })}
          required
        />

        {items.map((item, index) => (
          <div key={index} className="service-entry">
            <select
              value={item.serviceId}
              onChange={e => updateItem(index, 'serviceId', e.target.value)}
              required
            >
              <option value="">Izaberi uslugu</option>
              {services.map(service => {
                const priceNum = Number(service.price);
                const price = !isNaN(priceNum) ? priceNum.toFixed(2) : '0.00';

                return (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name} — {price} RSD
                  </option>
                );
              })}
            </select>

            <input
              type="date"
              value={item.date}
              onChange={e => updateItem(index, 'date', e.target.value)}
              required
            />

            <select
              value={item.time}
              onChange={e => updateItem(index, 'time', e.target.value)}
              required
            >
              <option value="">Izaberite vreme</option>
              {[...Array(10).keys()].map(h => {
                const hour = 9 + h;
                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <option key={timeStr} value={timeStr}>
                    {timeStr}
                  </option>
                );
              })}
            </select>

            {items.length > 1 && (
              <button
                type="button"
                className="remove-service-btn"
                onClick={() => removeItem(index)}
              >
                Ukloni
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addItem} className="add-service-btn">
          Dodaj uslugu
        </button>

        <input
          type="text"
          placeholder="Promo kod (opciono)"
          value={promoCode}
          onChange={e => handlePromoCodeChange(e.target.value)}
        />

        <div className="total-price">
          Ukupna cena: <strong>{totalPrice.toFixed(2)} RSD</strong>
          {discountPercent > 0 && (
            <>
              <br />
              Popust: <strong>{discountPercent}%</strong><br />
              Cena nakon popusta: <strong>{finalPrice.toFixed(2)} RSD</strong>
            </>
          )}
        </div>

        <button type="submit">Rezerviši</button>
      </form>
    </div>
  );
};

export default ReservationPage;
