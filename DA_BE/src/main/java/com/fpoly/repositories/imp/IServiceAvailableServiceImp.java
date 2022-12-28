/**
 * 
 */
package com.fpoly.repositories.imp;

import java.util.List;
import java.util.Optional;

import com.fpoly.entities.Rooms;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ServiceAvailable;
import com.fpoly.repositories.irepo.IServiceAvailableService;
import com.fpoly.repositories.repo.ServiceAvailableRepository;

/**
 *
 * @author trucnv
 *
 */
@Service
public class IServiceAvailableServiceImp implements IServiceAvailableService {

	@Autowired
	private ServiceAvailableRepository svaRepo;

	@Override
	public Iterable<ServiceAvailable> findAll() {
		return svaRepo.findAll();
	}

	@Override
	public Optional<ServiceAvailable> findById(Integer id) {
		return svaRepo.findById(id);
	}

	@Override
	public ServiceAvailable save(ServiceAvailable t) {
		return svaRepo.save(t);
	}

	@Override
	public void remove(Integer id) {
		svaRepo.deleteById(id);
	}

	@Override
	public List<ServiceAvailable> findByRoomsAndStatus(Rooms rooms, int status) {
		return svaRepo.findByRoomsAndStatus(rooms, status);
	}
}
