import React, { useState } from 'react';

const ProfilePage = ({ vendorData }) => {
  const [profile, setProfile] = useState(vendorData.profile);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const saveProfile = () => {
    // Simulasi fungsi penyimpanan data profil
    console.log('Simpan Profil:', profile);
  };

  return (
    <div>
      <h1>Edit Profil Vendor</h1>
      <div>
        <label htmlFor="vendorName">Nama Vendor</label>
        <input
          type="text"
          id="vendorName"
          value={profile.vendorName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          value={profile.description}
          onChange={handleChange}
        />
      </div>
      <button onClick={saveProfile}>Simpan Profil</button>
    </div>
  );
};

export default ProfilePage;
