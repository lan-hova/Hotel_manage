package com.fpoly.restcontrollers;

import com.fpoly.entities.ConfigTime;
import com.fpoly.entities.KindOfRoom;
import com.fpoly.repositories.irepo.IConfigTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/config-time")
public class ConfigTimeController {
    @Autowired
    IConfigTimeService iConfigTimeService;

    @GetMapping
    public ResponseEntity<Iterable<ConfigTime>> getAllConfigTime() {
        return new ResponseEntity<>(iConfigTimeService.findAll(), HttpStatus.OK);
    }
}
