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

import com.fpoly.entities.HandOver;
import com.fpoly.repositories.irepo.IHandOverService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/hand-over")
public class HandOverController {

	@Autowired
	IHandOverService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<HandOver>> getAllHandOver() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<HandOver> createNewHandOver(@RequestBody HandOver handOver) {
		return new ResponseEntity<>(repository.save(handOver), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<HandOver> getHandOver(@PathVariable Integer id) {
		Optional<HandOver> handOverOptional = repository.findById(id);
		return handOverOptional.map(handOver -> new ResponseEntity<>(handOver, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<HandOver> updateHandOver(@PathVariable Integer id, @RequestBody HandOver handOver) {
		Optional<HandOver> handOverOptional = repository.findById(id);
		return handOverOptional.map(h -> {
			handOver.setId(h.getId());
			return new ResponseEntity<>(repository.save(handOver), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<HandOver> deleteHandOver(@PathVariable Integer id) {
		Optional<HandOver> handOverOptional = repository.findById(id);
		return handOverOptional.map(h -> {
			repository.remove(id);
			return new ResponseEntity<>(h, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
