/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.Optional;

import com.fpoly.repositories.repo.CustomerRepository;
import com.fpoly.repositories.repo.RoleRepository;
import com.fpoly.repositories.repo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fpoly.dto.CustomerDTO;
import com.fpoly.entities.Customer;
import com.fpoly.entities.Roles;
import com.fpoly.entities.Users;
import com.fpoly.repositories.irepo.ICustomerService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/customer")
public class CustomerController {

	@Autowired
	ICustomerService repository;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	RoleRepository roleRepo;

	@Autowired
	CustomerRepository repository2;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Customer>> getAllCustomer() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@Transactional
	@PostMapping
	public ResponseEntity<Customer> createNewCustomer(@RequestBody CustomerDTO customer) {
		Customer c = new Customer();
		Users u = new Users();
		Roles role = new Roles();
		c.setFullname(customer.getCustomer().getFullname());
		c.setEmail(customer.getCustomer().getEmail());
		c.setGender(customer.getCustomer().getGender());
		c.setCitizenIdCode(customer.getCustomer().getCitizenIdCode());
		c.setDateOfBirth(customer.getCustomer().getDateOfBirth());
		c.setPhoneNumber(customer.getCustomer().getPhoneNumber());
		c.setAddress(customer.getCustomer().getAddress());
		c.setImg(customer.getCustomer().getImg());
		c.setNationality(customer.getCustomer().getNationality());
		c.setStatus(customer.getCustomer().getStatus());
		u.setPassword(BCrypt.hashpw(customer.getUser().getPassword(), BCrypt.gensalt()));;
		u.setUsername(customer.getUser().getUsername());
		u.setStatus(customer.getUser().getStatus());
		u.setRoles(customer.getUser().getRoles());
		role.setName("Khách hàng");
		roleRepo.save(role);
		userRepo.save(u);
		c.setUsers(u);
		return new ResponseEntity<>(repository.save(c), HttpStatus.OK);
	}
	
	@GetMapping("/nameUser/{username}")
	public ResponseEntity<Customer> getCustomerBynameUser(@PathVariable String username) {
		Optional<Customer> c = repository2.getCutomer(username);
		return c.map(customer -> new ResponseEntity<>(customer, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Customer> getCustomer(@PathVariable Integer id) {
		Optional<Customer> customerOptional = repository.findById(id);
		return customerOptional.map(customer -> new ResponseEntity<>(customer, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
		Optional<Customer> customerOptional = repository.findById(id);
		return customerOptional.map(c -> {
			customer.setId(c.getId());
			return new ResponseEntity<>(repository.save(customer), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Customer> deleteCustomer(@PathVariable Integer id) {
		Optional<Customer> customerOptional = repository.findById(id);
		return customerOptional.map(c -> {
			repository.remove(id);
			return new ResponseEntity<>(c, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
