package tn.esprit.examen.nomPrenomClasseExamen.services.UsersModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.examen.nomPrenomClasseExamen.entities.User;

import java.util.List;

@Service
public class ProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    private static final String TOPIC = "user-events";

    public void sendMessage(String message) {
        kafkaTemplate.send(TOPIC, message);
    }

    //public void sendUserList(List<User> users) {
       // kafkaTemplate.send(TOPIC, users);
    //}
}
