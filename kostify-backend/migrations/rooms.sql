-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked'))
);

-- Insert sample data
INSERT INTO rooms (name, price, description, status) VALUES 
('Ruangan 1', 500000, 'Kamar nyaman dengan fasilitas lengkap', 'available'),
('Ruangan 2', 600000, 'Kamar luas dengan pemandangan indah', 'booked'),
('Ruangan 3', 450000, 'Kamar ekonomis dengan fasilitas standar', 'available'); 