You May Notice that there are sections that exist that are not covered by this list
for example a lot of lots that have an A after them 

You should run this query to see theese where the pixel cords are NULL and add some 

select lot.number as lot, section.name as section, lot.descriptor, lot.x_pixel_cord, lot.y_pixel_cord
from lot join section on lot.section = section.sid
order by section.name, lot.number 
