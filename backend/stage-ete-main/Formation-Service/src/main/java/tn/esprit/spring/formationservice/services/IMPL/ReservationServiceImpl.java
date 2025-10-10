package tn.esprit.spring.formationservice.services.IMPL;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.spring.formationservice.entity.Formation;
import tn.esprit.spring.formationservice.entity.Reservation;
import tn.esprit.spring.formationservice.entity.StatutReservation;
import tn.esprit.spring.formationservice.repository.FormationRepository;
import tn.esprit.spring.formationservice.repository.ReservationRepository;
import tn.esprit.spring.formationservice.services.interfaces.IReservationService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements IReservationService {

    private final ReservationRepository reservationRepository;
    private  final FormationRepository formationRepository;

    @Override
    public Reservation addReservation(Reservation reservation) {

        // 1. Charger la formation à réserver
        Formation formationDemandee = formationRepository.findById(reservation.getFormation().getId())
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        LocalDateTime debutDemandee = formationDemandee.getDateDebut();
        LocalDateTime finDemandee = formationDemandee.getDateFin();

        if (debutDemandee == null || finDemandee == null) {
            throw new IllegalStateException("Les dates de la formation doivent être renseignées.");
        }

        // 2. Récupérer les réservations existantes du participant qui sont confirmées ou en attente
        List<Reservation> reservationsExistantes = reservationRepository.findByParticipantIdAndStatutIn(
                reservation.getParticipantId(),
                List.of(StatutReservation.CONFIRME, StatutReservation.EN_ATTENTE));

        // 3. Vérifier que la nouvelle formation ne chevauche aucune réservation existante
        for (Reservation resExist : reservationsExistantes) {
            Formation formationExistante = resExist.getFormation();
            if (formationExistante == null) continue;

            LocalDateTime debutExistante = formationExistante.getDateDebut();
            LocalDateTime finExistante = formationExistante.getDateFin();

            if (debutExistante == null || finExistante == null) continue;

            boolean chevauchement = !(finDemandee.isBefore(debutExistante) || debutDemandee.isAfter(finExistante));
            if (chevauchement) {
                throw new IllegalStateException("Vous avez déjà une formation prévue entre "
                        + debutExistante + " et " + finExistante);
            }
        }

        // 4. Pas de conflit : préparer la réservation
        reservation.setFormation(formationDemandee);
        reservation.setDateReservation(LocalDateTime.now());



        // 5. Sauvegarder la réservation
        return reservationRepository.save(reservation);
    }
    @Override
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Override
    public List<Reservation> getReservationsByParticipant(Long participantId) {
        return reservationRepository.findByParticipantId(participantId);
    }
}
