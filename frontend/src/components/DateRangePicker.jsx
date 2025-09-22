import React from 'react';

const DateRangePicker = ({ startDate, endDate, onChange }) => (
  <div>
    <input
      type="date"
      value={startDate || ''}
      onChange={(e) => onChange({ startDate: e.target.value })}
    />
    <input
      type="date"
      value={endDate || ''}
      onChange={(e) => onChange({ endDate: e.target.value })}
    />
  </div>
);

export default DateRangePicker;
