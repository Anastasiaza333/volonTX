import React from 'react';

const RoleSelector = ({ value, onChange }) => {
    return (
        <div className="role-selector">
            <label>Оберіть вашу роль на платформі:</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="role-select">
                <option value="volunteer"> Я Волонтер (шукаю проєкти)</option>
                <option value="organizer"> Я Організатор (створюю проєкти)</option>
            </select>
            <p className="role-hint">
                {value === 'volunteer' 
                    ? "Ви зможете подавати заявки та допомагати іншим." 
                    : "Ви зможете створювати власні ініціативи та керувати волонтерами."}
            </p>
        </div>
    );
};

export default RoleSelector;