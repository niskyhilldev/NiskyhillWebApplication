CREATE TABLE map_coordinates(
    mcid SERIAL NOT NULL,
    section_name VARCHAR(16) NOT NULL,
    lot_number VARCHAR(16) NOT NULL,
    x_pixel_cord NUMERIC, -- pixel cordinate on map
    y_pixel_cord NUMERIC,

    PRIMARY KEY (mcid),
    UNIQUE (section_name, lot_number)
);

-- Note:  This table is a tempory redundancy, while we do have tables to store the lots and the sections,
--        that data was entered with an AI Scanning tool and has many unknown errors.  The map pixel cords
--        were manually entered and are 100% correct.  Therefore in order to ensure all plots are mapped 
--        this table is introduced