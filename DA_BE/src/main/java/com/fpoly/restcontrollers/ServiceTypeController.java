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

import com.fpoly.entities.ServiceType;
import com.fpoly.repositories.irepo.IServiceTypeService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/service-type")
public class ServiceTypeController {

	@Autowired
	IServiceTypeService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<ServiceType>> getAllServiceType() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<ServiceType> createNewServiceType(@RequestBody ServiceType serviceType) {
		return new ResponseEntity<>(repository.save(serviceType), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<ServiceType> getServiceType(@PathVariable Integer id) {
		Optional<ServiceType> serviceTypeOptional = repository.findById(id);
		return serviceTypeOptional.map(serviceType -> new ResponseEntity<>(serviceType, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<ServiceType> updateServiceType(@PathVariable Integer id, @RequestBody ServiceType serviceType) {
		Optional<ServiceType> serviceTypeOptional = repository.findById(id);
		return serviceTypeOptional.map(s -> {
			serviceType.setId(s.getId());
			return new ResponseEntity<>(repository.save(serviceType), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<ServiceType> deleteServiceType(@PathVariable Integer id) {
		Optional<ServiceType> serviceTypeOptional = repository.findById(id);
		return serviceTypeOptional.map(s -> {
			repository.remove(id);
			return new ResponseEntity<>(s, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
