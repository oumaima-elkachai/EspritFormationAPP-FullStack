package tn.esprit.examen.nomPrenomClasseExamen.repositories.UsersModule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import tn.esprit.examen.nomPrenomClasseExamen.entities.User;

import java.util.List;
import java.util.Optional;

public interface IUserRepository  extends JpaRepository<User,Long> {
    //ProfilePictures findByUserId(Long id);
    User findByEmail(String email);



    User findByPhoneNumber(String phoneNumber);
}
