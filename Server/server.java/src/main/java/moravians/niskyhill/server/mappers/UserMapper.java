package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.UserDTO;
import moravians.niskyhill.server.models.User;

/**
 * Mapper helper class to handle coverting user models to user type DTO's
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class UserMapper {
    
    /**
     * Maps a user to a userDTO
     * 
     * @param user
     * @return a userDTO, null if the given user does not exist
     */
    public static UserDTO mapUserDTO(User user){

        if (user == null){
            return null;
        }

        return new UserDTO(
            user.uid(),
            user.email(),
            user.firstName(),
            user.lastName(),
            user.role()
        );
    }
}
