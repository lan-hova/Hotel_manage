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

import com.fpoly.entities.RentalTypes;
import com.fpoly.repositories.irepo.IRentalTypeService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/rental-type")
public class RentalTypeController {

	@Autowired
	IRentalTypeService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<RentalTypes>> getAllRentalType() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<RentalTypes> createNewRentalType(@RequestBody RentalTypes rentype) {
		return new ResponseEntity<>(repository.save(rentype), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<RentalTypes> getRentalType(@PathVariable Integer id) {
		Optional<RentalTypes> rentypeOptional = repository.findById(id);
		return rentypeOptional.map(rentype -> new ResponseEntity<>(rentype, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<RentalTypes> updateRentalType(@PathVariable Integer id, @RequestBody RentalTypes rentype) {
		Optional<RentalTypes> rentypeOptional = repository.findById(id);
		return rentypeOptional.map(r -> {
			rentype.setId(r.getId());
			return new ResponseEntity<>(repository.save(rentype), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<RentalTypes> deleteRentalType(@PathVariable Integer id) {
		Optional<RentalTypes> rentypeOptional = repository.findById(id);
		return rentypeOptional.map(r -> {
			repository.remove(id);
			return new ResponseEntity<>(r, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
