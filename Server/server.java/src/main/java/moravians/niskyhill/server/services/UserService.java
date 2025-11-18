package moravians.niskyhill.server.services;

import moravians.niskyhill.server.auth.PasswordUtility;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.UserDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.UserMapper;
import moravians.niskyhill.server.models.User;

/**
* Service Layer for all things User related
* 
* @author Tedd Stabolepszy, Lehigh Univeristy '26
*/
public class UserService {
    
    /**
     * Search for a user of the system given there email and password 
     * 
     * @param email in plain text
     * @param password in plain text
     * @param database a database with an established connection
     * @return  the User's ID that corisponds to the email and password combo, null if not found
     * @throws HttpStatusException database error
     */
    public static Long findUser(String email, String password, Database database) throws HttpStatusException {
        if (email == null || password == null){
            return null;
        }
        
        User user = database.getUser(email);
        if (user == null) {
            return null; // user with that email does not exist in the system
        }

        String hashedInputPassword = PasswordUtility.hashPassword(password, user.salt());

        if (hashedInputPassword.equals(user.hashedPassword())){
            return user.uid(); // passwords matched
        }

        return null; // wrong password for User Email
    }

    /**
     * Set a users password in the system 
     * 
     * @param uid the id of the user we want to change the password of
     * @param newPassword the new password in plain text
     * @param database a database with an established connection
     * @return true on success (excpetion otherwise)
     * @throws HttpStatusException missing params, invalid uid, user not found, database error 
     */
    public static boolean setPassword(Long uid, String newPassword, Database database) throws HttpStatusException {
        if (newPassword == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Password is Required");
        }
        
        String salt = PasswordUtility.generateSalt();
        String hashedPassword = PasswordUtility.hashPassword(newPassword, salt);

        if (database.updateUserPassword(uid, hashedPassword, salt) == false){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Failed to Update Password, could not find user");
        }
        return true;
    }

    /**
     * get a user of the system by their ID
     * 
     * @param uid an ID
     * @param database a database with an established connection
     * @return  a UserDTO object
     * @throws HttpStatusException missing params, basbase error
     */
    public static UserDTO getUser(Long uid, Database database) throws HttpStatusException {
        if (uid == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "User ID is Required ");
        }

        return UserMapper.mapUserDTO(database.getUser(uid)); 
    }
}

