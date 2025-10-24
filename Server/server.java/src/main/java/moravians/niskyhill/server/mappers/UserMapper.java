package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.UserDTO;
import moravians.niskyhill.server.models.User;

public class UserMapper {
    
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
