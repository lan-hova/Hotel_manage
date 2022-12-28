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

import com.fpoly.entities.History;
import com.fpoly.repositories.irepo.IHistoryService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/history")
public class HistoryController {

	@Autowired
	IHistoryService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<History>> getAllHistory() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<History> createNewHistory(@RequestBody History history) {
		return new ResponseEntity<>(repository.save(history), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<History> getHistory(@PathVariable Integer id) {
		Optional<History> historyOptional = repository.findById(id);
		return historyOptional.map(history -> new ResponseEntity<>(history, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<History> updateHistory(@PathVariable Integer id, @RequestBody History history) {
		Optional<History> historyOptional = repository.findById(id);
		return historyOptional.map(h -> {
			history.setId(h.getId());
			return new ResponseEntity<>(repository.save(history), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<History> deleteHistory(@PathVariable Integer id) {
		Optional<History> historyOptional = repository.findById(id);
		return historyOptional.map(h -> {
			repository.remove(id);
			return new ResponseEntity<>(h, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
