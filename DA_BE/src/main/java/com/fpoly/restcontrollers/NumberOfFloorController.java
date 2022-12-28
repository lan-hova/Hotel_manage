/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

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

import com.fpoly.entities.NumberOfFloors;
import com.fpoly.repositories.irepo.INumberOfFloorService;
import com.fpoly.repositories.repo.NumberOfFloorRepository;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/number-of-floor")
public class NumberOfFloorController {

	@Autowired
	INumberOfFloorService repository;
	
	@Autowired
	NumberOfFloorRepository floorRepo;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<NumberOfFloors>> getAllNumberOfFloor() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	@GetMapping("/last")
	public ResponseEntity<NumberOfFloors> getOneNumberOfFloor() {
		List<NumberOfFloors> numOptional = (List<NumberOfFloors>) repository.findAll();
		return new ResponseEntity<>(numOptional.get(numOptional.size()-1), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<NumberOfFloors> createNewNumberOfFloor(@RequestBody NumberOfFloors num) {
		return new ResponseEntity<>(repository.save(num), HttpStatus.OK);
	}
	
	// upload
	@Transactional
	@PostMapping("/upload")
	public ResponseEntity<List<NumberOfFloors>> uploadNumberOfFloor(@RequestBody List<NumberOfFloors> num) {
		return new ResponseEntity<>(floorRepo.saveAll(num),HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<NumberOfFloors> getNumberOfFloor(@PathVariable Integer id) {
		Optional<NumberOfFloors> numOptional = repository.findById(id);
		return numOptional.map(num -> new ResponseEntity<>(num, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<NumberOfFloors> updateNumberOfFloor(@PathVariable Integer id, @RequestBody NumberOfFloors num) {
		Optional<NumberOfFloors> numOptional = repository.findById(id);
		return numOptional.map(n -> {
			num.setId(n.getId());
			return new ResponseEntity<>(repository.save(num), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<NumberOfFloors> deleteNumberOfFloor(@PathVariable Integer id) {
		Optional<NumberOfFloors> numOptional = repository.findById(id);
		return numOptional.map(n -> {
			repository.remove(id);
			return new ResponseEntity<>(n, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
