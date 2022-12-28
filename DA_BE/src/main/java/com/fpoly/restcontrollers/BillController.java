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

import com.fpoly.entities.Bills;
import com.fpoly.repositories.irepo.IBillService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/bill")
public class BillController {

	@Autowired
	IBillService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Bills>> getAllBill() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Bills> createNewBill(@RequestBody Bills bill) {
		return new ResponseEntity<>(repository.save(bill), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Bills> getBill(@PathVariable Integer id) {
		Optional<Bills> billOptional = repository.findById(id);
		return billOptional.map(bill -> new ResponseEntity<>(bill, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Bills> updateBill(@PathVariable Integer id, @RequestBody Bills bill) {
		Optional<Bills> billOptional = repository.findById(id);
		return billOptional.map(b -> {
			bill.setId(b.getId());
			return new ResponseEntity<>(repository.save(bill), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Bills> deleteBill(@PathVariable Integer id) {
		Optional<Bills> billOptional = repository.findById(id);
		return billOptional.map(b -> {
			repository.remove(id);
			return new ResponseEntity<>(b, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
