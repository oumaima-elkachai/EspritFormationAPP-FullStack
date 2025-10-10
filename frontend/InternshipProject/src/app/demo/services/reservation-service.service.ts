import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationServiceService {

   
  private baseUrl = 'http://localhost:8089/formation-service/reservations';

  constructor(private http: HttpClient) {}

  createReservation(reservation: ReservationRequest) {
    return this.http.post(`${this.baseUrl}`, reservation);
  }
}
