package com.spring.financial.controller;

import com.spring.financial.auth.HashManager;
import com.spring.financial.auth.TokenManager;
import com.spring.financial.database.entity.Person;
import com.spring.financial.controller.RequestBody.PersonInfo;
import com.spring.financial.database.repository.PersonRepository;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


//TODO create controller to send all non api request to webpages;
@RestController
public class PersonController {

    @Autowired
    PersonRepository personRepository;

    @PostMapping(value = "/api/add-person")
    public ResponseEntity<Object> addPerson(@RequestBody Person person) {
        JSONObject Entity = new JSONObject();
        if(personRepository.findByEmail(person.getEmail()).isEmpty()){
            String hashedPassword = HashManager.hashpw(person.getPassword());
            person.setPassword(hashedPassword);
            personRepository.save(person);
            Entity.put("completed", true);
            return new ResponseEntity<>(Entity, HttpStatus.OK);
        }
        else {
            Entity.put("completed", false);
            Entity.put("message", "Account already exist");
            return new ResponseEntity<>(Entity, HttpStatus.CONFLICT);
        }
    }

    @PostMapping(value = "/api/login")
    public ResponseEntity<Object> login(@RequestBody PersonInfo personInfo) {
        JSONObject Entity = new JSONObject();
        String email = personInfo.getEmail();
        String password =  personInfo.getPassword();
        if(!personRepository.findByEmail(email).isEmpty()){
            Person person = personRepository.findByEmail(email).get(0);
            String hashPassword = person.getPassword();
            Integer userID = person.getId();
            if (HashManager.checkpw(password, hashPassword)) {
                String token = TokenManager.createJWT(userID.toString());
                Entity.put("completed", true);
                Entity.put("token", token);
                return new ResponseEntity<>(Entity, HttpStatus.OK);
            } else {
                Entity.put("completed", false);
                Entity.put("message", "Invalid credentials");
                return new ResponseEntity<>(Entity, HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            Entity.put("completed", false);
            Entity.put("message", "Email has not been registered");
            return new ResponseEntity<>(Entity, HttpStatus.NOT_FOUND);
        }
    }

}