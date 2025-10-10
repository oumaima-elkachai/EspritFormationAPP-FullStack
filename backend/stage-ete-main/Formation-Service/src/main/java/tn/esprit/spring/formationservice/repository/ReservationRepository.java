package tn.esprit.spring.formationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.spring.formationservice.entity.Reservation;
import tn.esprit.spring.formationservice.entity.StatutReservation;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByParticipantId(Long participantId);
    List<Reservation> findByParticipantIdAndStatutIn(Long participantId, List<StatutReservation> statuts);
}
