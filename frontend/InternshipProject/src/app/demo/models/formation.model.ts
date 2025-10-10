export interface Formation {
  id: number;
  titre: string;
  description: string;
  imageUrl: string;
  enLigne: boolean;
  lieu?: string;
  meetLink?: string;
  dateDebut: string;
  dateFin: string;
  categorie?: {
    id: number;
    nom: string;
  };
}
