CREATE TABLE plot(
  plot_id SERIAL, -- auto incrimented id
  marker BOOLEAN DEFAULT FALSE,
  foundation BOOLEAN DEFAULT FALSE,
  internment_record TEXT, -- for an encoded file
  lot INT NOT NULL,


  FOREIGN KEY (lot) REFERENCES lot(lot_id) ON DELETE CASCADE,
  PRIMARY KEY(plot_id) 
);

