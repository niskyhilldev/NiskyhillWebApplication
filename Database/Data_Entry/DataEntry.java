import java.sql.*;
import java.util.*;
import java.io.*;

public class DataEntry {
    public static void main(String[] args) {

        if (args.length < 2) {
            System.err.println("Invald Num Args: java DataEntry <startLine> <endLine>");
            System.exit(1);
        }

        long line_start = 0; // inclusive
        long line_end = 0; // exclusive
        try {
            line_start = Long.parseLong(args[0]);
            line_end = Long.parseLong(args[1]);
        } catch (NumberFormatException e) {
            System.err.println("Error: Both startLine and endLine must be valid integers.");
            System.exit(1);
        }
        if(line_end == line_start){
            System.err.println("Error: Span Must be Greater Than 0");
            System.exit(1);
        }
        if(line_end < 2 || line_start < 2 ){
            System.err.println("Error: Start and/or End must Be Greater Than 2 ");
            System.exit(1);
        }
        if(line_start > line_end){
            System.err.println("Error: End must be > Start");
            System.exit(1);
        }

        line_start-= 2;
        line_end-= 2;

        Connection c = null;

        try { // try is for reading from the file, database methods handle their own
              // exceptions
            Scanner scanner = new Scanner(new File("data.csv"));
            FileWriter writer = new FileWriter("error_log.txt", true); // true means append to file
            writer.write("\n");
            
            c = getDatabaseConnection();
            long currentLine = 0;
            System.out.println("\nReading Data..........\n");

            // Skip lines before line_start
            while (scanner.hasNextLine() && currentLine < line_start) {
                scanner.nextLine();
                currentLine++;
            }

            while (scanner.hasNextLine() && currentLine < line_end) {
                String[] tokens = scanner.nextLine().split(",");
                String firstName = null; // tokens[0]
                String middleName = null; // tokens[1]
                String lastName = null; // tokens[2]
                String section = null; // tokens[3]
                String lotDetails = null; // tokens[4]
                String lotNumber = null; // tokens[5]
                String burialDate = null; // tokens[6]
                String lotOwner = null; // tokens[7]

                if (tokens.length < 7) {
                    writer.write(String.format("%-5d\tEntry Malformed\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // extract section (critical)
                try {
                    if ((!(tokens[3].equals(""))) && tokens[3] != null) {
                        section = tokens[3];
                    } else {
                        writer.write(String.format("%-5d\tNo Section Found\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }
                } catch (IndexOutOfBoundsException e) {
                    writer.write(String.format("%-5d\tNo Section Found\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // extract lot number (critical)
                try {
                    if ((!(tokens[5].equals(""))) && tokens[5] != null) {
                        lotNumber = tokens[5];
                    } else {
                        writer.write(String.format("%-5d\tNo Lot Number Found\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }
                } catch (IndexOutOfBoundsException e) {
                    writer.write(String.format("%-5d\tNo Lot Number Found\n", currentLine + 2));
                    currentLine++;
                    continue;

                }

                // extract First Name (critical)
                try {
                    if ((!(tokens[0].equals(""))) && tokens[0] != null) {
                        firstName = tokens[0];
                    } else {
                        writer.write(String.format("%-5d\tNo First Name Found\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }

                } catch (IndexOutOfBoundsException e) {
                    writer.write(String.format("%-5d\tNo First Name Found\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // extract Last Name (critical)
                try {
                    if ((!(tokens[2].equals(""))) && tokens[2] != null) {
                        lastName = tokens[2];
                    } else {
                        writer.write(String.format("%-5d\tNo Last Name Found\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }

                } catch (IndexOutOfBoundsException e) {
                    writer.write(String.format("%-5d\tNo Last Name Found\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // extract Middle Name (non - critical)
                try {
                    if (!(tokens[1].equals(""))) {
                        middleName = tokens[1];
                    }
                } catch (IndexOutOfBoundsException e) {
                    // do nothing, its non - critical
                }

                // extract lot details
                try {
                    if (!(tokens[4].equals(""))) {
                        lotDetails = tokens[4];
                    }
                } catch (IndexOutOfBoundsException e) {
                    // do nothing, its non - critical
                }

                // extract burial date
                try {
                    if (!(tokens[6].equals(""))) {
                        burialDate = tokens[6];
                    }
                } catch (IndexOutOfBoundsException e) {
                    // do nothing, its non - critical
                }

                try {
                    if (!(tokens[7].equals(""))) {
                        lotOwner = tokens[7];
                    }
                } catch (IndexOutOfBoundsException e) {
                    // do nothing, its non - critical
                }



                // try to retreive the section id from the database (if it exists)
                Long sectionId = getSection(section, c);
                if (sectionId == null) {
                    writer.write(String.format("%-5d\tInvalid Section\n", currentLine + 2));
                    currentLine++;
                    continue;
                } else if (sectionId == -1L){
                    writer.write(String.format("%-5d\tDatabase Error Searching for Section\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // see if the lot Exists in Database Already, if not create one
                Long lotId = getLot(sectionId, lotNumber, lotDetails, c);
                if (lotId == null) {
                    lotId = createLot(sectionId, lotNumber, lotDetails, lotOwner, c);
                    if (lotId == null) {
                        writer.write(String.format("%-5d\tFailed to Create New Lot for Entry\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }else if (lotId == -1L){
                        writer.write(String.format("%-5d\tFailed to Create New Lot for Entry due to Database Error\n", currentLine + 2));
                        currentLine++;
                        continue;
                    }
                } else if (lotId == -1){
                    writer.write(String.format("%-5d\tDatabase Error getting Lot\n", currentLine + 2));
                    currentLine++;
                    continue;
                }

                // add resident
                Long residentId = createResident(firstName, middleName, lastName, burialDate, lotId, c);
                if (residentId == null) { // failed to create
                    writer.write(String.format("%-5d\tFailed to Create New Resident\n", currentLine + 2));
                    currentLine++;
                    continue;
                } else if (residentId == -1L){ // already enterd or database error
                    writer.write(String.format("%-5d\tFailed to Create New Resident from Database Error\n", currentLine + 2));
                    currentLine++;
                    continue;
                }
                currentLine++;
            }

            scanner.close();
            writer.close();
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

    public static Long createLot(Long sectionId, String lotNumber, String lotDetails, String lotOwner, Connection c) {
        String sql = """
                INSERT INTO lot (number, descriptor, owner, section)
                VALUES (?, ?, ?, ?)
                RETURNING lid
                """;
        try{
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setString(1, lotNumber);
            if(lotDetails == null){
                ps.setNull(2, Types.VARCHAR);
            }else{
                ps.setString(2, lotDetails);
            }
            if(lotOwner == null){
                ps.setNull(3, Types.VARCHAR);
            }else{
                ps.setString(3, lotOwner);
            }
            ps.setLong(4, sectionId);
            ResultSet rs = ps.executeQuery();

            Long lotId = null;
            if (rs.next()){
                lotId = rs.getLong("lid");
            }
            return lotId;
        } catch (SQLException e){
            return -1L;
        }
    }

    /*
     * Gets the lid from the database, returns null if not found, -1 if a database error
     */
    public static Long getLot(Long sectionId, String lotNumber, String lotDetails, Connection c) {
        System.out.println(lotNumber + "\t" + lotDetails);
        
        String sql = """
            SELECT lid
            FROM lot
            WHERE 
                section = ? AND
                LOWER(number) = LOWER(?) AND
        """;
    
        boolean isDescriptorNull = (lotDetails == null);
    
        // Adjust the query based on whether descriptor is null
        if (isDescriptorNull) {
            sql += "descriptor IS NULL";
        } else {
            sql += "LOWER(descriptor) = LOWER(?)";
        }
    
        try {
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setLong(1, sectionId);
            ps.setString(2, lotNumber);
    
            if (!isDescriptorNull) {
                ps.setString(3, lotDetails);
            }
    
            ResultSet rs = ps.executeQuery();
    
            Long lotId = null;
            if (rs.next()) {
                lotId = rs.getLong("lid");
            }
            return lotId;
    
        } catch (SQLException e) {
            return -1L;
        }
    }
    

    /*
     * Get the sid form the database, returns null if not found, -1 if there was an database error */
    public static Long getSection(String sectionName, Connection c) {
        String sql = """
                SELECT sid 
                FROM section
                WHERE LOWER(name) = LOWER(?)
                """;
        try{
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setString(1, sectionName);
            ResultSet rs = ps.executeQuery();
            
            Long sectionId = null;
            if(rs.next()){
                sectionId = rs.getLong("sid");
            }
            return sectionId;

        }catch (SQLException e){
            return -1L;
        }

    }

    public static Long createResident(String firstName, String middleName, String lastName, String burialDate, Long lotId, Connection c) {
        String sql = """
                INSERT INTO resident (firstname, middlename, lastname, burial_date, lot)
                VALUES (?, ?, ?, ?::DATE, ?)
                RETURNING rid
                """;
        try{
            PreparedStatement ps = c.prepareStatement(sql);
            ps.setString(1, firstName);
            if(middleName == null){
                ps.setNull(2, Types.VARCHAR);
            }else{
                ps.setString(2, middleName);
            }
            ps.setString(3, lastName);
            if(burialDate == null || burialDate.equals("")){
                ps.setNull(4, Types.VARCHAR);
            }
            else{
                if(burialDate.matches("^(0?[1-9]|1[0-2])/([1-9]|[12][0-9]|3[01])/\\d{4}$")){
                    ps.setString(4, burialDate);
                }else{
                    ps.setNull(4, Types.VARCHAR);
                }
            }
            ps.setLong(5, lotId);
            ResultSet rs = ps.executeQuery();

            Long residentId = null;
            if (rs.next()){
                residentId = rs.getLong("rid");
            }
            return residentId;
        } catch (SQLException e){
            return -1L;
        }
    }
}