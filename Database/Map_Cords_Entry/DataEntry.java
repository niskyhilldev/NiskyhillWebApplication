import java.sql.*;
import java.util.*;
import java.io.*;

public class DataEntry {
    public static void main(String[] args) {

        Connection c = null;

        try { // try is for reading from the file, database methods handle their own
              // exceptions
            Scanner scanner = new Scanner(new File("plotData.txt"));

            c = getDatabaseConnection();
            System.out.println("\nReading Data..........\n");

            long line = 0;
            while (scanner.hasNextLine()) {
                line++;
                String[] tokens = scanner.nextLine().split(",");

                if(tokens.length != 4){
                    continue;
                }

                String section = null;
                String plot = null;
                Long xCord = null; 
                Long yCord = null; 

                // get the section
                section = tokens[0];

                //get the plot
                plot = tokens[1].replaceAll("(?i)plot", "").replaceAll("\\s+", "").trim();

                //get the cords
                xCord = Long.parseLong(tokens[2].replaceAll("[\\[\\]]", "").trim());
                yCord = Long.parseLong(tokens[3].replaceAll("[\\[\\]]", "").trim());

                
                // enter into database 
                insertCords(section, plot, xCord, yCord, line, c);


            }
                

            scanner.close();
        } catch (Exception e) {
            System.err.println("Error Reading/Writting to File");
        } finally {
            if (disconnect(c)) {
                c = null;
            }
        }

    }

    public static Connection getDatabaseConnection() {
        String uri = "jdbc:postgresql://c9mq4861d16jlm.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d1ijfopuv9r3fp?user=u6ajr7ir792ed7&password=p92316742813f4af72de2caaf466079cc416236769dabffbeb33a64c36685bd83";

        try {
            Connection c = DriverManager.getConnection(uri);
            if (c == null) { // error
                System.err.println("\nCould Not connect To Database (Null Object Retured)");
                System.exit(0); // if we cant connect terminate the program
                return null;

            } else {
                System.out.println("\nDatabase Connection Sucsessfull");
                return c;
            }

        } catch (SQLException e) {
            System.err.printf("\nException Connecting to Database: %s\n", e.getMessage());
            System.exit(0);
            return null; // if we cant connect terminate the program
        }

    }

    public static boolean disconnect(Connection c) {
        if (c != null) {
            try {
                c.close();
                System.out.println("Database Disconnect Successfull");
            } catch (SQLException e) {
                System.err.println("Error Disconnecting from Database");
                return false;
            }
        }
        return true;
    }

    public static void insertCords(String section,String lot, Long xCord, Long yCord, long fileLineNum, Connection c) {
        
        Long sectionId = getSection(section, c);

        String sql = """
                UPDATE lot
                SET 
                    x_pixel_cord = ?,
                    y_pixel_cord = ?
                WHERE
                    number = ? AND section = ?
                """;

        try{
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setLong(1, xCord);
            ps.setLong(2, yCord);
            ps.setString(3, lot);
            ps.setLong(4, sectionId);

            if (ps.executeUpdate() < 1){
                System.err.println("Error: Line " + fileLineNum);
            }
            

        } catch (SQLException e){
            System.err.println("Error: Line " + fileLineNum);
        }
        
    }


    /*
     * Get the sid form the database, returns null if not found, -1 if there was an
     * database error
     */
    public static Long getSection(String sectionName, Connection c) {
        String sql = """
                SELECT sid
                FROM section
                WHERE LOWER(name) = LOWER(?)
                """;
        try {
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setString(1, sectionName);
            ResultSet rs = ps.executeQuery();

            Long sectionId = null;
            if (rs.next()) {
                sectionId = rs.getLong("sid");
            }
            return sectionId;

        } catch (SQLException e) {
            return -1L;
        }

    }
}