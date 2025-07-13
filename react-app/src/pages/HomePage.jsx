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
            besprekoran izgled vaših noktiju - bilo da birate klasičan manikir, gel, akrilne nokte ili tretmane za oštećene
            nokte. Naši iskusni stručnjaci posvećuju pažnju svakom detalju, prilagođavajući tretman vašim individualnim potrebama.
          </p>
          <p>
            U prijatnom ambijentu i uz personalizovanu uslugu, želimo da svaki trenutak u našem salonu bude pravo iskustvo relaksacije i lepote. 
            Posetite nas i prepustite se sigurnim rukama profesionalaca koji brinu o vašem izgledu i dobrom osećaju.
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
