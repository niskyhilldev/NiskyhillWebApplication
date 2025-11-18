package moravians.niskyhill.server.database;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.models.Lot;
import moravians.niskyhill.server.models.Resident;
import moravians.niskyhill.server.models.Section;
import moravians.niskyhill.server.models.User;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/** 
 * This class wraps a connection to A database 
 * The JDBC uri string is read through an envirmental variable on Heroku 
 * This is the Respository / Data Layer of the Server
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class Database {
    private Connection connection;

    /**
     * The Database constructor is private: we only create Database objects
     * through one or more static getDatabase() methods.
     */
    private Database() {   }

    /**
     * Method to set the connection in the Database class
     * @return Istanciated Database Object with a connection Null if there was an issue connecting
     */
    public static Database getDatabase() {
        String uri = System.getenv("JDBC_DATABASE_URI");  // Get the database URI from environment variable
        if (uri == null || uri.isEmpty()) {
            System.err.println("\nJDBC_DATABASE_URI environment variable is not set.");
            return null;  // Still returns null if env variable missing
        }

        Database d = new Database();

        try {
            d.connection = DriverManager.getConnection(uri);
            if (d.connection == null) {
                System.err.println("\nCould not connect to Database (null object returned).");
                return null;
            } else {
                System.out.println("\nDatabase connection successful.");
                return d;  // Returns Database object as before
            }
        } catch (SQLException e) {
            System.err.printf("\nError connecting to Database: %s\n", e.getMessage());
            return null;
        }
    }


    /**
     * Method to disconnect from the database
     * 
     * @return true on success, false otherwise
     */
    public boolean disconnect() {
        if (connection != null) {
            try {
                connection.close();

            } catch (SQLException e) {
                System.err.printf("\nError Disconnecting from database: %s\n", e.getMessage());
                return false;
            }

            connection = null;
            return true;
        }
        return false;

    }

    /**
     * Method to get a list of all residents from the database
     * 
     * @return A list of type Resident, an empty list if none found
     * @throws HttpStatusException
     */
    public List<Resident> getAllResidents() throws HttpStatusException {
        final String q = """
            SELECT * 
            FROM 
                (resident JOIN lot ON resident.lot = lot.lid
                JOIN section ON lot.section = section.sid)
                LEFT JOIN map_coordinates ON 
                    (section.name = map_coordinates.section_name and lot.number = map_coordinates.lot_number)
        """;
        
        List<Resident> residents = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Resident resident = new Resident(
                    rs.getLong("rid"),
                    rs.getString("firstname"),
                    rs.getString("middlename"),
                    rs.getString("lastname"),
                    rs.getString("birth_date"),
                    rs.getString("burial_date"),
                    rs.getString("death_date"),
                    rs.getString("capsule"),
                    rs.getBoolean("marker"),
                    rs.getBoolean("foundation"),
                    rs.getBoolean("viewable"),
                    new Lot(
                        rs.getLong("lid"),
                        rs.getString("number"),
                        rs.getString("descriptor"),
                        rs.getString("owner"),
                        rs.getLong("x_pixel_cord"),
                        rs.getLong("y_pixel_cord"),
                        new Section(
                            rs.getLong("sid"),
                            rs.getString("name"),
                            rs.getString("map")
                        )
                    )
                );
                residents.add(resident);
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Residents", e);
        }

        return residents;
    }

    /**
     * Method to get a resident by their ID
     * 
     * @param rid
     * @return A Resident object, Null if not found
     * @throws HttpStatusException
     */
    public Resident getResident(Long rid) throws HttpStatusException {
        
        final String q = """
            SELECT * 
            FROM 
                (resident JOIN lot ON resident.lot = lot.lid
                JOIN section ON lot.section = section.sid)
                LEFT JOIN map_coordinates ON 
                    (section.name = map_coordinates.section_name and lot.number = map_coordinates.lot_number)
            WHERE resident.rid = ?
        """;

        try (PreparedStatement ps = connection.prepareStatement(q)) {
            ps.setLong(1, rid);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return new Resident(
                    rs.getLong("rid"),
                    rs.getString("firstname"),
                    rs.getString("middlename"),
                    rs.getString("lastname"),
                    rs.getString("birth_date"),
                    rs.getString("burial_date"),
                    rs.getString("death_date"),
                    rs.getString("capsule"),
                    rs.getBoolean("marker"),
                    rs.getBoolean("foundation"),
                    rs.getBoolean("viewable"),
                    new Lot(
                        rs.getLong("lid"),
                        rs.getString("number"),
                        rs.getString("descriptor"),
                        rs.getString("owner"),
                        rs.getLong("x_pixel_cord"),
                        rs.getLong("y_pixel_cord"),
                        new Section(
                            rs.getLong("sid"),
                            rs.getString("name"),
                            rs.getString("map")
                        )
                    )
                );
            }else{
                return null;
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Residents", e);
        }
    }

    /**
     * Method to search for Residents by any combination of first, middle, and last name
     * 
     * @param name first and/or middle and/or last name
     * @return A list of residents matching the critera, an empty list if nothing found
     * @throws HttpStatusException
     */
    public List<Resident> searchResidents(String name) throws HttpStatusException {
        final String q = """
            SELECT *
            FROM resident r
                JOIN lot l ON r.lot = l.lid
                JOIN section s ON l.section = s.sid
                LEFT JOIN map_coordinates ON 
                    (s.name = map_coordinates.section_name and l.number = map_coordinates.lot_number)
            WHERE to_tsvector(
                    'simple',
                    COALESCE(r.firstname,'') || ' ' || COALESCE(r.middlename,'') || ' ' || COALESCE(r.lastname,'')
                )
                @@ to_tsquery('simple', ?)
            ORDER BY ts_rank(
                to_tsvector(
                    'simple',
                    COALESCE(r.firstname,'') || ' ' || COALESCE(r.middlename,'') || ' ' || COALESCE(r.lastname,'')
                ),
                to_tsquery('simple', ?)
            ) DESC;
        """;

        List<Resident> residents = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q)) {
            String trimmed = name.trim();

            // Split into words
            String[] words = trimmed.split("\\s+");

            // Build query string: all words joined by AND (&), only last gets :*
            String queryString;
            if (words.length == 1) {
                queryString = words[0] + ":*"; // single word = prefix
            } else {
                String beforeLast = String.join(" & ", Arrays.copyOf(words, words.length - 1));
                String last = words[words.length - 1] + ":*";
                queryString = beforeLast + " & " + last;
            }

            ps.setString(1, queryString);
            ps.setString(2, queryString);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Resident resident = new Resident(
                        rs.getLong("rid"),
                        rs.getString("firstname"),
                        rs.getString("middlename"),
                        rs.getString("lastname"),
                        rs.getString("birth_date"),
                        rs.getString("burial_date"),
                        rs.getString("death_date"),
                        rs.getString("capsule"),
                        rs.getBoolean("marker"),
                        rs.getBoolean("foundation"),
                        rs.getBoolean("viewable"),
                        new Lot(
                            rs.getLong("lid"),
                            rs.getString("number"),
                            rs.getString("descriptor"),
                            rs.getString("owner"),
                            rs.getLong("x_pixel_cord"),
                            rs.getLong("y_pixel_cord"),
                            new Section(
                                rs.getLong("sid"),
                                rs.getString("name"),
                                rs.getString("map")
                            )
                        )
                    );
                    residents.add(resident);
                }
            }
        } catch (SQLException e) {
            System.err.printf("Error executing query: %s%n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to retrieve residents", e);
        }
        return residents;
    }


    /**
     * Gets all lots from the database 
     * 
     * @return List of Lots, emtpy list if nothing found
     * @throws HttpStatusException
     */
    public List<Lot> getAllLots() throws HttpStatusException {
        final String q = """
                        SELECT *
                        FROM 
                            (lot JOIN section ON lot.section = section.sid)
                            LEFT JOIN map_coordinates ON 
                                (section.name = map_coordinates.section_name and lot.number = map_coordinates.lot_number)
                        ORDER BY lot.number;
                """;

        List<Lot> lots = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Lot lot = new Lot(
                    rs.getLong("lid"),
                    rs.getString("number"),
                    rs.getString("descriptor"),
                    rs.getString("owner"),
                    rs.getLong("x_pixel_cord"),
                    rs.getLong("y_pixel_cord"),
                    new Section(
                        rs.getLong("sid"),
                        rs.getString("name"),
                        rs.getString("map")
                    )
                );

                lots.add(lot);
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(500, "Failed to Retrieve Lots", e);
        }

        return lots;
    }

    /**
     * gets all sections from the database 
     * 
     * @return List of type section, empty list if noe found
     * @throws HttpStatusException
     */
    public List<Section> getAllSections() throws HttpStatusException {
        final String q = """
                    SELECT *
                    FROM section
                    ORDER BY name;
                """;

        List<Section> sections = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Section section = new Section(
                    rs.getLong("sid"),
                    rs.getString("name"),
                    rs.getString("map")
                );
                

                sections.add(section);
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Sections", e);
        }

        return sections;
    }

    /**
     * Get a lot by its ID from the database 
     * 
     * @param lid the id of the lot
     * @return A lot object, Null if not found
     * @throws HttpStatusException
     */
    public Lot getLot(Long lid) throws HttpStatusException {
        final String q = """
                        SELECT *
                        FROM 
                            (lot JOIN section ON lot.section = section.sid)
                            LEFT JOIN map_coordinates ON 
                                (section.name = map_coordinates.section_name and lot.number = map_coordinates.lot_number)
                        WHERE lot.lid = ?
                """;


        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setLong(1, lid);

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Lot lot = new Lot(
                    rs.getLong("lid"),
                    rs.getString("number"),
                    rs.getString("descriptor"),
                    rs.getString("owner"),
                    rs.getLong("x_pixel_cord"),
                    rs.getLong("y_pixel_cord"),
                    new Section(
                        rs.getLong("sid"),
                        rs.getString("name"),
                        rs.getString("map")
                    )
                );

                return lot;
            }else {
                return null;
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Lot", e);
        } 

    }

    /**
     * Get a section buy its its id
     * 
     * @param sid the id of the section
     * @return Section object, Null if not found
     * @throws HttpStatusException
     */
    public Section getSection(Long sid) throws HttpStatusException {
        final String q = """
                    SELECT *
                    FROM section
                    WHERE sid = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q); 
            ps.setLong(1, sid);
            
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Section section = new Section(
                    rs.getLong("sid"),
                    rs.getString("name"),
                    rs.getString("map")
                );
                

                return section;
            }else {
                return null;
            }
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Sections", e);
        }
    }

    /**
     * gets lots given a combination of lotNumber and sectionName
     * 
     * @param lotNumber the number assoicated with a lot (ex: 42A)
     * @param sectionName the name associted with a section (ex: #1)
     * @return a List of a Single lot if both lotNumber and sectionName provided
     *         a List of all lots the exist in a given section if only section provided
     *         a List of all Lots that share the same lot number if only lot Number provided
     *         a empty list if nothing found
     * @throws HttpStatusException
     */
    public List<Lot> getLotDetails(String lotNumber, String sectionName) throws HttpStatusException {
        String q = """
                    SELECT *
                    FROM 
                        (lot JOIN section ON lot.section = section.sid)
                        LEFT JOIN map_coordinates ON 
                            (section.name = map_coordinates.section_name and lot.number = map_coordinates.lot_number)
                    WHERE
                """;

        List<Lot> list = new ArrayList<>();

        if (lotNumber == null && sectionName != null){ // get all lots in a section
            q += " section.name = ? ORDER BY section.name";
        }else if (lotNumber != null && sectionName == null){ // get all lots that share a number
            q += " lot.number = ? ORDER BY lot.number";
        } else { // get all lots with the number in the section 
            q += " lot.number = ? AND section.name = ? ORDER BY lot.number, section.name";
        }
        
        try {
            PreparedStatement ps = connection.prepareStatement(q);

            if (lotNumber == null && sectionName != null){
                ps.setString(1, sectionName);
            } else if(lotNumber != null && sectionName == null){
                ps.setString(1, lotNumber);
            }else {
                ps.setString(1, lotNumber);
                ps.setString(2, sectionName);
            }

            ResultSet rs = ps.executeQuery();

            while(rs.next()){
                Lot lot = new Lot(
                    rs.getLong("lid"),
                    rs.getString("number"),
                    rs.getString("descriptor"),
                    rs.getString("owner"),
                    rs.getLong("x_pixel_cord"),
                    rs.getLong("y_pixel_cord"),
                    new Section(
                        rs.getLong("sid"),
                        rs.getString("name"),
                        rs.getString("map")
                    )
                );
                list.add(lot);
            }

            return list;
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Retrieve Lots", e);
        }
    }

    /**
     * Gets all residents that are buried in a lot
     * 
     * @param lid the id of the lot
     * @return a list of residents, an empty list if none exist or the lot does not exist
     * @throws HttpStatusException
     */
    public List<Resident> getLotResidents(Long lid) throws HttpStatusException {
        final String q = """
            SELECT * 
            FROM 
                resident JOIN lot ON resident.lot = lot.lid
                JOIN section ON lot.section = section.sid
            WHERE lot.lid = ?
        """;

        List<Resident> list = new ArrayList<>();

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setLong(1, lid);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Resident resident = new Resident(
                    rs.getLong("rid"),
                    rs.getString("firstname"),
                    rs.getString("middlename"),
                    rs.getString("lastname"),
                    rs.getString("birth_date"),
                    rs.getString("burial_date"),
                    rs.getString("death_date"),
                    rs.getString("capsule"),
                    rs.getBoolean("marker"),
                    rs.getBoolean("foundation"),
                    rs.getBoolean("viewable"),
                    null // dont need the Lot and Section...ect
                    );
                list.add(resident);
            }
            return list;
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Residents in Lot " + lid, e);
        }

    }

    /**
     * update a resident in the database 
     * 
     * @param rid the id of the resident
     * @param firstName 
     * @param middleName
     * @param lastName
     * @param birthDate
     * @param burialDate
     * @param deathDate
     * @param capsule what vessle they are burried in 
     * @param marker if there is a headstone
     * @param foundation if there is a foundation for a headstone 
     * @param publicViewable can it viewed by the public
     * @param lid the id of the lot the resident is burried (or to be burried) in
     * @return true on success, false otherwise
     * @throws HttpStatusException
     */
    public boolean updateResident(Long rid,String firstName,String middleName,String lastName,String birthDate,String burialDate,String deathDate, 
                            String capsule, Boolean marker, Boolean foundation, Boolean publicViewable, Long lid) throws HttpStatusException {
        String q = """
            UPDATE resident
            SET 
                firstname = ?,
                middlename = ?,
                lastname = ?,
                birth_date = ?,
                burial_date = ?,
                death_date = ?,
                capsule = ?,
                marker = ?,
                foundation = ?,
                viewable = ?,
                lot = ?
            WHERE rid = ?
        """;

        try{
            PreparedStatement ps = connection.prepareStatement(q);

        
            ps.setString(1, firstName); // set first name 

            if (middleName != null && !middleName.isBlank()) { // set middle name (nullable)
                ps.setString(2, middleName);
            } else {
                ps.setNull(2, Types.VARCHAR);
            }
            ps.setString(3, lastName); // set last Name 

            if (birthDate != null && !birthDate.isBlank()) { // set birth date (nullable)
                ps.setDate(4, Date.valueOf(birthDate));
            } else {
                ps.setNull(4, Types.DATE);
            }

            if (burialDate != null && !burialDate.isBlank()) { // set burrial date (nullable)
                ps.setDate(5, Date.valueOf(burialDate));
            } else {
                ps.setNull(5, Types.DATE);
            }

            if (deathDate != null && !deathDate.isBlank()) { // set death date (nullable)
                ps.setDate(6, Date.valueOf(deathDate));
            } else {
                ps.setNull(6, Types.DATE);
            }

            if (capsule != null && !capsule.isBlank()) { // set capsule (nullable)
                ps.setString(7, capsule.trim().toLowerCase());
            } else {
                ps.setNull(7, Types.VARCHAR);
            }

            if (marker != null) {// set marker (nullable)
                ps.setBoolean(8, marker);
            } else {
                ps.setNull(8, Types.BOOLEAN);
            }

    
            if (foundation != null) { // set foundation (nullable)
                ps.setBoolean(9, foundation);
            } else {
                ps.setNull(9, Types.BOOLEAN);
            }

    
            if (publicViewable != null) { // set viewable (nullable)
                ps.setBoolean(10, publicViewable);
            } else {
                ps.setNull(10, Types.BOOLEAN);
            }

            ps.setLong(11, lid); // set lot
            ps.setLong(12, rid); // set resident id
            
            if (ps.executeUpdate() < 1){
               return false;
            }
            return true;

        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Update Resident with id " + rid, e);
        }
    }

    /**
     * add a new resident to the database
     * 
     * @param firstName
     * @param middleName
     * @param lastName
     * @param birthDate
     * @param burialDate
     * @param deathDate
     * @param capsule
     * @param marker
     * @param foundation
     * @param publicViewable
     * @param lid
     * @return true if successfull, false otherwise
     * @throws HttpStatusException
     */
    public boolean addNewResident(String firstName,String middleName,String lastName,String birthDate,String burialDate,String deathDate, 
                            String capsule, Boolean marker, Boolean foundation, Boolean publicViewable, Long lid) throws HttpStatusException {
        String q = """
            INSERT INTO resident (firstname, middlename, lastname, birth_date, burial_date, death_date, capsule, marker, foundation, viewable, lot)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;

        try {

            PreparedStatement ps = connection.prepareStatement(q);

            ps.setString(1, firstName); // set first name 

            if (middleName != null && !middleName.isBlank()) { // set middle name (nullable)
                ps.setString(2, middleName);
            } else {
                ps.setNull(2, Types.VARCHAR);
            }
            ps.setString(3, lastName); // set last Name 

            if (birthDate != null && !birthDate.isBlank()) { // set birth date (nullable)
                ps.setDate(4, Date.valueOf(birthDate));
            } else {
                ps.setNull(4, Types.DATE);
            }

            if (burialDate != null && !burialDate.isBlank()) { // set burrial date (nullable)
                ps.setDate(5, Date.valueOf(burialDate));
            } else {
                ps.setNull(5, Types.DATE);
            }

            if (deathDate != null && !deathDate.isBlank()) { // set death date (nullable)
                ps.setDate(6, Date.valueOf(deathDate));
            } else {
                ps.setNull(6, Types.DATE);
            }

            if (capsule != null && !capsule.isBlank()) { // set capsule (nullable)
                ps.setString(7, capsule.trim().toLowerCase());
            } else {
                ps.setNull(7, Types.VARCHAR);
            }

            if (marker != null) {// set marker (nullable)
                ps.setBoolean(8, marker);
            } else {
                ps.setNull(8, Types.BOOLEAN);
            }

    
            if (foundation != null) { // set foundation (nullable)
                ps.setBoolean(9, foundation);
            } else {
                ps.setNull(9, Types.BOOLEAN);
            }

    
            if (publicViewable != null) { // set viewable (nullable)
                ps.setBoolean(10, publicViewable);
            } else {
                ps.setNull(10, Types.BOOLEAN);
            }

            ps.setLong(11, lid); // set lot
            
            if (ps.executeUpdate() < 1){
               return false;
            }
            return true;

        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Create New Resident", e);
        }
    }

    /**
     * delete a resident from the database
     * 
     * @param rid the id of the resident
     * @return true if successfull, false otherwise 
     * @throws HttpStatusException
     */
    public boolean deleteResident(Long rid) throws HttpStatusException {
        String q = """
                DELETE FROM resident 
                WHERE rid = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setLong(1, rid);

            if (ps.executeUpdate() < 1) {
                return false;
            }
            return true;

        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Delete Resident with  rid " + rid, e);
        }
    }

    /**
     * Create a new lot in the database 
     * 
     * @param number the number identifier for the lot 
     * @param descriptor the partition of the lot
     * @param owner the owner of the lot 
     * @param sid the id of the section the lot is located in 
     * @return true on success, false otherwise
     * @throws HttpStatusException
     */
    public boolean createNewLot(String number,String descriptor, String owner, Long sid ) throws HttpStatusException {
        String q = """
                INSERT INTO lot (number, descriptor, owner, section)
                VALUES (?, ?, ?, ?)
                """;
        
        try {
            PreparedStatement ps = connection.prepareStatement(q);

            ps.setString(1, number); // set number
            if (descriptor == null || descriptor.isBlank()){ // set descriptor (nullable)
                ps.setString(2, "entire");
            } else {
                ps.setString(2, descriptor);
            }
            if (owner == null || owner.isBlank()){ // set owner (nullable)
                ps.setNull(3, Types.VARCHAR);
            }else {
                ps.setString(3, owner);
            }
            ps.setLong(4, sid);

            if (ps.executeUpdate() < 1){
                return false;
            }
            return true;

        } catch (SQLException e) {
            String message = e.getMessage().toLowerCase(); 

            if (message.contains("unique") || message.contains("duplicate")) {
                throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Lot Already Exists");
            }

            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Create Lot", e);
        }
    }

    /**
     * updates a lot in the database 
     * 
     * @param lid the id of the lot 
     * @param number the number identifier for the lot 
     * @param descriptor ther partition of the lot 
     * @param owner the owner of the lot
     * @param sid the id of the section the lot is locsted in
     * @return true on success, false otherwise
     * @throws HttpStatusException
     */
    public boolean updateLot(Long lid, String number, String descriptor, String owner, Long sid ) throws HttpStatusException {
        String q = """
                UPDATE lot
                SET 
                    number = ?,
                    descriptor = ?,
                    owner = ?,
                    section = ?
                WHERE lid = ?
                """;
        
        try {
            PreparedStatement ps = connection.prepareStatement(q);

            ps.setString(1, number); // set number
            if (descriptor == null || descriptor.isBlank()){ // set descriptor (nullable)
                ps.setString(2, "entire");
            } else {
                ps.setString(2, descriptor);
            }
            if (owner == null || owner.isBlank()){ // set owner (nullable)
                ps.setNull(3, Types.VARCHAR);
            }else {
                ps.setString(3, owner);
            }
            ps.setLong(4, sid);
            ps.setLong(5, lid);

            if (ps.executeUpdate() < 1){
                return false;
            }
            return true;

        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Create Lot", e);
        }
    }

    /**
     * Delete a lot from the database 
     * 
     * @param lid the id of the lot 
     * @return true on success, false otherwise
     * @throws HttpStatusException
     */
    public boolean deleteLot(Long lid) throws HttpStatusException {
        String q = """
                DELETE FROM lot 
                WHERE lid = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setLong(1, lid);

            if (ps.executeUpdate() < 1) {
                return false;
            }
            return true;
            
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Delete Lot with id " + lid, e);
        }
    }

    /**
     * get a user from the daatabse based on their unique email address 
     *  
     * @param email the email of the user 
     * @return the User object on success, Null if not found
     * @throws HttpStatusException
     */
    public User getUser(String email) throws HttpStatusException {
        String q = """
                SELECT *
                FROM users
                WHERE email = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()){
                return new User(
                    rs.getLong("uid"),
                    rs.getString("email"),
                    rs.getString("hashed_password"),
                    rs.getString("salt"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getString("role")
                );
            }

            return null;
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed Search for User " + email, e);
        }
    }

    /**
     * updates a user password in the database
     * 
     * @param userId the id of the user
     * @param password the new hashed password 
     * @param salt the salt that was added to the password
     * @return true on success, false otherwise
     * @throws HttpStatusException
     */
    public boolean updateUserPassword(Long userId, String password, String salt) throws HttpStatusException {
        String q = """
                Update users
                SET 
                    hashed_password =  ?,
                    salt = ?
                WHERE uid = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setString(1, password);
            ps.setString(2, salt);
            ps.setLong(3, userId);

            if (ps.executeUpdate() < 1) {
                return false;
            }
            return true;
            
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed Update User Password", e);
        }
    }

    /**
     * Get a user from the database by their id 
     * 
     * @param userId the id of the user 
     * @return The User object on success, Null otherwise if not found
     * @throws HttpStatusException
     */
    public User getUser(Long userId) throws HttpStatusException {
        String q = """
                SELECT *
                FROM users
                WHERE uid = ?
                """;

        try {
            PreparedStatement ps = connection.prepareStatement(q);
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            
            if (rs.next()){
                return new User(
                    rs.getLong("uid"),
                    rs.getString("email"),
                    rs.getString("hashed_password"),
                    rs.getString("salt"),
                    rs.getString("first_name"),
                    rs.getString("last_name"),
                    rs.getString("role")
                );
            }

            return null;
        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Find User " + userId, e);
        }

    }
}