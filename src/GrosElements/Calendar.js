import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fonction pour obtenir le mois et l'année actuels
  const getMonthYear = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return { month, year };
  };

  // Fonction pour générer les jours du mois
  const generateDays = () => {
    const { month, year } = getMonthYear();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = [];
    const firstDay = firstDayOfMonth.getDay(); // Jour de la semaine du 1er jour du mois
    const lastDate = lastDayOfMonth.getDate(); // Dernier jour du mois

    // Remplir les jours du mois
    for (let i = 0; i < firstDay; i++) {
      daysInMonth.push(null); // Remplir avant le 1er jour du mois avec null
    }

    for (let i = 1; i <= lastDate; i++) {
      daysInMonth.push(i); // Ajouter les jours du mois
    }

    return daysInMonth;
  };

  // Fonction pour changer de mois
  const changeMonth = (direction) => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + direction)));
  };

  const days = generateDays();

  return (
    <div className="calendar">
      <header>
        <button onClick={() => changeMonth(-1)}>Précédent</button>
        <h2>{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => changeMonth(1)}>Suivant</button>
      </header>
      <div className="days-of-week">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mer</span>
        <span>Jeu</span>
        <span>Ven</span>
        <span>Sam</span>
        <span>Dim</span>
      </div>
      <div className="days-grid">
        {days.map((day, index) => (
          <div key={index} className={`day ${day ? '' : 'empty'}`}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;