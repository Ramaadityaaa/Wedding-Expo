import React from 'react';

const PackagePage = ({ vendorData }) => {
  const packages = vendorData.packages;

  return (
    <div>
      <h1>Paket Harga</h1>
      <div>
        {packages.map((pkg) => (
          <div key={pkg.id}>
            <h3>{pkg.name}</h3>
            <p>{pkg.price}</p>
            <p>{pkg.services}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagePage;
