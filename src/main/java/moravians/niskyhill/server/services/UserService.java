package moravians.niskyhill.server.services;

import moravians.niskyhill.server.auth.PasswordUtility;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.UserDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.UserMapper;
import moravians.niskyhill.server.models.User;

public class UserService {
    
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

    public static UserDTO getUser(Long uid, Database database) throws HttpStatusException {
        if (uid == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "User ID is Required ");
        }

        return UserMapper.mapUserDTO(database.getUser(uid)); 
    }
}

