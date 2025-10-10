package tn.esprit.examen.nomPrenomClasseExamen.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String email;
    private String password;
}