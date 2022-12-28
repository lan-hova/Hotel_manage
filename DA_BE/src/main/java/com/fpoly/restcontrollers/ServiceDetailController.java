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

import com.fpoly.entities.ServiceDetails;
import com.fpoly.repositories.irepo.IServiceDetailService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/service-detail")
public class ServiceDetailController {

	@Autowired
	IServiceDetailService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<ServiceDetails>> getAllServiceDetail() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<ServiceDetails> createNewServiceDetail(@RequestBody ServiceDetails svdetail) {
		return new ResponseEntity<>(repository.save(svdetail), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<ServiceDetails> getServiceDetail(@PathVariable Integer id) {
		Optional<ServiceDetails> serviceOptional = repository.findById(id);
		return serviceOptional.map(service -> new ResponseEntity<>(service, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<ServiceDetails> updateServiceDetail(@PathVariable Integer id, @RequestBody ServiceDetails svdetail) {
		Optional<ServiceDetails> svdetailOptional = repository.findById(id);
		return svdetailOptional.map(s -> {
			svdetail.setId(s.getId());
			return new ResponseEntity<>(repository.save(svdetail), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<ServiceDetails> deleteServiceDetail(@PathVariable Integer id) {
		Optional<ServiceDetails> svdetailOptional = repository.findById(id);
		return svdetailOptional.map(s -> {
			repository.remove(id);
			return new ResponseEntity<>(s, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
