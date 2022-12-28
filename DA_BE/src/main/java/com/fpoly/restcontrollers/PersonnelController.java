/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.entities.Personnel;
import com.fpoly.repositories.irepo.IPersonnelService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/personnel")
public class PersonnelController {

	@Autowired
	IPersonnelService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Personnel>> getAllPersonnel() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Personnel> createNewPersonnel(@RequestBody Personnel personnel) {
		Personnel p = personnel;
		p.getUsers().setPassword(BCrypt.hashpw(personnel.getUsers().getPassword(), BCrypt.gensalt()));;
		return new ResponseEntity<>(repository.save(p), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Personnel> getPersonnel(@PathVariable Integer id) {
		Optional<Personnel> personnelOptional = repository.findById(id);
		return personnelOptional.map(personnel -> new ResponseEntity<>(personnel, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Personnel> updatePersonnel(@PathVariable Integer id, @RequestBody Personnel personnel) {
		Optional<Personnel> personnelOptional = repository.findById(id);
		return personnelOptional.map(p -> {
			personnel.setId(p.getId());
			return new ResponseEntity<>(repository.save(personnel), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Personnel> deletePersonnel(@PathVariable Integer id) {
		Optional<Personnel> personnelOptional = repository.findById(id);
		return personnelOptional.map(p -> {
			repository.remove(id);
			return new ResponseEntity<>(p, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
