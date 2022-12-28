/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.ArrayList;
import java.util.List;
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

import com.fpoly.entities.Rooms;
import com.fpoly.entities.ServiceAvailable;
import com.fpoly.entities.Servicess;
import com.fpoly.repositories.irepo.IServiceAvailableService;
import com.fpoly.repositories.irepo.IServiceService;
import com.fpoly.repositories.repo.RoomRepository;
import com.fpoly.repositories.repo.ServiceAvailableRepository;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/service-available")
public class ServiceAvailableController {

	@Autowired
	IServiceAvailableService repository;

	@Autowired
	IServiceService serviceRepo;

	@Autowired
	RoomRepository roomRepo;

	@Autowired
	ServiceAvailableRepository serviceAvaiRepo;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<ServiceAvailable>> getAllServiceAvailable() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<ServiceAvailable> createNewServiceAvailable(@RequestBody ServiceAvailable sva) {
		return new ResponseEntity<>(repository.save(sva), HttpStatus.OK);
	}

	@PostMapping("/{id}/{sl}")
	public ResponseEntity<ServiceAvailable> createNewServiceAvailable(@PathVariable Integer id,
			@PathVariable Integer sl) {
		System.out.println(id);
		Optional<Servicess> sv = serviceRepo.findById(id);
		List<Rooms> s = new ArrayList<>();
		s = roomRepo.findAll();
		ServiceAvailable se = new ServiceAvailable();
		se.setQuantity(sl);
		se.setServicess(sv.get());
		se.setRooms(s.get(s.size() - 1));
		se.setPrices(sv.get().getPrices());
		se.setStatus(1);

		return new ResponseEntity<>(repository.save(se), HttpStatus.OK);
	}

	@PostMapping("/Option/{id}/{sl}")
	public ResponseEntity<List<ServiceAvailable>> createNewServiceAvailableOption(@PathVariable Integer id,
			@PathVariable Integer sl) {
		List<Rooms> s = roomRepo.findAll();
		Optional<Servicess> sv = serviceRepo.findById(id);
		ArrayList<ServiceAvailable> sva = new ArrayList<>();
		for (Rooms r : s) {
			ServiceAvailable se = new ServiceAvailable();
			se.setQuantity(sl);
			se.setServicess(sv.get());
			se.setRooms(r);
			se.setPrices(sv.get().getPrices());
			se.setStatus(1);
			sva.add(se);
		}
		return new ResponseEntity<>(serviceAvaiRepo.saveAll((Iterable<ServiceAvailable>) sva), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<ServiceAvailable> getServiceAvailable(@PathVariable Integer id) {
		Optional<ServiceAvailable> svaOptional = repository.findById(id);
		return svaOptional.map(sva -> new ResponseEntity<>(sva, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}
	
	@GetMapping("/room/{id}")
	public ResponseEntity<Iterable<ServiceAvailable>> getByRoomIdsv(@PathVariable Integer id) {
		Optional<Rooms> room = roomRepo.findById(id);
		return new ResponseEntity<>(serviceAvaiRepo.findByRoomId(room), HttpStatus.OK);
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<ServiceAvailable> updateServiceAvailable(@PathVariable Integer id,
			@RequestBody ServiceAvailable sva) {
		Optional<ServiceAvailable> svaOptional = repository.findById(id);
		return svaOptional.map(s -> {
			sva.setId(s.getId());
			return new ResponseEntity<>(repository.save(sva), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<ServiceAvailable> deleteServiceAvailable(@PathVariable Integer id) {
		Optional<ServiceAvailable> svaOptional = repository.findById(id);
		return svaOptional.map(s -> {
			repository.remove(id);
			return new ResponseEntity<>(s, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
