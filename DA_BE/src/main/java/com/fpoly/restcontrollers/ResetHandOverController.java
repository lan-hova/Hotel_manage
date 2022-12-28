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

import com.fpoly.entities.ResetHandOver;
import com.fpoly.repositories.irepo.IResetHandOverService;


/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/reset-hand-over")
public class ResetHandOverController {

	@Autowired
	IResetHandOverService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<ResetHandOver>> getAllResetHandOver() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<ResetHandOver> createNewResetHandOver(@RequestBody ResetHandOver resetHandOver) {
		return new ResponseEntity<>(repository.save(resetHandOver), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<ResetHandOver> getResetHandOver(@PathVariable Integer id) {
		Optional<ResetHandOver> resetHandOverOptional = repository.findById(id);
		return resetHandOverOptional.map(resetHandOver -> new ResponseEntity<>(resetHandOver, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<ResetHandOver> updateResetHandOver(@PathVariable Integer id, @RequestBody ResetHandOver resetHandOver) {
		Optional<ResetHandOver> resetHandOverOptional = repository.findById(id);
		return resetHandOverOptional.map(r -> {
			resetHandOver.setId(r.getId());
			return new ResponseEntity<>(repository.save(resetHandOver), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<ResetHandOver> deleteResetHandOver(@PathVariable Integer id) {
		Optional<ResetHandOver> resetHandOverOptional = repository.findById(id);
		return resetHandOverOptional.map(r -> {
			repository.remove(id);
			return new ResponseEntity<>(r, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
