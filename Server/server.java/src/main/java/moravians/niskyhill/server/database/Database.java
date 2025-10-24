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

public class Database {
    private Connection connection;

    /**
     * The Database constructor is private: we only create Database objects
     * through one or more static getDatabase() methods.
     */
    private Database() {   }

    public static Database getDatabase() {
        String uri = "jdbc:postgresql://c9mq4861d16jlm.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1ijfopuv9r3fp?user=u6ajr7ir792ed7&password=p92316742813f4af72de2caaf466079cc416236769dabffbeb33a64c36685bd83";
        Database d = new Database();

        try {
            d.connection = DriverManager.getConnection(uri);
            if (d.connection == null) {
                System.err.println("\nCould Not connect To Database (Null Object Retured)");
                return null;
            } else {
                System.out.println("\nDatabase Connection Sucsessfull");
                return d;
            }

        } catch (SQLException e) {
            System.err.printf("\nError Connecting to Database: %s\n", e.getMessage());
            return null;
        }

    }

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

    public List<Resident> getAllResidents() throws HttpStatusException {
        final String q = """
            SELECT * 
            FROM 
                resident JOIN lot ON resident.lot = lot.lid
                JOIN section ON lot.section = section.sid
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

    public Resident getResident(Long rid) throws HttpStatusException {
        
        final String q = """
            SELECT * 
            FROM 
                resident JOIN lot ON resident.lot = lot.lid
                JOIN section ON lot.section = section.sid
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

    public List<Resident> searchResidents(String name) throws HttpStatusException {
        final String q = """
            SELECT *
            FROM resident r
                JOIN lot l ON r.lot = l.lid
                JOIN section s ON l.section = s.sid
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



    public List<Lot> getAllLots() throws HttpStatusException {
        final String q = """
                        SELECT *
                        FROM lot JOIN section ON lot.section = section.sid
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


    public List<Section> getAllSections() throws HttpStatusException {
        final String q = """
                    SELECT *
                    FROM section
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


    public Lot getLot(Long lid) throws HttpStatusException {
        final String q = """
                        SELECT *
                        FROM lot JOIN section ON lot.section = section.sid
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


    public List<Lot> getLotDetails(String lotNumber, String sectionName) throws HttpStatusException {
        String q = """
                    SELECT *
                    FROM lot JOIN section ON lot.section = section.sid
                    WHERE
                """;

        List<Lot> list = new ArrayList<>();

        if (lotNumber == null && sectionName != null){ // get all lots in a section
            q += " section.name = ?";
        }else if (lotNumber != null && sectionName == null){ // get all lots that share a number
            q += " lot.number = ?";
        } else { // get all lots with the number in the section 
            q += " lot.number = ? AND section.name = ?";
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


    public boolean createNewLot(String number,String descriptor, String owner, Long mapXCord, Long mapYCord, Long sid ) throws HttpStatusException {
        String q = """
                INSERT INTO lot (number, descriptor, owner, x_pixel_cord, y_pixel_cord, section)
                VALUES (?, ?, ?, ?, ?, ?)
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
            if (mapXCord == null){ // set Xcord (nullable)
                ps.setNull(4, Types.INTEGER);
            } else{
                ps.setLong(4, mapXCord);
            }
            if (mapYCord == null) { // set yCord (nullable)
                ps.setNull(5, Types.INTEGER);
            } else {
                ps.setLong(5, mapYCord);
            }
            ps.setLong(6, sid);

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


    public boolean updateLot(Long lid, String number, String descriptor, String owner, Long mapXCord, Long mapYCord, Long sid ) throws HttpStatusException {
        String q = """
                UPDATE lot
                SET 
                    number = ?,
                    descriptor = ?,
                    owner = ?,
                    x_pixel_cord = ?, 
                    y_pixel_cord = ?, 
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
            if (mapXCord == null){ // set Xcord (nullable)
                ps.setNull(4, Types.INTEGER);
            } else{
                ps.setLong(4, mapXCord);
            }
            if (mapYCord == null) { // set yCord (nullable)
                ps.setNull(5, Types.INTEGER);
            } else {
                ps.setLong(5, mapYCord);
            }
            ps.setLong(6, sid);
            ps.setLong(7, lid);

            if (ps.executeUpdate() < 1){
                return false;
            }
            return true;

        } catch (SQLException e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Create Lot", e);
        }
    }


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