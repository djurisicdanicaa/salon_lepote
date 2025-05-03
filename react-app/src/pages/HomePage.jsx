import React, { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import '../styles/styles.css'; 

const HomePage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error('Greška pri dohvatanju usluga:', err));
  }, []);

  return (
    <div>
      <section className="background-section">
        <div className="salon-info-content">
          <h2>DOBRODOŠLI U NAŠ SALON</h2>
          <p>
            U našem salonu pružamo vrhunske tretmane za negu ruku i stopala. Naša misija je da vas opustimo i obezbedimo
            savršen izgled vaših noktiju, bilo da želite klasičan manikir, gel manikir, akrilne nokte, ili specijalizovane tretmane za oštećene
            nokte. Naši stručnjaci će se pobrinuti da svaki tretman bude prilagođen vašim potrebama.
          </p>
          <p>
            Uz prijatan ambijent i personalizovanu uslugu, cilj nam je da svaki trenutak proveden u našem salonu bude prijatan i relaksirajuć. 
            Posetite nas i prepustite se stručnim rukama naših profesionalaca. 
          </p>
        </div>
      </section>

      <div style={{ padding: '40px 20px' }}>
      <h2 className="section-title">NAŠE USLUGE</h2>

        <div className="service-container">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
