/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.entities.Users;
import com.fpoly.repositories.irepo.IUserService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	IUserService repository;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Users>> getAllPost() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Users> createNewPost(@RequestBody Users user) {
		Users u = user;
		u.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));;
		return new ResponseEntity<>(repository.save(u), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Users> getPost(@PathVariable Integer id) {
		Optional<Users> userOptional = repository.findById(id);
		return userOptional.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Users> updatePost(@PathVariable Integer id, @RequestBody Users user) {
		Optional<Users> userOptional = repository.findById(id);
		return userOptional.map(u -> {
			user.setId(u.getId());
			return new ResponseEntity<>(repository.save(user), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Users> deletePost(@PathVariable Integer id) {
		Optional<Users> postOptional = repository.findById(id);
		return postOptional.map(u -> {
			repository.remove(id);
			return new ResponseEntity<>(u, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
