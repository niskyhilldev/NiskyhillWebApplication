package moravians.niskyhill.server.auth;


import java.util.HashMap;
import java.util.Map;

public class UserStore {
    // TODO: replace with proper database storage
    private static final Map<String, String> users = new HashMap<>();

    static {
        users.put("user1@example.com", "password123");
        users.put("admin@example.com", "adminpass");
    }

    public static boolean isValidUser(String email, String password) {
        return users.containsKey(email) && users.get(email).equals(password);
    }
}