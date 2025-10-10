package tn.esprit.examen.nomPrenomClasseExamen.controllers.UsersModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.esprit.examen.nomPrenomClasseExamen.entities.User;
import tn.esprit.examen.nomPrenomClasseExamen.repositories.UsersModule.IUserRepository;
import tn.esprit.examen.nomPrenomClasseExamen.services.UsersModule.IUserService;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;


    @GetMapping("/allUser")
    public List<User> getAllUsers() {
        return userService.retrieveAllUser();
    }

    @PostMapping("/addUser")
    public User addUser(@RequestBody User user) {
        System.out.println("User received: " + user.toString());
        return userService.addUser(user);
    }

    @PutMapping("/updateUser")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @GetMapping("/getbyid/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.retrieveUser(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.removeUser(id);
    }

    @GetMapping("/test")
    public String test() {
        return "Application is running";
    }

    @PostMapping("/login")
    public User login(@RequestParam String email, @RequestParam String password) {
        User user = userService.authenticateUser(email, password);

        if (user != null) {
            return user;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Autowired
    private IUserRepository userRepository;


    @GetMapping("/check-email/{email}")
    public boolean checkEmailUnique(@PathVariable String email) {
        return userRepository.findByEmail(email) == null;
    }
}