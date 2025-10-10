import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/demo/models/formation.model';
import { AuthService } from 'src/app/demo/services/auth.service';
import { FormationServiceService } from 'src/app/demo/services/formation-service.service';
import { ReservationServiceService } from 'src/app/demo/services/reservation-service.service';


@Component({
  selector: 'app-formation-list',
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.scss']
})

export class FormationListComponent implements OnInit {
  formations: Formation[] = [];
  participantId: number | null = null;

  constructor(
    private formationService: FormationServiceService,
    private reservationService: ReservationServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.participantId = this.authService.getParticipantId();
    this.formationService.getAllFormations().subscribe(data => {
      this.formations = data;
    });
  }

  participer(formationId: number) {
    if (this.participantId === null) {
      alert('Vous devez être connecté pour participer.');
      return;
    }

    this.reservationService.createReservation({
      formationId,
      participantId: this.participantId
    }).subscribe({
      next: () => alert('Participation enregistrée !'),
      error: () => alert('Erreur lors de la réservation')
    });
  }
}