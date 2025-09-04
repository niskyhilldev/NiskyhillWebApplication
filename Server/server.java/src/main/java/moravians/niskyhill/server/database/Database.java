package moravians.niskyhill.server.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.models.Lot;
import moravians.niskyhill.server.models.Owner;
import moravians.niskyhill.server.models.Resident;
import moravians.niskyhill.server.models.Section;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Database {
    private Connection connection;

    /**
     * The Database constructor is private: we only create Database objects
     * through one or more static getDatabase() methods.
     */
    private Database() {
    }

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
            FROM buried 
        """;
        
        List<Resident> residents = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Resident resident = new Resident(
                        rs.getLong("id"),
                        rs.getString("firstname"),
                        rs.getString("middlename"),
                        rs.getString("lastname"),
                        rs.getString("suffix"),
                        rs.getString("age"),
                        rs.getString("death_date"),
                        rs.getString("capsule"),
                        rs.getBoolean("foundation"),
                        rs.getBoolean("public"),
                        new Lot(
                            rs.getString("lot_number"),
                            rs.getString("lot_descriptor"),
                            rs.getString("section")
                        )
                );

                residents.add(resident);
            }
        } catch (Exception e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(500, "Failed to Retrieve Residents", e);
        }

        return residents;
    }

    public List<Lot> getAllLots() throws HttpStatusException {
        final String q = """
                        SELECT *
                        FROM lot
                """;

        List<Lot> lots = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Lot lot = new Lot(
                        rs.getString("lot_number"),
                        rs.getString("lot_descriptor"),
                        rs.getString("section"));

                lots.add(lot);
            }
        } catch (Exception e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(500, "Failed to Retrieve Lots", e);
        }

        return lots;
    }

    public List<Owner> getAllOwners() throws HttpStatusException {
        final String q = """
                    SELECT *
                    FROM owners
                """;

        List<Owner> owners = new ArrayList<>();

        try (PreparedStatement ps = connection.prepareStatement(q); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Owner owner = new Owner(
                        rs.getLong("id"),
                        rs.getString("firstname"),
                        rs.getString("middlename"),
                        rs.getString("lastname"),
                        rs.getString("suffix"),
                        rs.getString("organization"),
                        new Lot(
                            rs.getString("lot_number"),
                            rs.getString("lot_descriptor"),
                            rs.getString("section")
                        )
                );

                owners.add(owner);
            }
        } catch (Exception e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(500, "Failed to Retrieve Owners", e);
        }

        return owners;
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
                    rs.getString("section_name"),
                    rs.getString("section_map")
                );
                

                sections.add(section);
            }
        } catch (Exception e) {
            System.err.printf("Error Executing Query: %s\n", e.getMessage());
            throw new HttpStatusException(500, "Failed to Retrieve Sections", e);
        }

        return sections;
    }

}