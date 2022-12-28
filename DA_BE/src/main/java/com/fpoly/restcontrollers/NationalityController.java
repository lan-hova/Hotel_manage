/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.entities.Nationality;
import com.fpoly.repositories.irepo.INationalityService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/nationality")
public class NationalityController {

	@Autowired
	INationalityService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Nationality>> getAllNationality() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Nationality> createNewNationality(@RequestBody Nationality nationality) {
		return new ResponseEntity<>(repository.save(nationality), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Nationality> getNationality(@PathVariable Integer id) {
		Optional<Nationality> nationalityOptional = repository.findById(id);
		return nationalityOptional.map(Nationality -> new ResponseEntity<>(Nationality, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Nationality> updateNationality(@PathVariable Integer id, @RequestBody Nationality nationality) {
		Optional<Nationality> nationalityOptional = repository.findById(id);
		return nationalityOptional.map(n -> {
			nationality.setId(n.getId());
			return new ResponseEntity<>(repository.save(nationality), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Nationality> deleteNationality(@PathVariable Integer id) {
		Optional<Nationality> nationalityOptional = repository.findById(id);
		return nationalityOptional.map(n -> {
			repository.remove(id);
			return new ResponseEntity<>(n, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
