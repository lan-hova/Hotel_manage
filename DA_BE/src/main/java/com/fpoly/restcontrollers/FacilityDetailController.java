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

import com.fpoly.entities.Facilities;
import com.fpoly.entities.FacilitiesDetails;
import com.fpoly.entities.Rooms;
import com.fpoly.repositories.irepo.IFacilityDetailService;
import com.fpoly.repositories.irepo.IFacilityService;
import com.fpoly.repositories.repo.FacilityDetailRepository;
import com.fpoly.repositories.repo.RoomRepository;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/facility-detail")
public class FacilityDetailController {

	@Autowired
	IFacilityDetailService repository;

	@Autowired
	IFacilityService repositoryFacility;

	@Autowired
	RoomRepository repositoryRoom;

	@Autowired
	FacilityDetailRepository repositoryFacilityDetail;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<FacilitiesDetails>> getAllFacilityDetail() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<FacilitiesDetails> createNewFacilityDetail(@RequestBody FacilitiesDetails facilityDetail) {
		return new ResponseEntity<>(repository.save(facilityDetail), HttpStatus.OK);
	}

	@PostMapping("/{id}")
	public ResponseEntity<FacilitiesDetails> createNewFacilityDetail(@PathVariable Integer id) {
		Optional<Facilities> facilityOptional = repositoryFacility.findById(id);
		List<Rooms> f = new ArrayList<>();
		f = repositoryRoom.findAll();
		FacilitiesDetails facilityDetail = new FacilitiesDetails();
		facilityDetail.setFacilities(facilityOptional.get());
		facilityDetail.setRooms(f.get(f.size() - 1));
		facilityDetail.setStatus(1);

		return new ResponseEntity<>(repository.save(facilityDetail), HttpStatus.OK);
	}

	@PostMapping("/option/{id}")
	public ResponseEntity<List<FacilitiesDetails>> createNewFacilityDetailOption(@PathVariable Integer id) {
		Optional<Facilities> facilityOptional = repositoryFacility.findById(id);
		List<Rooms> f = repositoryRoom.findAll();
		ArrayList<FacilitiesDetails> fdl = new ArrayList<>();
		for (Rooms r : f) {
			FacilitiesDetails facilityDetail = new FacilitiesDetails();
			facilityDetail.setFacilities(facilityOptional.get());
			facilityDetail.setRooms(r);
			facilityDetail.setStatus(1);
			fdl.add(facilityDetail);
		}

		return new ResponseEntity<>(repositoryFacilityDetail.saveAll((Iterable<FacilitiesDetails>) fdl), HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<FacilitiesDetails> getFacilityDetail(@PathVariable Integer id) {
		Optional<FacilitiesDetails> facilityDetailOptional = repository.findById(id);
		return facilityDetailOptional.map(facilityDetail -> new ResponseEntity<>(facilityDetail, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}
	
	//getByRoomId
	@GetMapping("/room/{id}")
	public ResponseEntity<Iterable<FacilitiesDetails>> getByRoomId(@PathVariable Integer id) {
		Optional<Rooms> room = repositoryRoom.findById(id);
		List<FacilitiesDetails> list = (List<FacilitiesDetails>) repositoryFacilityDetail.findByRoomId(room);
		return new ResponseEntity<>(repositoryFacilityDetail.findByRoomId(room), HttpStatus.OK);
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<FacilitiesDetails> updateFacilityDetail(@PathVariable Integer id,
			@RequestBody FacilitiesDetails facilityDetail) {
		Optional<FacilitiesDetails> facilityDetailOptional = repository.findById(id);
		return facilityDetailOptional.map(f -> {
			facilityDetail.setId(f.getId());
			return new ResponseEntity<>(repository.save(facilityDetail), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<FacilitiesDetails> deleteFacilityDetail(@PathVariable Integer id) {
		Optional<FacilitiesDetails> facilityDetailOptional = repository.findById(id);
		return facilityDetailOptional.map(f -> {
			repository.remove(id);
			return new ResponseEntity<>(f, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

}
