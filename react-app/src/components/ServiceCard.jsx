import React from 'react';
import '../styles/styles.css'; 

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card"> 
      <img src={service.image} alt={service.name} className="service-image" /> 
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p><strong>Cena:</strong> {service.price} RSD</p>
      <p><strong>Kapacitet:</strong> {service.capacity} osoba</p>
    </div>
  );
};

export default ServiceCard;
