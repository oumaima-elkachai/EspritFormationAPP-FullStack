package tn.esprit.spring.formationservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.spring.formationservice.entity.Formation;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import tn.esprit.spring.formationservice.dto.FormationRequest;
import tn.esprit.spring.formationservice.services.interfaces.IFormationService;

@Slf4j
@RestController
@RequestMapping("/api/formations")
@RequiredArgsConstructor
@Tag(name = "Formation Management")
@CrossOrigin(origins = "*")
public class FormationController {

    private final IFormationService formationService;

    @Operation(summary = "Ajouter une formation avec image")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Formation créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Erreur d'image ou données invalides")
    })
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> createFormationWithImage(
            @RequestPart("request") @Valid FormationRequest request,
            @RequestPart("image") MultipartFile image) {


        try {
            Formation saved = formationService.addFormation(request, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IOException e) {
            log.error("File upload failed", e);
            return ResponseEntity.badRequest().body(
                    Map.of("error", "File upload failed", "details", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Formation>> getAll() {
        return new ResponseEntity<>(formationService.getAllFormations(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getById(@PathVariable Long id) {
        return formationService.getFormationById(id)
                .map(f -> new ResponseEntity<>(f, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping
    public ResponseEntity<Formation> update(@RequestBody Formation formation) {
        return new ResponseEntity<>(formationService.updateFormation(formation), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        formationService.deleteFormation(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
