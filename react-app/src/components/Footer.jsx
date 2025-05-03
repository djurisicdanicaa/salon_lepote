import React from 'react';
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className='footer'>
            <div className="footer-left">
                <div className="footer-item">
                    <CiLocationOn className="footer-icon" />
                    <span>Zdravka Čelara 15, Beograd</span>
                </div>
                <div className="footer-item">
                    <CiPhone className="footer-icon" />
                    <span>+381 64 123 4567</span>
                </div>
                <div className="footer-item">
                    <MdOutlineEmail className="footer-icon" />
                    <span>info@fontasticninokti.rs</span>
                </div>
            </div>

            <div className="footer-map">
                <iframe
                    title="Lokacija salona"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.3781247972245!2d20.46803611552993!3d44.81540397909807!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a705ad52be521%3A0x9c4a7eb6b08b8589!2sZdravka%20%C4%8Celara%2C%20Beograd!5e0!3m2!1sen!2srs!4v1616437823134!5m2!1sen!2srs"
                    height="400"
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </footer>
    );
};

export default Footer;
