package tn.esprit.examen.nomPrenomClasseExamen.repositories.UsersModule;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.examen.nomPrenomClasseExamen.entities.UserVerification;

public interface IUsersModuleUserVerificationRepository extends JpaRepository<UserVerification, Long> {
    UserVerification findByEmail(String email);
}