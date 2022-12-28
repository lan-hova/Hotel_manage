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

import com.fpoly.entities.Facilities;
import com.fpoly.repositories.irepo.IFacilityService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/facility")
public class FacilityController {

	@Autowired
	IFacilityService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Facilities>> getAllFacility() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Facilities> createNewFacility(@RequestBody Facilities facility) {
		return new ResponseEntity<>(repository.save(facility), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Facilities> getFacility(@PathVariable Integer id) {
		Optional<Facilities> facilityOptional = repository.findById(id);
		return facilityOptional.map(facility -> new ResponseEntity<>(facility, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Facilities> updateFacility(@PathVariable Integer id, @RequestBody Facilities facility) {
		Optional<Facilities> facilityOptional = repository.findById(id);
		return facilityOptional.map(f -> {
			facility.setId(f.getId());
			return new ResponseEntity<>(repository.save(facility), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Facilities> deleteFacility(@PathVariable Integer id) {
		Optional<Facilities> facilityOptional = repository.findById(id);
		return facilityOptional.map(f -> {
			repository.remove(id);
			return new ResponseEntity<>(f, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
