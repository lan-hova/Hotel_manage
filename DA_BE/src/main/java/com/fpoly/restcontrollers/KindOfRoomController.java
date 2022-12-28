/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.fpoly.dto.DetailKindOfRoomResponseDTO;
import com.fpoly.dto.ImageDTO;
import com.fpoly.dto.KindOfRoomAndImageRequestDTO;
import com.fpoly.entities.ImageKindOfRoom;
import com.fpoly.repositories.imp.IImageKindOfRoomServiceImp;
import com.fpoly.repositories.repo.ImageKindOfRoomRepository;
import com.fpoly.repositories.repo.KindOfRoomRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.fpoly.entities.KindOfRoom;
import com.fpoly.entities.NumberOfFloors;
import com.fpoly.repositories.irepo.IKindOfRoomService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/kind-of-room")
public class KindOfRoomController {

	@Autowired
	IKindOfRoomService repository;

	@Autowired
	IImageKindOfRoomServiceImp iImageKindOfRoomServiceImp;

	@Autowired
	ImageKindOfRoomRepository imageKindOfRoomRepository;
	
	@Autowired
	KindOfRoomRepository kindRoomRepo;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<KindOfRoom>> getAllKindOfRoom() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<KindOfRoom> createNewKindOfRoom(@RequestBody KindOfRoom kind) {
		return new ResponseEntity<>(repository.save(kind), HttpStatus.OK);
	}
	
	// upload
	@Transactional
	@PostMapping("/upload")
	public ResponseEntity<List<KindOfRoom>> uploadKindOfRoom(@RequestBody List<KindOfRoom> kindRoom) {
		return new ResponseEntity<>(kindRoomRepo.saveAll(kindRoom),HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<KindOfRoom> getKindOfRoom(@PathVariable Integer id) {
		Optional<KindOfRoom> kindOptional = repository.findById(id);
		return kindOptional.map(kind -> new ResponseEntity<>(kind, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<KindOfRoom> updateKindOfRoom(@PathVariable Integer id, @RequestBody KindOfRoom kind) {
		Optional<KindOfRoom> kindOptional = repository.findById(id);
		return kindOptional.map(k -> {
			kind.setId(k.getId());
			return new ResponseEntity<>(repository.save(kind), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<KindOfRoom> deleteKindOfRoom(@PathVariable Integer id) {
		Optional<KindOfRoom> kindOptional = repository.findById(id);
		return kindOptional.map(k -> {
			repository.remove(id);
			return new ResponseEntity<>(k, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@Transactional
	@PostMapping("/create-ver-2")
	public ResponseEntity<KindOfRoom> createVer2(@RequestBody KindOfRoomAndImageRequestDTO kindOfRoomAndImageRequestDTO) {
		KindOfRoom kindOfRoom = repository.save(kindOfRoomAndImageRequestDTO.getKindOfRoom());
		List<ImageKindOfRoom> imageKindOfRoomList = new ArrayList<>();
		for (ImageDTO i : kindOfRoomAndImageRequestDTO.getImageList()) {
			if(i.getStatusDelete().equals("NO")) {
				ImageKindOfRoom imageKindOfRoom = new ImageKindOfRoom();
				imageKindOfRoom.setUrl(i.getUrl());
				imageKindOfRoom.setKindOfRoom(kindOfRoom);
				imageKindOfRoom.setStatus(1);
				imageKindOfRoomList.add(imageKindOfRoom);
			}
		}
		List<ImageKindOfRoom> imageKindOfRoomListResponse = imageKindOfRoomRepository.saveAll(imageKindOfRoomList);
		return new ResponseEntity<>(kindOfRoom, HttpStatus.OK);
	}

	@Transactional
	@GetMapping("/detail/{idKindOfRoom}")
	public ResponseEntity<?> detail(@PathVariable Integer idKindOfRoom) {
		KindOfRoom kindOfRoom = repository.findById(idKindOfRoom).get();
		List<ImageKindOfRoom> imageKindOfRoomList = iImageKindOfRoomServiceImp.getImageListByKindOfRoomId(kindOfRoom.getId());
		DetailKindOfRoomResponseDTO detailKindOfRoomResponseDTO = new DetailKindOfRoomResponseDTO(kindOfRoom, imageKindOfRoomList);
		return new ResponseEntity<>(detailKindOfRoomResponseDTO, HttpStatus.OK);
	}

	@Transactional
	@PostMapping("/update")
	public ResponseEntity<KindOfRoom> update(@RequestBody KindOfRoomAndImageRequestDTO kindOfRoomAndImageRequestDTO) {
		KindOfRoom kindOfRoom = repository.save(kindOfRoomAndImageRequestDTO.getKindOfRoom());
		if(kindOfRoomAndImageRequestDTO.getImageList() != null) {
			List<ImageKindOfRoom> imageKindOfRoomList = new ArrayList<>();
			for (ImageDTO i : kindOfRoomAndImageRequestDTO.getImageList()) {
				if(i.getStatusDelete().equals("NO") && i.getId() == 0) {
					ImageKindOfRoom imageKindOfRoom = new ImageKindOfRoom();
					imageKindOfRoom.setUrl(i.getUrl());
					imageKindOfRoom.setKindOfRoom(kindOfRoom);
					imageKindOfRoom.setStatus(1);
					imageKindOfRoomList.add(imageKindOfRoom);
				}
			}
			List<ImageKindOfRoom> imageKindOfRoomListResponse = imageKindOfRoomRepository.saveAll(imageKindOfRoomList);
		}
		if(kindOfRoomAndImageRequestDTO.getImageListDelete() != null) {
			List<ImageKindOfRoom> imageKindOfRoomListDelete = new ArrayList<>();
			for (ImageDTO i : kindOfRoomAndImageRequestDTO.getImageListDelete()) {
				if(i.getStatusDelete().equals("YES") && i.getId() != 0) {
					ImageKindOfRoom imageKindOfRoom = iImageKindOfRoomServiceImp.findById(i.getId()).get();
					imageKindOfRoomListDelete.add(imageKindOfRoom);
				}
			}
			imageKindOfRoomRepository.deleteAll(imageKindOfRoomListDelete);
		}
		return new ResponseEntity<>(kindOfRoom, HttpStatus.OK);
	}
}
