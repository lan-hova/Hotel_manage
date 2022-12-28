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

import com.fpoly.entities.Roles;
import com.fpoly.repositories.irepo.IRoleService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/role")
public class RoleController {

	@Autowired
	IRoleService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Roles>> getAllRole() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Roles> createNewRole(@RequestBody Roles role) {
		return new ResponseEntity<>(repository.save(role), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Roles> getRole(@PathVariable Integer id) {
		Optional<Roles> roleOptional = repository.findById(id);
		return roleOptional.map(role -> new ResponseEntity<>(role, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Roles> updateRole(@PathVariable Integer id, @RequestBody Roles role) {
		Optional<Roles> roleOptional = repository.findById(id);
		return roleOptional.map(r -> {
			role.setId(r.getId());
			return new ResponseEntity<>(repository.save(role), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Roles> deleteRole(@PathVariable Integer id) {
		Optional<Roles> roleOptional = repository.findById(id);
		return roleOptional.map(r -> {
			repository.remove(id);
			return new ResponseEntity<>(r, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
