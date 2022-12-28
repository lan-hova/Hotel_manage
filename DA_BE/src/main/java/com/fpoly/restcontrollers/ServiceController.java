/**
 * 
 */
package com.fpoly.restcontrollers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fpoly.dto.ServiceByTypeDTO;
import com.fpoly.dto.ServicesDTO;
import com.fpoly.repositories.irepo.IServiceTypeService;
import com.fpoly.repositories.repo.ServiceRepository;
import com.fpoly.repositories.repo.ServiceTypeRepository;

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
import com.fpoly.entities.ServiceType;
import com.fpoly.entities.Servicess;
import com.fpoly.repositories.irepo.IServiceService;

/**
 *
 * @author trucnv
 *
 */
@RestController
@CrossOrigin("*")
@RequestMapping("/api/service")
public class ServiceController {

	@Autowired IServiceService repository;

	@Autowired IServiceTypeService repoIServiceTypeService;
	
	@Autowired
	ServiceRepository serviceRepo;
	
	@Autowired
	ServiceTypeRepository serviceTypeRepo;

	// getAll
	@GetMapping
	public ResponseEntity<Iterable<Servicess>> getAllService() {
		return new ResponseEntity<>(repository.findAll(), HttpStatus.OK);
	}

	// add new
	@PostMapping
	public ResponseEntity<Servicess> createNewService(@RequestBody Servicess service) {
		return new ResponseEntity<>(repository.save(service), HttpStatus.OK);
	}
	
	// upload
	@Transactional
	@PostMapping("/upload")
	public ResponseEntity<List<Servicess>> uploadService(@RequestBody List<ServicesDTO> service) {
		List<Servicess> listService = new ArrayList<Servicess>();
		for (ServicesDTO servicess : service) {
			ServiceType serviceType = serviceTypeRepo.getById(servicess.getServiceType());
			Servicess servicesss = new Servicess();
			servicesss.setName(servicess.getName());
			servicesss.setNote(servicess.getNote());
			servicesss.setPrices(servicess.getPrices());
			servicesss.setServiceType(serviceType);
			servicesss.setStatus(servicess.getStatus());
			listService.add(servicesss);
		}
		
		return new ResponseEntity<>(serviceRepo.saveAll(listService),HttpStatus.OK);
	}

	// getById
	@GetMapping("/{id}")
	public ResponseEntity<Servicess> getService(@PathVariable Integer id) {
		Optional<Servicess> serviceOptional = repository.findById(id);
		return serviceOptional.map(service -> new ResponseEntity<>(service, HttpStatus.OK))
				.orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// update
	@PutMapping("/{id}")
	public ResponseEntity<Servicess> updateService(@PathVariable Integer id, @RequestBody Servicess service) {
		Optional<Servicess> serviceOptional = repository.findById(id);
		return serviceOptional.map(s -> {
			service.setId(s.getId());
			return new ResponseEntity<>(repository.save(service), HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	// delete
	@DeleteMapping("/{id}")
	public ResponseEntity<Servicess> deleteService(@PathVariable Integer id) {
		Optional<Servicess> serviceOptional = repository.findById(id);
		return serviceOptional.map(s -> {
			repository.remove(id);
			return new ResponseEntity<>(s, HttpStatus.OK);
		}).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@GetMapping("/all-by-type")
	@Transactional
	public ResponseEntity<?> getAllServiceByServiceType(){
		List<Servicess> servicessList = (List<Servicess>) repository.findAll();
		Map<Integer, List<Servicess>> listServiceByServiceType = servicessList.stream().collect(Collectors.groupingBy(s -> s.getServiceType().getId()));
		List<ServiceByTypeDTO> serviceByTypeDTOList = new ArrayList<>();
		for (Integer idServiceType : listServiceByServiceType.keySet()) {
			ServiceByTypeDTO serviceByTypeDTO = new ServiceByTypeDTO();
			serviceByTypeDTO.setServiceType(repoIServiceTypeService.findById(idServiceType).get().getName());
			serviceByTypeDTO.setListService(listServiceByServiceType.get(idServiceType));
			serviceByTypeDTOList.add(serviceByTypeDTO);
		}
		return new ResponseEntity<>(serviceByTypeDTOList, HttpStatus.OK);
	}
}
