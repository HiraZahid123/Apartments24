import React from 'react';

export default function CountryFlag({ countryCode, className = "" }) {
    if (!countryCode) return null;

    // Convert to lowercase for flagcdn
    const code = countryCode.toLowerCase();

    return (
        <img
            src={`https://flagcdn.com/w40/${code}.png`}
            srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
            width="20"
            alt={countryCode}
            className={`inline-block mr-2 border border-gray-200 rounded-sm ${className}`}
        />
    );
}
