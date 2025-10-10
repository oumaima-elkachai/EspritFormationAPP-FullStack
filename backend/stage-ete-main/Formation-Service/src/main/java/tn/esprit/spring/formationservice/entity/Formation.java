package tn.esprit.spring.formationservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @Column(length = 1500)
    private String description;

    private String imageUrl;


    private boolean enLigne; // true = en ligne, false = présentiel

    private String lieu; // si enLigne == false

    private String meetLink; // si enLigne == true

    @Column(name = "date_debut")
    private LocalDateTime dateDebut;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Column(name = "date_publication")
    private LocalDateTime datePublication;

    @Column(name = "duree_pause_minutes")
    private Integer dureePauseMinutes;


    private Long formateurId;

    private Long evenementId; // future use

    private String titrePause; // pause optionnelle



    @ManyToOne
    @JsonIgnoreProperties("formations")
    private Categorie categorie;



    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("formation")
    private List<Reservation> reservations;
}