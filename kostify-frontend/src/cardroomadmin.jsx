import React, { useState } from 'react';
import './cardroomadmin.css';


const CardRoomAdmin = () => {
  const [roomData, setRoomData] = useState({
    name: "Standard Room",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod...",
    price: 950000,
    contact: "0812-5624-5862",
    facilities: "AC, WiFi, TV, Bathroom, Work Desk",
    image: "room-image.jpg"
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated data to your backend
    console.log("Data saved:", roomData);
  };

  const handleDelete = () => {
    // Handle delete logic here
    if (window.confirm("Are you sure you want to delete this room?")) {
      console.log("Room deleted");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to your server
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-room-container">
      <div className="admin-header">
        <h1>Admin Panel - Room Management</h1>
        <div className="admin-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Room</button>
          )}
          <button className="delete-btn" onClick={handleDelete}>Delete Room</button>
        </div>
      </div>

      <div className="room-content">
        <div className="image-section">
          <img 
            src={roomData.image} 
            alt="Room" 
            className="room-image"
          />
          {isEditing && (
            <div className="image-upload">
              <label htmlFor="room-image-upload">Change Image:</label>
              <input 
                id="room-image-upload"
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        <div className="details-section">
          {isEditing ? (
            <>
              <div className="form-group">
                <label>Room Name:</label>
                <input
                  type="text"
                  name="name"
                  value={roomData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={roomData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Facilities:</label>
                <textarea
                  name="facilities"
                  value={roomData.facilities}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Price (per month):</label>
                <input
                  type="number"
                  name="price"
                  value={roomData.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Contact Number:</label>
                <input
                  type="text"
                  name="contact"
                  value={roomData.contact}
                  onChange={handleInputChange}
                />
              </div>
            </>
          ) : (
            <>
              <h2>{roomData.name}</h2>
              <p className="description">{roomData.description}</p>
              
              <div className="facilities">
                <h3>Facilities</h3>
                <p>{roomData.facilities}</p>
              </div>
              
              <div className="booking-info">
                <h3>Booking Information</h3>
                <p className="price">Rp. {roomData.price.toLocaleString()}/month</p>
                <p>Contact: {roomData.contact}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardRoomAdmin;